import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();


async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);
    const contractAddress = "0x9F308Ad9a1a7Ac89DE8dc7de9e32C481D68E53b8";

    const args = process.argv;


    const indexOfProposal = '1';
    const amount = ethers.utils.parseEther('2');


    let tContract: Ballot;
    const tokenContract = new Ballot__factory(signer);
    tContract = tokenContract.attach(contractAddress);
    console.log(`Attached to contract deployed at address ${tContract.address}`);
    const voteTx = await tContract.vote(indexOfProposal, amount, { gasLimit: 100000 });
    await voteTx.wait();
    console.log(`voted`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});