import pool from "../database/db.js";


class WalletRepository {


    async create(
        userId,
        address,
        encryptedPrivateKey,
        publicKey
    ) {

        const result =
            await pool.query(
                `
                INSERT INTO wallets
                (
                    user_id,
                    address,
                    encrypted_private_key,
                    public_key
                )

                VALUES
                ($1,$2,$3,$4)

                RETURNING *
                `,
                [
                    userId,
                    address,
                    encryptedPrivateKey,
                    publicKey
                ]
            );

        return result.rows[0];

    }





    async findByAddress(address) {

        const result =
            await pool.query(
                `
                SELECT *
                FROM wallets
                WHERE address = $1
                `,
                [
                    address
                ]
            );

        return result.rows[0];

    }





    async findByUserId(userId) {

        const result =
            await pool.query(
                `
                SELECT
                    id,
                    user_id,
                    address,
                    public_key,
                    created_at
                FROM wallets
                WHERE user_id = $1
                ORDER BY id DESC
                LIMIT 1
                `,
                [
                    userId
                ]
            );

        return result.rows[0];

    }





    async findSecureByUserId(userId) {

        const result =
            await pool.query(
                `
                SELECT
                    id,
                    user_id,
                    address,
                    encrypted_private_key,
                    public_key,
                    created_at
                FROM wallets
                WHERE user_id = $1
                ORDER BY id DESC
                LIMIT 1
                `,
                [
                    userId
                ]
            );

        return result.rows[0];

    }

    async findAllAddresses(){

        const result =
        await pool.query(
            `
            SELECT
                id,
                user_id,
                address,
                last_scanned_timestamp
            FROM wallets
            `
        );

        return result.rows;
    }

    async updateScanTimestamp(
        address,
        timestamp
    ){

        await pool.query(
            `
            UPDATE wallets
            SET last_scanned_timestamp=$1
            WHERE address=$2
            `,
            [
                timestamp,
                address
            ]
        );

    }

}


export default new WalletRepository();