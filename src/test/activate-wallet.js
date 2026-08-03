import tronWeb from "../config/tron.js";


const sender =
"TNwK5pxoSN9K4u5z21DpPsHSHwCLG75fYr";


const receiver =
"TLycjb7Lbc8mfFU7o7XSohJfkENHimdkxA";


const amount =
5 * 1_000_000; // 5 TRX


const tx =
await tronWeb.transactionBuilder.sendTrx(
    receiver,
    amount,
    sender
);


const signed =
await tronWeb.trx.sign(tx);


const result =
await tronWeb.trx.sendRawTransaction(
    signed
);


console.log(result);