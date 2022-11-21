import { ethers } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();


async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    console.log(`Connected to the account of the address ${signer.address}`);
    console.log(`The balance of this account is ${balanceBN.toString()} Wei`);

    const args = process.argv;
    const params = args.slice(2);
    const contractAddress = params[0];
    const minter = params[1];
    const amount = params[2];

    // if (params.length <= 0) throw new Error("Not enough parameters")
    // console.log("Deploying Ballot contract");
    // console.log("params: ");

    let ballotContract: MyToken;
    const ballotFactory = new MyToken__factory(signer);
    ballotContract = ballotFactory.attach(contractAddress);
    console.log(`Attached to contract deployed at address ${ballotContract.address}`);
    const tx = await ballotContract.mint(minter, amount);
    await tx.wait()
    // console.log({ receipt });
    let voterTokenBalance = await ballotContract.balanceOf(minter);
    console.log(`After minting, the voter has a total of ${voterTokenBalance} decimal units\n`)

    let votePower = await ballotContract.getVotes(minter);
    console.log(`After minting, the voter has a total of ${votePower} voting power units\n`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});