import db from "../database/db.js";

async function testWallet(){

    try {

        const result = await db.query(
            `
            SELECT 
                id,
                user_id,
                address,
                encrypted_private_key
            FROM wallets
            LIMIT 1
            `
        );

        console.log("WALLET TROUVÉ:");
        console.log(result.rows);


    } catch(error){

        console.error("ERREUR:");
        console.error(error);

    } finally {

        process.exit();

    }

}


testWallet();