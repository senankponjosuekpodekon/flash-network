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

const TRON_NETWORKS = {
    nile: "https://nile.trongrid.io",
    mainnet: "https://api.trongrid.io",
};

const network = process.env.TRON_NETWORK || "nile";
const fullHost = TRON_NETWORKS[network] || TRON_NETWORKS.nile;

const baseConfig = {
    fullHost,
    headers: {
        "TRON-PRO-API-KEY": process.env.TRON_API_KEY
    },
};

const tronWeb = new TronWeb({
    ...baseConfig,
    privateKey: process.env.PRIVATE_KEY
});

// Correction du problème ETIMEDOUT rencontré
tronWeb.fullNode.instance.defaults.httpsAgent = agent;
tronWeb.solidityNode.instance.defaults.httpsAgent = agent;

tronWeb.fullNode.instance.defaults.family = 4;
tronWeb.solidityNode.instance.defaults.family = 4;

export function createTronWeb(privateKey) {
    const tw = new TronWeb({
        ...baseConfig,
        privateKey,
    });
    tw.fullNode.instance.defaults.httpsAgent = agent;
    tw.solidityNode.instance.defaults.httpsAgent = agent;
    tw.fullNode.instance.defaults.family = 4;
    tw.solidityNode.instance.defaults.family = 4;
    return tw;
}

export async function getFlashContract(privateKey) {
    const flashContractAddress = process.env.FLASH_CONTRACT_ADDRESS;
    if (!flashContractAddress) {
        throw new Error("FLASH_CONTRACT_ADDRESS missing in .env");
    }
    const tw = privateKey ? createTronWeb(privateKey) : tronWeb;
    return tw.contract().at(flashContractAddress);
}

export default tronWeb;
export { fullHost, network };