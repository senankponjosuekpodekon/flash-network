import dotenv from "dotenv";
dotenv.config();

import { encrypt, decrypt } from "../utils/crypto.js";

const privateKey =
"0123456789abcdef0123456789abcdef0123456789abcdef";

const encrypted = encrypt(privateKey);

console.log("Encrypted:");

console.log(encrypted);

const decrypted = decrypt(encrypted);

console.log("");

console.log("Decrypted:");

console.log(decrypted);
