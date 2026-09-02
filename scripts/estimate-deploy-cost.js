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

const network = process.env.TRON_NETWORK || "mainnet";
const fullHost = network === "mainnet" ? "https://api.trongrid.io" : "https://nile.trongrid.io";

const tronWeb = new TronWeb({
    fullHost,
    headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY }
});

async function estimate() {
    const contractPath = path.join(projectRoot, "contracts", "FLASH.sol");
    const source = fs.readFileSync(contractPath, "utf8");

    const input = {
        language: "Solidity",
        sources: { "FLASH.sol": { content: source } },
        settings: {
            outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } }
        }
    };

    const nodeModulesPath = path.join(projectRoot, "node_modules");
    function findImports(importPath) {
        if (importPath.startsWith("@openzeppelin/")) {
            return { contents: fs.readFileSync(path.join(nodeModulesPath, importPath), "utf8") };
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
    const bytecode = "0x" + contract.evm.bytecode.object;
    const bytecodeBytes = bytecode.length / 2 - 1; // minus 0x

    const ownerAddress = process.env.PRIVATE_KEY
        ? tronWeb.address.fromPrivateKey(process.env.PRIVATE_KEY)
        : "TRJHwKLx4C1XHpjUmQjQBcqWBdDz4D3JPb";

    const tx = await tronWeb.transactionBuilder.createSmartContract({
        abi: contract.abi,
        bytecode,
        feeLimit: 1_000_000_000,
        callValue: 0,
        userFeePercentage: 1,
        originEnergyLimit: 10_000_000,
        parameters: []
    }, ownerAddress);

    const rawHex = tx.raw_data_hex || "";
    const txBytes = rawHex.length / 2;

    const chainParams = await tronWeb.trx.getChainParameters();
    const energyFee = Number(chainParams.find(p => p.key === "getEnergyFee")?.value || 100);
    const bandwidthFee = Number(chainParams.find(p => p.key === "getTransactionFee")?.value || 1000);

    // Energy consumed by deployment is dominated by contract creation.
    // Solidity creation cost: 32 000 + 200 * bytecodeBytes (rough base) + execution.
    const estimatedEnergy = 32000 + 200 * bytecodeBytes;
    const energyTrx = (estimatedEnergy * energyFee) / 1_000_000;
    const bandwidthTrx = (txBytes * bandwidthFee) / 1_000_000;
    const totalTrx = energyTrx + bandwidthTrx;

    console.log({
        network,
        bytecodeBytes,
        txBytes,
        energyFee,
        bandwidthFee,
        estimatedEnergy,
        energyTrx: energyTrx.toFixed(2),
        bandwidthTrx: bandwidthTrx.toFixed(2),
        totalTrx: totalTrx.toFixed(2)
    });
}

estimate().catch(err => {
    console.error("Estimate error:", err.message);
    process.exit(1);
});
