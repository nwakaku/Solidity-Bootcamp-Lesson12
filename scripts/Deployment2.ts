import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const TEST_MINT_TOKENS = ethers.utils.parseEther("10");

async function main() {
    const accounts = await ethers.getSigners();
    const [deployer, voter, other] = accounts;
    const contractFactory = new MyToken__factory(deployer);
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log(`The tokenized votes contract was deployed at ${contract.address}\n`)

    let voterTokenBalance = await contract.balanceOf(voter.address);
    console.log(`At deployment, the voter has a total of ${voterTokenBalance} decimal units\n`)

    const mintTx = await contract.mint(voter.address, TEST_MINT_TOKENS);
    await mintTx.wait();
    voterTokenBalance = await contract.balanceOf(voter.address);
    console.log(`After minting, the voter has a total of ${voterTokenBalance} decimal units\n`)

    let votePower = await contract.getVotes(voter.address);
    console.log(`After minting, the voter has a total of ${votePower} voting power units\n`);

    let delegateTx = await contract.connect(voter).delegate(voter.address);
    await delegateTx.wait();

    votePower = await contract.getVotes(voter.address);
    console.log(`After self delegation, the voter has a total of ${votePower} voting power units\n`);

    const transferTx = await contract.connect(voter).transfer(other.address, TEST_MINT_TOKENS.div(2))
    await transferTx.wait();
    votePower = await contract.getVotes(voter.address);
    console.log(`After transfer, the voter has a total of ${votePower} voting power units\n`);

    votePower = await contract.getVotes(other.address);
    console.log(`After safe delegation, the other account has a total of ${votePower} voting power units\n`);

    delegateTx = await contract.connect(other).delegate(other.address);
    await delegateTx.wait();
    votePower = await contract.getVotes(other.address);
    console.log(`After transfer, the other account has a total of ${votePower} voting power units\n`);

    const currentBlock = await ethers.provider.getBlock("latest");
    for (let blockNumber = currentBlock.number - 1; blockNumber >= 0; blockNumber--) {
        votePower = await contract.getPastVotes(voter.address, blockNumber);
        console.log(`At block number ${blockNumber}, the voter had a total of ${votePower} voting power units\n`);
        
    }
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
})