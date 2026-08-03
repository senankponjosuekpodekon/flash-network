import express from "express";
import pool from "../database/db.js";
import { network } from "../config/tron.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const status = {
        status: "ok",
        timestamp: new Date().toISOString(),
        network,
        services: {}
    };

    try {
        await pool.query("SELECT 1");
        status.services.database = "ok";
    } catch (error) {
        status.services.database = "error";
        status.status = "degraded";
    }

    status.services.api = "ok";

    const code = status.status === "ok" ? 200 : 503;
    res.status(code).json(status);
});

export default router;
