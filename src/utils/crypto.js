import crypto from "crypto";

const algorithm = "aes-256-cbc";

const key = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY)
    .digest();

export function encrypt(text) {

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        algorithm,
        key,
        iv
    );

    let encrypted = cipher.update(
        text,
        "utf8",
        "hex"
    );

    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(data) {

    const parts = data.split(":");

    const iv = Buffer.from(parts[0], "hex");

    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        iv
    );

    let decrypted = decipher.update(
        parts[1],
        "hex",
        "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
}