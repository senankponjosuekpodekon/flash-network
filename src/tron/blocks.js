import { tron } from "./client.js";


export async function getCurrentBlock(){

    const response = await tron.get(
        "/wallet/getnowblock"
    );

    return response.data.block_header.raw_data.number;

}
