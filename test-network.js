import https from "https";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

https.get("https://nile.trongrid.io", (res)=>{
    console.log("STATUS:", res.statusCode);
}).on("error", err=>{
    console.error(err);
});