import axios from "axios";
import dotenv from "dotenv";
import dns from "dns";
import https from "https";


dns.setDefaultResultOrder("ipv4first");

dotenv.config();


const agent = new https.Agent({
    family: 4
});


const address =
"418e3de164f8b461e95fa643ae6acc0bb8d63aec84";


async function testAccount(){

try{

console.log("Testing address:", address);


const response = await axios.post(
"https://nile.trongrid.io/wallet/getaccount",
{
    address
},
{
headers:{
"TRON-PRO-API-KEY":process.env.TRON_API_KEY,
"Content-Type":"application/json"
},
httpsAgent: agent,
timeout:60000
}
);


console.log("RESPONSE:");
console.log(response.data);


}catch(e){

console.log("ERROR:");
console.log(e.code);
console.log(e.message);

}

}


testAccount();