import axios from "axios";
import walletRepository from "../repositories/wallet.repository.js";
import transactionRepository from "../repositories/transaction.repository.js";


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

`https://nile.trongrid.io/v1/accounts/${wallet.address}/transactions/trc20`,

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



await transactionRepository.create({

userId:
userWallet.user_id,


from,


to,


amount,


txid:
tx.transaction_id,


status:
"CONFIRMED",


type:
"DEPOSIT",


direction:
"IN",


block_number:
tx.block_height || null


});



console.log(
"Deposit saved:",
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