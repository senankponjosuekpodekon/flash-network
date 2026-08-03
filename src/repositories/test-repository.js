import userRepository from "./user.repository.js";


const user =
await userRepository.create(
    "test@flash.network",
    "hash123"
);


console.log(user);


process.exit();