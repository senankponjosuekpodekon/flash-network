import axios from "axios";
import pool from "../database/db.js";
import walletRepository from "../repositories/wallet.repository.js";
import transactionRepository from "../repositories/transaction.repository.js";
import balanceRepository from "../repositories/balance.repository.js";
import { fullHost } from "../config/tron.js";


class DepositService {


async scan(){


const flashContract = process.env.FLASH_CONTRACT_ADDRESS;

if (!flashContract) {
console.error("FLASH_CONTRACT_ADDRESS missing in .env — skipping deposit scan");
return;
}

const wallets =
await walletRepository.findAllAddresses();



for(const wallet of wallets){


try{


console.log(
"Scanning:",
wallet.address
);



const response =
await axios.get(

`${fullHost}/v1/accounts/${wallet.address}/transactions/trc20`,

{
params:{
min_timestamp:
wallet.last_scanned_timestamp || 0,

limit:50,
contract_address: flashContract
}
}

);



const transactions =
response.data.data || [];



console.log(
"FLASH transactions found:",
transactions.length
);



for(const tx of transactions){


const from =
tx.from;


const to =
tx.to;


const amount =
tx.value;



console.log({

from,

to,

amount

});



if(
to !== wallet.address
)
continue;



const exists =
await transactionRepository.exists(
tx.transaction_id
);



if(exists)
continue;



const userWallet =
await walletRepository.findByAddress(
wallet.address
);



const client = await pool.connect();

try {
    await client.query("BEGIN");

    await client.query(
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
        ON CONFLICT DO NOTHING
        `,
        [
            userWallet.user_id,
            from,
            to,
            amount,
            tx.transaction_id,
            "CONFIRMED",
            "DEPOSIT",
            "IN",
            tx.block_height || null
        ]
    );

    await client.query(
        `
        INSERT INTO balances (user_id, balance)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET balance = balances.balance + $2, updated_at = NOW()
        `,
        [userWallet.user_id, amount]
    );

    await client.query("COMMIT");
} catch (error) {
    await client.query("ROLLBACK");
    throw error;
} finally {
    client.release();
}



console.log(
"Deposit saved & balance credited:",
tx.transaction_id
);



}



if(transactions.length > 0){


const latest = Math.max(
...transactions.map(
tx => tx.block_timestamp || 0
)
);



await walletRepository.updateScanTimestamp(
wallet.address,
latest
);


}



}
catch(error){


console.error(
"Deposit error:",
error.message
);


}



}



}



}


export default new DepositService();