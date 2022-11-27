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
    const contractAddress = "0xd13E7A962B93cFa84ab7435818F7d79b8e03B05e"
    const minter = "0x949b185ad4bb20c9A8Af5638D6E76dC0c18b9CdB"
    const amount = ethers.utils.parseEther("5");

    let tContract: MyToken;
    const tokenContract = new MyToken__factory(signer);
    tContract = tokenContract.attach(contractAddress);
    console.log(`Attached to contract deployed at address ${tContract.address}`);
    const delegateTx = await tContract.delegate(minter);
    await delegateTx.wait()
    // console.log({ receipt });
    let voterTokenBalance = await tContract.balanceOf(minter);
    console.log(`After self delegation, the voter has a total of ${voterTokenBalance} decimal units\n`)

    let votePower = await tContract.getVotes(minter);
    console.log(`After self delegation, the voter has a total of ${votePower} voting power units\n`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});