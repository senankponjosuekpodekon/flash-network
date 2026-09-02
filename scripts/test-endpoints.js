const base = process.env.BASE_URL || "http://localhost:3000";

async function request(path, options = {}) {
    const url = `${base}${path}`;
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
}

async function run() {
    const email = `tester_${Date.now()}@demo.com`;
    const password = "TestPass123!";

    const results = [];

    results.push({ name: "health", ...await request("/health") });
    results.push({ name: "token/info", ...await request("/token/info") });
    results.push({ name: "register", ...await request("/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }) });
    results.push({ name: "login", ...await request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }) });

    const token = results.find(r => r.name === "login")?.data?.token;
    if (!token) {
        console.table(results);
        console.error("No token, stopping");
        process.exit(1);
    }

    const auth = { headers: { Authorization: `Bearer ${token}` } };

    results.push({ name: "wallet/me", ...await request("/wallet/me", { ...auth }) });
    results.push({ name: "wallet/create", ...await request("/wallet/create", { method: "POST", ...auth }) });
    results.push({ name: "wallet/me after create", ...await request("/wallet/me", { ...auth }) });
    results.push({ name: "wallet/balance", ...await request("/wallet/balance", { ...auth }) });
    results.push({ name: "balance/internal", ...await request("/balance/", { ...auth }) });
    results.push({ name: "token/balance", ...await request("/token/balance", { ...auth }) });
    results.push({ name: "faucet/claim", ...await request("/faucet/claim", { method: "POST", ...auth }) });
    results.push({ name: "balance/internal after faucet", ...await request("/balance/", { ...auth }) });
    results.push({ name: "transaction/history", ...await request("/transaction/history", { ...auth }) });

    console.table(results.map(r => ({ name: r.name, status: r.status, data: JSON.stringify(r.data).slice(0, 120) })));
}

run().catch(e => { console.error(e); process.exit(1); });
