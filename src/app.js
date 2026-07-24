import walletService from "./services/wallet.service.js";

const ADDRESS = "TNwK5pxoSN9K4u5z21DpPsHSHwCLG75fYr";

async function main() {

    console.log("\n===============================");
    console.log(" FLASH NETWORK");
    console.log("===============================\n");

    console.log("Address :", ADDRESS);

    const valid = walletService.validateAddress(ADDRESS);

    console.log("Valid   :", valid);

    if (!valid) {

        console.log("Adresse invalide.");
        return;

    }

    console.log("\nReading account...");

    const account = await walletService.getAccount(ADDRESS);

    console.log(account);

    console.log("\nReading balance...");

    const balance = await walletService.getBalance(ADDRESS);

    console.log(balance + " TRX");

}

main().catch(console.error);