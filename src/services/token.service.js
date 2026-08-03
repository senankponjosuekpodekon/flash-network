export function tokenInfo() {
    return {
        name: "FLASH Network",
        symbol: "FLASH",
        network: "TRON Nile Testnet",
        contractAddress: process.env.FLASH_CONTRACT_ADDRESS || null
    };
}