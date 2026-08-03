import balanceRepository from "../repositories/balance.repository.js";
import transactionRepository from "../repositories/transaction.repository.js";
import userRepository from "../repositories/user.repository.js";


class TransferService {

    async getInternalBalance(userId) {
        const balance = await balanceRepository.getBalance(userId);
        return { balance: balance.toString(), unit: "FLASH" };
    }

    async transfer(fromUserId, toEmail, amount) {
        const recipient = await userRepository.findByEmail(toEmail);

        if (!recipient) {
            throw new Error("Recipient not found");
        }

        if (recipient.id === fromUserId) {
            throw new Error("Cannot transfer to yourself");
        }

        const amt = BigInt(amount);

        if (amt <= 0) {
            throw new Error("Amount must be positive");
        }

        await balanceRepository.transfer(fromUserId, recipient.id, amt);

        await transactionRepository.create({
            userId: fromUserId,
            from: null,
            to: null,
            amount: amt.toString(),
            txid: null,
            status: "CONFIRMED",
            type: "TRANSFER",
            direction: "OUT",
            block_number: null
        });

        await transactionRepository.create({
            userId: recipient.id,
            from: null,
            to: null,
            amount: amt.toString(),
            txid: null,
            status: "CONFIRMED",
            type: "TRANSFER",
            direction: "IN",
            block_number: null
        });

        return { transferred: amt.toString(), to: toEmail };
    }

}

export default new TransferService();
