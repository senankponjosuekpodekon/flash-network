import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import axios from "axios";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

const agent = new https.Agent({
  family: 4,
  keepAlive: true
});

try {

  const response = await axios.get(
    "https://nile.trongrid.io/wallet/getnowblock",
    {
      httpsAgent: agent,
      timeout: 30000,
      headers:{
        "TRON-PRO-API-KEY": process.env.TRON_API_KEY
      }
    }
  );

  console.log(
    "Block:",
    response.data.block_header.raw_data.number
  );

} catch(error) {

  console.error("Erreur:", error.message);

}