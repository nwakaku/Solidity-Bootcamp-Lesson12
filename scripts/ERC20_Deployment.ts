import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
dotenv.config()


async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    console.log(`Connected to the account of the address ${signer.address}`);
    console.log(`The balance of this account is ${balanceBN.toString()} Wei`);

const TEST_MINT_TOKENS = ethers.utils.parseEther("10");
    const voterAddress = "0x949b185ad4bb20c9A8Af5638D6E76dC0c18b9CdB"
    const contractFactory = new MyToken__factory(signer);
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log(`The tokenized votes contract was deployed at ${contract.address}\n`);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
})