import pg from "pg";


const { Pool } = pg;


const pool = new Pool({

    connectionString:
        process.env.DATABASE_URL

});



pool.on(
    "connect",
    ()=>{
        console.log(
            "PostgreSQL connected"
        );
    }
);



export default pool;