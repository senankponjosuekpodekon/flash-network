import balanceRepository from "../repositories/balance.repository.js";
import transactionRepository from "../repositories/transaction.repository.js";
import userRepository from "../repositories/user.repository.js";
import pool from "../database/db.js";


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

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            await client.query(
                `INSERT INTO balances (user_id, balance) VALUES ($1, 0) ON CONFLICT (user_id) DO NOTHING`,
                [recipient.id]
            );

            const debitResult = await client.query(
                `UPDATE balances SET balance = balance - $1, updated_at = NOW()
                 WHERE user_id = $2 AND balance >= $1 RETURNING balance`,
                [amt.toString(), fromUserId]
            );

            if (debitResult.rows.length === 0) {
                throw new Error("Insufficient balance");
            }

            await client.query(
                `UPDATE balances SET balance = balance + $1, updated_at = NOW() WHERE user_id = $2`,
                [amt.toString(), recipient.id]
            );

            await client.query(
                `INSERT INTO transactions (user_id, from_address, to_address, amount, txid, status, type, direction, block_number)
                 VALUES ($1, NULL, NULL, $2, NULL, 'CONFIRMED', 'TRANSFER', 'OUT', NULL)`,
                [fromUserId, amt.toString()]
            );

            await client.query(
                `INSERT INTO transactions (user_id, from_address, to_address, amount, txid, status, type, direction, block_number)
                 VALUES ($1, NULL, NULL, $2, NULL, 'CONFIRMED', 'TRANSFER', 'IN', NULL)`,
                [recipient.id, amt.toString()]
            );

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }

        return { transferred: amt.toString(), to: toEmail };
    }

}

export default new TransferService();
