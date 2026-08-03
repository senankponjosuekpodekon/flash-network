import db from "../database/db.js";
import { decrypt } from "../utils/crypto.js";

async function testDecrypt(){

    try {

        const result = await db.query(
            `
            SELECT
                address,
                encrypted_private_key
            FROM wallets
            LIMIT 1
            `
        );


        const wallet = result.rows[0];


        console.log("ADDRESS:");
        console.log(wallet.address);


        console.log("\nEncrypted:");
        console.log(wallet.encrypted_private_key);


        const privateKey = decrypt(
            wallet.encrypted_private_key
        );


        console.log("\nPRIVATE KEY DECRYPTED:");
        console.log(privateKey);



    } catch(error){

        console.error("ERROR:");
        console.error(error);

    }
    finally{

        process.exit();

    }

}


testDecrypt();