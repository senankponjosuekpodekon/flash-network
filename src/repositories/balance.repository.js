import pool from "../database/db.js";


class BalanceRepository {

    async getBalance(userId) {
        const result = await pool.query(
            `
            SELECT balance
            FROM balances
            WHERE user_id = $1
            `,
            [userId]
        );

        if (result.rows.length === 0) {
            return 0;
        }

        return BigInt(result.rows[0].balance);
    }

    async ensureBalance(userId) {
        await pool.query(
            `
            INSERT INTO balances (user_id, balance)
            VALUES ($1, 0)
            ON CONFLICT (user_id) DO NOTHING
            `,
            [userId]
        );
    }

    async credit(userId, amount) {
        await this.ensureBalance(userId);

        const result = await pool.query(
            `
            UPDATE balances
            SET balance = balance + $1,
                updated_at = NOW()
            WHERE user_id = $2
            RETURNING balance
            `,
            [String(amount), userId]
        );

        return BigInt(result.rows[0].balance);
    }

    async debit(userId, amount) {
        await this.ensureBalance(userId);

        const result = await pool.query(
            `
            UPDATE balances
            SET balance = balance - $1,
                updated_at = NOW()
            WHERE user_id = $2
              AND balance >= $1
            RETURNING balance
            `,
            [String(amount), userId]
        );

        if (result.rows.length === 0) {
            throw new Error("Insufficient balance");
        }

        return BigInt(result.rows[0].balance);
    }

    async transfer(fromUserId, toUserId, amount) {
        await this.ensureBalance(toUserId);

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const debitResult = await client.query(
                `
                UPDATE balances
                SET balance = balance - $1,
                    updated_at = NOW()
                WHERE user_id = $2
                  AND balance >= $1
                RETURNING balance
                `,
                [String(amount), fromUserId]
            );

            if (debitResult.rows.length === 0) {
                throw new Error("Insufficient balance");
            }

            await client.query(
                `
                UPDATE balances
                SET balance = balance + $1,
                    updated_at = NOW()
                WHERE user_id = $2
                `,
                [String(amount), toUserId]
            );

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

}

export default new BalanceRepository();
