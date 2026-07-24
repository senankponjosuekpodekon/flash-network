import axios from "axios";
import https from "https";

const agent = new https.Agent({
    family:4,
    keepAlive:true
});


export const tron = axios.create({

    baseURL:"https://nile.trongrid.io",

    timeout:30000,

    httpsAgent:agent,

    headers:{
        "TRON-PRO-API-KEY":process.env.TRON_API_KEY
    }

});