import axios from "axios";
import https from "https";


const agent = new https.Agent({
    family: 4
});


async function main(){

    try {

        const response = await axios.post(
            "https://nile.trongrid.io/walletsolidity/getaccount",
            {
                address:
                "418e3de164f8b461e95fa643ae6acc0bb8d63aec84"
            },
            {
                timeout: 30000,
                httpsAgent: agent
            }
        );

        console.log(response.data);

    } catch(e){

        console.log("ERREUR");
        console.log(e.code);
        console.log(e.message);

    }

}


main();