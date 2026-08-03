import { TronWeb } from "tronweb";
import dns from "dns";
import https from "https";

// Force Node.js à utiliser IPv4 en priorité
dns.setDefaultResultOrder("ipv4first");

// Agent HTTPS IPv4
const agent = new https.Agent({
    family: 4,
    keepAlive: true
});

const tronWeb = new TronWeb({
    fullHost: "https://nile.trongrid.io",
    headers: {
        "TRON-PRO-API-KEY": process.env.TRON_API_KEY
    },
    privateKey: process.env.PRIVATE_KEY
});

// Correction du problème ETIMEDOUT rencontré
tronWeb.fullNode.instance.defaults.httpsAgent = agent;
tronWeb.solidityNode.instance.defaults.httpsAgent = agent;

tronWeb.fullNode.instance.defaults.family = 4;
tronWeb.solidityNode.instance.defaults.family = 4;

export default tronWeb;