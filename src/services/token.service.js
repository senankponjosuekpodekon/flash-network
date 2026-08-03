import tronWeb from "../config/tron.js";
import walletRepository from "../repositories/wallet.repository.js";
import { decrypt } from "../utils/crypto.js";


class TokenService {

    async _getContract() {
        const flashContractAddress = process.env.FLASH_CONTRACT_ADDRESS;

        if (!flashContractAddress) {
            throw new Error("FLASH_CONTRACT_ADDRESS missing in .env");
        }

        return await tronWeb.contract().at(flashContractAddress);
    }

    async getBalance(userId) {
        const wallet = await walletRepository.findByUserId(userId);

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        const contract = await this._getContract();

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

        tronWeb.setPrivateKey(privateKey);

        const contract = await this._getContract();

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
        const contract = await this._getContract();

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