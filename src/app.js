import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import walletRoutes from "./routes/wallet.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import balanceRoutes from "./routes/balance.routes.js";
import withdrawRoutes from "./routes/withdraw.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import tokenRoutes from "./routes/token.routes.js";
import healthRoutes from "./routes/health.routes.js";
import faucetRoutes from "./routes/faucet.routes.js";
import apiDocsRoutes from "./routes/api-docs.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

if (process.env.WORKERS_ENABLED !== "false") {
    import("./workers/confirmation.worker.js");
    import("./workers/deposit.worker.js");
}

const requiredEnv = [
    "JWT_SECRET",
    "ENCRYPTION_KEY",
    "DATABASE_URL",
    "PRIVATE_KEY",
    "TRON_API_KEY",
    "FLASH_CONTRACT_ADDRESS",
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        console.error(`Missing required env var: ${key}`);
        process.exit(1);
    }
}

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",")
        : false,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("FLASH NETWORK API ONLINE");
});

app.use("/health", healthRoutes);
app.use("/wallet", walletRoutes);
app.use("/transaction", transactionRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/balance", balanceRoutes);
app.use("/withdraw", withdrawRoutes);
app.use("/admin", adminRoutes);
app.use("/token", tokenRoutes);
app.use("/faucet", faucetRoutes);
app.use("/api-docs", apiDocsRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`FLASH API running on port ${PORT}`);
});

process.on("SIGINT", async () => {
    console.log("Shutting down...");
    const pool = (await import("./database/db.js")).default;
    await pool.end();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Shutting down...");
    const pool = (await import("./database/db.js")).default;
    await pool.end();
    process.exit(0);
});