import express from "express";

const router = express.Router();

const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "FLASH Network API",
        version: "1.0.0",
        description: "TRON-based wallet and transaction API with FLASH TRC20 token support",
    },
    servers: [
        { url: "/", description: "Current server" }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            }
        }
    },
    paths: {
        "/auth/register": {
            post: {
                summary: "Register a new user",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string", minLength: 6 }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: "User created" }, 400: { description: "Bad request" } }
            }
        },
        "/auth/login": {
            post: {
                summary: "Login and get JWT",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "JWT token" }, 401: { description: "Invalid credentials" } }
            }
        },
        "/user/me": {
            get: {
                summary: "Get current user info",
                tags: ["User"],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "User info" }, 401: { description: "Unauthorized" } }
            }
        },
        "/wallet/create": {
            post: {
                summary: "Create a TRON wallet",
                tags: ["Wallet"],
                security: [{ bearerAuth: [] }],
                responses: { 201: { description: "Wallet created" }, 401: { description: "Unauthorized" } }
            }
        },
        "/wallet/me": {
            get: {
                summary: "Get user's wallet",
                tags: ["Wallet"],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "Wallet info" }, 401: { description: "Unauthorized" } }
            }
        },
        "/wallet/balance": {
            get: {
                summary: "Get wallet TRX balance",
                tags: ["Wallet"],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "TRX balance" }, 401: { description: "Unauthorized" } }
            }
        },
        "/transaction/send": {
            post: {
                summary: "Send TRX",
                tags: ["Transaction"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    to: { type: "string" },
                                    amount: { type: "integer", minimum: 1 }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Transaction sent" }, 400: { description: "Bad request" } }
            }
        },
        "/transaction/history": {
            get: {
                summary: "Get transaction history",
                tags: ["Transaction"],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "Transaction list" }, 401: { description: "Unauthorized" } }
            }
        },
        "/balance": {
            get: {
                summary: "Get internal FLASH balance",
                tags: ["Balance"],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "Internal balance" }, 401: { description: "Unauthorized" } }
            }
        },
        "/balance/transfer": {
            post: {
                summary: "Transfer FLASH to another user (off-chain)",
                tags: ["Balance"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    to: { type: "string", format: "email" },
                                    amount: { type: "integer", minimum: 1 }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Transfer completed" }, 400: { description: "Bad request" } }
            }
        },
        "/withdraw": {
            post: {
                summary: "Withdraw FLASH to external wallet (on-chain)",
                tags: ["Withdraw"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    to: { type: "string" },
                                    amount: { type: "integer", minimum: 1 }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Withdrawal initiated" }, 400: { description: "Bad request" } }
            }
        },
        "/token/info": {
            get: {
                summary: "Get FLASH token info (name, supply, decimals)",
                tags: ["Token"],
                responses: { 200: { description: "Token info" } }
            }
        },
        "/token/balance": {
            get: {
                summary: "Get on-chain FLASH balance",
                tags: ["Token"],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "On-chain balance" }, 401: { description: "Unauthorized" } }
            }
        },
        "/token/send": {
            post: {
                summary: "Send FLASH on-chain to any TRON address",
                tags: ["Token"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    to: { type: "string" },
                                    amount: { type: "integer", minimum: 1 }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Transaction sent" }, 400: { description: "Bad request" } }
            }
        },
        "/faucet/claim": {
            post: {
                summary: "Claim 1000 FLASH tokens (testnet faucet)",
                tags: ["Faucet"],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "Tokens minted" }, 400: { description: "Bad request" } }
            }
        },
        "/admin/token-info": {
            get: {
                summary: "Get token info (admin)",
                tags: ["Admin"],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "Token info" }, 403: { description: "Forbidden" } }
            }
        },
        "/admin/mint": {
            post: {
                summary: "Mint FLASH to an address",
                tags: ["Admin"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    to: { type: "string" },
                                    amount: { type: "integer", minimum: 1 }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Minted" }, 403: { description: "Forbidden" } }
            }
        },
        "/admin/burn": {
            post: {
                summary: "Burn FLASH from owner wallet",
                tags: ["Admin"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    amount: { type: "integer", minimum: 1 }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Burned" }, 403: { description: "Forbidden" } }
            }
        },
        "/admin/freeze": {
            post: { summary: "Freeze a wallet", tags: ["Admin"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Frozen" }, 403: { description: "Forbidden" } } }
        },
        "/admin/unfreeze": {
            post: { summary: "Unfreeze a wallet", tags: ["Admin"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Unfrozen" }, 403: { description: "Forbidden" } } }
        },
        "/admin/blacklist": {
            post: { summary: "Blacklist an address", tags: ["Admin"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Blacklisted" }, 403: { description: "Forbidden" } } }
        },
        "/admin/remove-blacklist": {
            post: { summary: "Remove from blacklist", tags: ["Admin"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Removed" }, 403: { description: "Forbidden" } } }
        },
        "/admin/confiscate": {
            post: { summary: "Confiscate all tokens from an address", tags: ["Admin"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Confiscated" }, 403: { description: "Forbidden" } } }
        },
        "/admin/update-metadata": {
            post: {
                summary: "Update token name and symbol",
                tags: ["Admin"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    symbol: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Metadata updated" }, 403: { description: "Forbidden" } }
            }
        },
        "/health": {
            get: { summary: "Health check", tags: ["System"], responses: { 200: { description: "OK" }, 503: { description: "Degraded" } } }
        }
    }
};

router.get("/", (req, res) => {
    res.json(swaggerSpec);
});

router.get("/ui", (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
    <title>FLASH Network API Docs</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        window.onload = () => {
            SwaggerUIBundle({ url: '/api-docs', dom_id: '#swagger-ui' });
        };
    </script>
</body>
</html>`);
});

export default router;
