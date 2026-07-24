import { TronWeb } from "tronweb";

const tronWeb = new TronWeb({
    fullHost: "https://nile.trongrid.io"
});


const wallet = await tronWeb.createAccount();

console.log(wallet);