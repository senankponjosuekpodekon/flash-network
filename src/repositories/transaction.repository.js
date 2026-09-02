import pool from "../database/db.js";


class TransactionRepository {



async create(data){


const result =
await pool.query(

`
INSERT INTO transactions
(
user_id,
from_address,
to_address,
amount,
txid,
status,
type,
direction,
block_number
)

VALUES
($1,$2,$3,$4,$5,$6,$7,$8,$9)

RETURNING *

`,

[
data.userId,
data.from,
data.to,
String(data.amount),
data.txid,
data.status,
data.type,
data.direction,
data.block_number
]

);


return result.rows[0];

}





async findByUserId(userId, page = 1, limit = 50){


const result =
await pool.query(

`
SELECT *
FROM transactions
WHERE user_id=$1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3

`,

[userId, limit, (page - 1) * limit]

);


return result.rows;


}

async confirm(txid, info){

    const result = await pool.query(

        `
        UPDATE transactions

        SET

            status='CONFIRMED',

            block_number=$1,

            confirmed_at=NOW(),

            fee=$2

        WHERE txid=$3

        RETURNING *

        `,

        [

            info.blockNumber,

            info.receipt?.net_fee ?? 0,

            txid

        ]

    );

    return result.rows[0];

}

async exists(txid){

    const result =
    await pool.query(
        `
        SELECT id
        FROM transactions
        WHERE txid=$1
        `,
        [
            txid
        ]
    );


    return result.rows.length > 0;

}

}


export default new TransactionRepository();