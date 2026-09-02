import depositService from "../services/deposit.service.js";


console.log(
"Deposit worker started"
);


setInterval(
async()=>{


try{

await depositService.scan();


}catch(error){

console.error(
error
);

}


},
60000
);