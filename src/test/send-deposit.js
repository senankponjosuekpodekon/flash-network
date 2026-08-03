import dotenv from "dotenv";
dotenv.config();

import tronWeb from "../config/tron.js";


const FROM_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY || process.env.PRIVATE_KEY;
const TO_ADDRESS = process.env.TEST_TO_ADDRESS || "TLycjb7Lbc8mfFU7o7XSohJfkENHimdkxA";
const FLASH_CONTRACT = process.env.FLASH_CONTRACT_ADDRESS;
const AMOUNT = Number(process.env.TEST_AMOUNT || 1000000);


async function send() {

    try {

        if (!FROM_PRIVATE_KEY) {
            throw new Error("TEST_PRIVATE_KEY (or PRIVATE_KEY) missing in .env");
        }

        if (!FLASH_CONTRACT) {
            throw new Error(
                "FLASH_CONTRACT_ADDRESS missing in .env\n" +
                "Deploy the contract first: node scripts/deploy-flash.js"
            );
        }

        tronWeb.setPrivateKey(FROM_PRIVATE_KEY);

        const from = tronWeb.address.fromPrivateKey(FROM_PRIVATE_KEY);

        console.log("From:", from);
        console.log("To:", TO_ADDRESS);
        console.log("FLASH contract:", FLASH_CONTRACT);
        console.log("Amount:", AMOUNT, "smallest units");

        const contract = await tronWeb.contract().at(FLASH_CONTRACT);

        const symbol = await contract.symbol().call();
        const decimals = await contract.decimals().call();
        console.log("Token:", symbol, "decimals:", decimals);

        const balance = await contract.balanceOf(from).call();
        console.log("Sender FLASH balance:", balance.toString());

        if (Number(balance) < AMOUNT) {
            throw new Error(
                `Insufficient FLASH balance. Has ${balance}, needs ${AMOUNT}. ` +
                `Mint tokens first or use the owner wallet.`
            );
        }

        console.log("Sending FLASH transfer...");

        const txid = await contract.transfer(
            TO_ADDRESS,
            AMOUNT
        ).send({
            feeLimit: 100_000_000
        });

        console.log("Transaction sent:", txid);

        console.log("Waiting for TronGrid indexing (10s)...");
        await new Promise(resolve => setTimeout(resolve, 10000));

        console.log("Ready for deposit scanner check");

    } catch (error) {
        console.error("Send deposit error:", error.message);
    }

}

send();