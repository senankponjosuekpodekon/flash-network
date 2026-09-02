import { getFlashContract, createTronWeb } from "../config/tron.js";
import tronWeb from "../config/tron.js";
import walletRepository from "../repositories/wallet.repository.js";
import { decrypt } from "../utils/crypto.js";


class TokenService {

    async getBalance(userId) {
        const wallet = await walletRepository.findByUserId(userId);

        if (!wallet) {
            return {
                address: null,
                balance: "0",
                unit: "FLASH"
            };
        }

        const contract = await getFlashContract();

        const balance = await contract.balanceOf(wallet.address).call();

        return {
            address: wallet.address,
            balance: balance.toString(),
            unit: "FLASH"
        };
    }

    async send(userId, toAddress, amount) {
        if (!toAddress) {
            throw new Error("Destination address required");
        }

        const amt = BigInt(amount);

        if (amt <= 0) {
            throw new Error("Amount must be positive");
        }

        const wallet = await walletRepository.findSecureByUserId(userId);

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        const privateKey = decrypt(wallet.encrypted_private_key);
        const localTronWeb = createTronWeb(privateKey);

        const contract = await localTronWeb.contract().at(
            process.env.FLASH_CONTRACT_ADDRESS
        );

        const balance = await contract.balanceOf(wallet.address).call();

        if (BigInt(balance.toString()) < amt) {
            throw new Error("Insufficient FLASH balance on-chain");
        }

        const txid = await contract.transfer(
            toAddress,
            amt.toString()
        ).send({
            feeLimit: 100_000_000
        });

        return { txid, amount: amt.toString(), from: wallet.address, to: toAddress };
    }

    async getInfo() {
        const contract = await getFlashContract();

        const name = await contract.name().call();
        const symbol = await contract.symbol().call();
        const decimals = await contract.decimals().call();
        const totalSupply = await contract.totalSupply().call();

        return {
            name: name.toString(),
            symbol: symbol.toString(),
            decimals: Number(decimals),
            totalSupply: totalSupply.toString(),
            contractAddress: process.env.FLASH_CONTRACT_ADDRESS
        };
    }

}

export default new TokenService();