import { TronWeb } from "tronweb";
import dotenv from "dotenv";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();


const tronWeb = new TronWeb({
    fullHost:"https://nile.trongrid.io",
    headers:{
        "TRON-PRO-API-KEY":process.env.TRON_API_KEY
    }
});


// FORCE IPv4
tronWeb.fullNode.instance.defaults.family = 4;
tronWeb.solidityNode.instance.defaults.family = 4;



const txid =
"2ca41da28eb1247a8b85e2fb53d633554042283812966f9e94c6a28c99bb6736";


async function check(){

try{


console.log("Checking transaction:", txid);


const tx =
await tronWeb.trx.getTransaction(txid);


console.log("\nTRANSACTION:");
console.log(tx);



const info =
await tronWeb.trx.getTransactionInfo(txid);


console.log("\nINFO:");
console.log(info);



}
catch(e){

console.error("ERROR:");
console.error(e.message);

}

}


check();