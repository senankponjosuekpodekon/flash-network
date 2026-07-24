import { TronWeb } from "tronweb";
import dotenv from "dotenv";

dotenv.config();

const tronWeb = new TronWeb({
    fullHost: "https://nile.trongrid.io",
    headers: {
        "TRON-PRO-API-KEY": process.env.TRON_API_KEY
    },
    privateKey: process.env.TRON_PRIVATE_KEY
});

try {
    console.log("Adresse :", tronWeb.defaultAddress.base58);

    const block = await tronWeb.trx.getCurrentBlock();

    console.log("Bloc :", block.blockID);

} catch (e) {
    console.error(e);
}