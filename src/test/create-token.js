import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const token = jwt.sign(
    {
        id: 3,
        email: "test@flash.network"
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "72h"
    }
);


console.log(token);