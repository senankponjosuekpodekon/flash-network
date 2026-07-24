import { TronWeb } from "tronweb";
import dotenv from "dotenv";
import axios from "axios";
import https from "https";

dotenv.config();


const httpsAgent = new https.Agent({
    family: 4
});


const axiosInstance = axios.create({
    baseURL: "https://nile.trongrid.io",
    httpsAgent,
    timeout: 30000
});


const tronWeb = new TronWeb({
    fullHost: "https://nile.trongrid.io",
    privateKey: process.env.PRIVATE_KEY
});


async function main(){

    try {

        const address = tronWeb.address.fromPrivateKey(
            process.env.PRIVATE_KEY
        );

        console.log("Adresse connectée :", address);


        // Test direct API
        const response = await axiosInstance.post(
            "/walletsolidity/getaccount",
            {
                address: tronWeb.address.toHex(address)
            }
        );


        console.log("Compte TRON :");
        console.log(response.data);


        const balance =
            response.data.balance || 0;


        console.log(
            "Balance :",
            balance / 1_000_000,
            "TRX"
        );


    } catch(error){

        console.error("Erreur :", error.message);

    }

}


main();