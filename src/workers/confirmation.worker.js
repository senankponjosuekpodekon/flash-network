import pool from "../database/db.js";
import tronWeb from "../config/tron.js";
import transactionRepository from "../repositories/transaction.repository.js";


async function checkPendingTransactions(){

    try{

        const result =
        await pool.query(
            `
            SELECT *
            FROM transactions
            WHERE status='PENDING'
            `
        );


        const transactions =
        result.rows;


        console.log(
            "Pending transactions:",
            transactions.length
        );


        for(const tx of transactions){


            try{


                const info =
                await tronWeb.trx.getTransactionInfo(
                    tx.txid
                );


                if(info.blockNumber){


                    console.log(
                        "Confirmed:",
                        tx.txid
                    );


                    await transactionRepository.confirm(
                        tx.txid,
                        info
                    );


                }


            }catch(error){

                console.error(
                    "Transaction check error:",
                    error.message
                );

            }


        }



    }catch(error){

        console.error(
            "Worker error:",
            error.message
        );

    }

}



setInterval(
    checkPendingTransactions,
    10000
);


console.log(
    "Confirmation worker started"
);