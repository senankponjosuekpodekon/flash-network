CREATE TABLE IF NOT EXISTS users (

    id SERIAL PRIMARY KEY,

    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()

);



CREATE TABLE IF NOT EXISTS wallets (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    address VARCHAR(100) UNIQUE NOT NULL,

    encrypted_private_key TEXT,

    public_key TEXT,

    last_scanned_timestamp BIGINT DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()

);



CREATE TABLE IF NOT EXISTS transactions (

    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    from_address VARCHAR(100),

    to_address VARCHAR(100),

    amount NUMERIC(40,0) NOT NULL,

    txid VARCHAR(100) NOT NULL UNIQUE,

    status VARCHAR(20)
        DEFAULT 'PENDING',

    type VARCHAR(20),

    direction VARCHAR(10),

    block_number BIGINT,

    confirmed_at TIMESTAMP,

    fee NUMERIC(40,0) DEFAULT 0,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(user_id)
    REFERENCES users(id)

);


CREATE TABLE IF NOT EXISTS balances (

    id SERIAL PRIMARY KEY,

    user_id INTEGER UNIQUE NOT NULL
        REFERENCES users(id),

    balance NUMERIC(40,0) NOT NULL DEFAULT 0,

    updated_at TIMESTAMP DEFAULT NOW()

);