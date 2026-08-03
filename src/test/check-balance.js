import tronWeb from "../config/tron.js";

const addresses = [
    "TNwK5pxoSN9K4u5z21DpPsHSHwCLG75fYr",
    "TLycjb7Lbc8mfFU7o7XSohJfkENHimdkxA"
];


for (const address of addresses) {

    const balance =
        await tronWeb.trx.getBalance(address);

    console.log(
        address,
        balance / 1_000_000,
        "TRX"
    );

}