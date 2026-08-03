import tronWeb from "../config/tron.js";
import pool from "../database/db.js";
import { encrypt } from "../utils/crypto.js";


class WalletService {


async createWallet(userId){


    const account =
        await tronWeb.createAccount();


    const encryptedPrivateKey =
        encrypt(account.privateKey);



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

    `,

    [
        userId,
        account.address.base58,
        encryptedPrivateKey,
        account.publicKey
    ]

    );



    return {

        address:
        account.address.base58,


        publicKey:
        account.publicKey

    };


}


}


export default new WalletService();