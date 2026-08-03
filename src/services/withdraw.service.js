import tronWeb from "../config/tron.js";
import walletRepository from "../repositories/wallet.repository.js";
import balanceRepository from "../repositories/balance.repository.js";
import transactionRepository from "../repositories/transaction.repository.js";
import { decrypt } from "../utils/crypto.js";


class WithdrawService {

    async withdraw(userId, toAddress, amount) {
        const flashContractAddress = process.env.FLASH_CONTRACT_ADDRESS;

        if (!flashContractAddress) {
            throw new Error("FLASH_CONTRACT_ADDRESS missing in .env");
        }

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

        await balanceRepository.debit(userId, amt);

        try {
            const privateKey = decrypt(wallet.encrypted_private_key);

            tronWeb.setPrivateKey(privateKey);

            const contract = await tronWeb.contract().at(flashContractAddress);

            const txid = await contract.transfer(
                toAddress,
                amt.toString()
            ).send({
                feeLimit: 100_000_000
            });

            await transactionRepository.create({
                userId,
                from: wallet.address,
                to: toAddress,
                amount: amt.toString(),
                txid,
                status: "PENDING",
                type: "WITHDRAW",
                direction: "OUT",
                block_number: null
            });

            return { txid, amount: amt.toString(), to: toAddress };

        } catch (error) {
            await balanceRepository.credit(userId, amt);

            console.error("Withdraw failed, balance re-credited:", error.message);

            throw new Error("Withdrawal failed, balance restored");
        }
    }

}

export default new WithdrawService();
