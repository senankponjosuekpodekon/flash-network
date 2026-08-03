import pool from "../database/db.js";
import { decrypt } from "../utils/crypto.js";


async function test(){


const result =
await pool.query(
`
SELECT
address,
encrypted_private_key
FROM wallets
WHERE address='TNwK5pxoSN9K4u5z21DpPsHSHwCLG75fYr'
`
);


const wallet =
result.rows[0];


console.log(
"ADDRESS:",
wallet.address
);


const privateKey =
decrypt(
wallet.encrypted_private_key
);


console.log(
"PRIVATE KEY:",
privateKey
);


}


test();