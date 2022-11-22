import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
dotenv.config()

// const PROPOSALS = ["Vanilla", "Lime", "Chocolate"];

// function convertStringArrayToBytes32(array: string[]) {
//     const bytes32Array = [];
//     for (let index = 0; index < array.length; index++) {
//         bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
//     }
//     return bytes32Array;
// }

async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    console.log(`Connected to the account of the address ${signer.address}`);
    console.log(`The balance of this account is ${balanceBN.toString()} Wei`);

const TEST_MINT_TOKENS = ethers.utils.parseEther("10");
    const voterAddress = "0x949b185ad4bb20c9A8Af5638D6E76dC0c18b9CdB"

// async function main() {
//     const accounts = await ethers.getSigners();
//     const [deployer, voter, other] = accounts;
    const contractFactory = new MyToken__factory(signer);
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log(`The tokenized votes contract was deployed at ${contract.address}\n`)

    // let voterTokenBalance = await contract.balanceOf(voter.address);
    // console.log(`At deployment, the voter has a total of ${voterTokenBalance} decimal units\n`)

    const mintTx = await contract.mint(voterAddress, TEST_MINT_TOKENS);
    await mintTx.wait();
    let voterTokenBalance = await contract.balanceOf(voterAddress);
    console.log(`After minting, the voter has a total of ${voterTokenBalance} decimal units\n`)

    let votePower = await contract.getVotes(voterAddress);
    console.log(`After minting, the voter has a total of ${votePower} voting power units\n`);

    let delegateTx = await contract.delegate(voterAddress);
    await delegateTx.wait();

    votePower = await contract.getVotes(voterAddress);
    console.log(`After self delegation, the voter has a total of ${votePower} voting power units\n`);

    // const transferTx = await contract.connect(voter).transfer(other.address, TEST_MINT_TOKENS.div(2))
    // await transferTx.wait();
    // votePower = await contract.getVotes(voter.address);
    // console.log(`After transfer, the voter has a total of ${votePower} voting power units\n`);

    // votePower = await contract.getVotes(other.address);
    // console.log(`After safe delegation, the other account has a total of ${votePower} voting power units\n`);

    // delegateTx = await contract.connect(other).delegate(other.address);
    // await delegateTx.wait();
    // votePower = await contract.getVotes(other.address);
    // console.log(`After transfer, the other account has a total of ${votePower} voting power units\n`);

    // const currentBlock = await ethers.provider.getBlock("latest");
    // for (let blockNumber = currentBlock.number - 1; blockNumber >= 0; blockNumber--) {
    //     votePower = await contract.getPastVotes(voter.address, blockNumber);
    //     console.log(`At block number ${blockNumber}, the voter had a total of ${votePower} voting power units\n`);
        
    // }
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
})