import { TronWeb } from "tronweb";
import dotenv from "dotenv";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();


const tronWeb = new TronWeb({
    fullHost: "https://nile.trongrid.io",
    headers: {
        "TRON-PRO-API-KEY": process.env.TRON_API_KEY
    },
    privateKey: process.env.PRIVATE_KEY
});


// Correction IPv4 pour Node/Axios interne
tronWeb.fullNode.instance.defaults.family = 4;
tronWeb.solidityNode.instance.defaults.family = 4;


async function send(){

try{


console.log(
"Sender:",
tronWeb.defaultAddress.base58
);


console.log("1 - Checking balance...");


const balance =
await tronWeb.trx.getBalance(
tronWeb.defaultAddress.base58
);


console.log(
"Balance:",
balance / 1_000_000,
"TRX"
);



console.log("2 - Creating transaction...");


const transaction =
await tronWeb.transactionBuilder.sendTrx(
"TNkQVRM95WvGoX5xdQyH4MeBsttGWigGYe",
10_000_000
);


console.log("Transaction created");



console.log("3 - Signing");


const signed =
await tronWeb.trx.sign(transaction);



console.log("4 - Broadcasting");


const result =
await tronWeb.trx.sendRawTransaction(
signed
);


console.log(result);


}
catch(e){

console.error("ERROR:");
console.error(e);

}

}


send();