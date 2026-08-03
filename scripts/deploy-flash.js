import dotenv from "dotenv";
dotenv.config();

import { TronWeb } from "tronweb";
import fs from "fs";
import path from "path";
import solc from "solc";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const tronWeb = new TronWeb({
    fullHost: "https://nile.trongrid.io",
    headers: {
        "TRON-PRO-API-KEY": process.env.TRON_API_KEY
    },
    privateKey: process.env.PRIVATE_KEY
});

async function deploy() {
    if (!process.env.PRIVATE_KEY) {
        console.error("PRIVATE_KEY missing in .env");
        process.exit(1);
    }

    const owner = tronWeb.address.fromPrivateKey(process.env.PRIVATE_KEY);
    console.log("Deploying FLASH contract from:", owner);

    const contractPath = path.join(projectRoot, "contracts", "FLASH.sol");
    const source = fs.readFileSync(contractPath, "utf8");

    const input = {
        language: "Solidity",
        sources: {
            "FLASH.sol": { content: source }
        },
        settings: {
            outputSelection: {
                "*": {
                    "*": ["abi", "evm.bytecode.object"]
                }
            }
        }
    };

    const nodeModulesPath = path.join(projectRoot, "node_modules");

    function findImports(importPath) {
        if (importPath.startsWith("@openzeppelin/")) {
            const fullPath = path.join(nodeModulesPath, importPath);
            return { contents: fs.readFileSync(fullPath, "utf8") };
        }
        return { error: "File not found: " + importPath };
    }

    const output = solc.compile(JSON.stringify(input), { import: findImports });
    const compiled = JSON.parse(output);

    if (compiled.errors) {
        for (const err of compiled.errors) {
            if (err.severity === "error") {
                console.error("Solidity error:", err.formattedMessage);
                process.exit(1);
            }
        }
    }

    const contract = compiled.contracts["FLASH.sol"]["FLASH"];
    const abi = contract.abi;
    const bytecode = "0x" + contract.evm.bytecode.object;

    console.log("ABI functions:", abi.filter(f => f.type === "function").map(f => f.name));
    console.log("Bytecode length:", bytecode.length);

    const transaction = await tronWeb.transactionBuilder.createSmartContract({
        abi,
        bytecode,
        feeLimit: 1_000_000_000,
        callValue: 0,
        userFeePercentage: 1,
        originEnergyLimit: 10_000_000,
        parameters: []
    }, owner);

    const signed = await tronWeb.trx.sign(transaction, process.env.PRIVATE_KEY);
    const result = await tronWeb.trx.sendRawTransaction(signed);

    console.log("Deployment transaction:", result);

    if (!result.result) {
        console.error("Deployment failed");
        process.exit(1);
    }

    const contractAddress = tronWeb.address.fromHex(result.contract_address);
    console.log("\n========================");
    console.log("FLASH contract deployed!");
    console.log("Address:", contractAddress);
    console.log("========================");
    console.log("\nAdd this to your .env:");
    console.log(`FLASH_CONTRACT_ADDRESS=${contractAddress}`);

    const envPath = path.join(projectRoot, ".env");
    if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, "utf8");
        if (envContent.includes("FLASH_CONTRACT_ADDRESS=")) {
            envContent = envContent.replace(
                /FLASH_CONTRACT_ADDRESS=.*/,
                `FLASH_CONTRACT_ADDRESS=${contractAddress}`
            );
        } else {
            envContent += `\nFLASH_CONTRACT_ADDRESS=${contractAddress}\n`;
        }
        fs.writeFileSync(envPath, envContent);
        console.log("\n.env updated automatically.");
    }
}

deploy().catch(err => {
    console.error("Deploy error:", err.message);
    process.exit(1);
});
