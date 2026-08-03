import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userRepository from "../repositories/user.repository.js";


class UserService {



async register(email,password){


    const existing =
    await userRepository.findByEmail(email);


    if(existing){

        throw new Error(
            "User already exists"
        );

    }



    const passwordHash =
    await bcrypt.hash(
        password,
        10
    );



    const user =
    await userRepository.create(
        email,
        passwordHash
    );



    return {

        id:user.id,

        email:user.email

    };

}





async login(email,password){


    const user =
    await userRepository.findByEmail(
        email
    );


    if(!user){

        throw new Error(
            "Invalid credentials"
        );

    }



    const valid =
    await bcrypt.compare(
        password,
        user.password_hash
    );



    if(!valid){

        throw new Error(
            "Invalid credentials"
        );

    }



    const token =
    jwt.sign(

        {
            id:user.id,
            email:user.email
        },

        process.env.JWT_SECRET,

        {
            expiresIn:"24h"
        }

    );



    return {

        token

    };


}


}


export default new UserService();