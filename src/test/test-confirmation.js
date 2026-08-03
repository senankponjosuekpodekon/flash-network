import confirmationService
from "../services/confirmation.service.js";


const result =
await confirmationService.verify(

"ac817be353860b05322a7986327f94ffacc9dd4bf33428b6f6177471c82413ff"

);


console.log(result);