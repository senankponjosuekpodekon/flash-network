import axios from "axios";
import https from "https";
import dotenv from "dotenv";

dotenv.config();


const agent = new https.Agent({
    family: 4,
    keepAlive: false
});

// import {getCurrentBlock} from "./src/tron/blocks.js";

// console.log(
//     await getCurrentBlock()
// );


async function main(){

    console.log("API key présente:", !!process.env.TRON_API_KEY);


    const response = await axios.get(
        "https://nile.trongrid.io/wallet/getnowblock",
        {
            httpsAgent: agent,
            headers:{
                "TRON-PRO-API-KEY": process.env.TRON_API_KEY
            },
            timeout:60000
        }
    );


    console.log(response.data.blockID);

}


main()
.catch(console.error);