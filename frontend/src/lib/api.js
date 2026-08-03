const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("flash_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

export const api = {
  // Auth
  register: (email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // User
  getMe: () => request("/user/me"),

  // Wallet
  createWallet: () => request("/wallet/create", { method: "POST" }),
  getWallet: () => request("/wallet/me"),
  getWalletBalance: () => request("/wallet/balance"),

  // Transactions
  sendTrx: (to, amount) =>
    request("/transaction/send", {
      method: "POST",
      body: JSON.stringify({ to, amount }),
    }),
  getHistory: () => request("/transaction/history"),

  // Balance
  getBalance: () => request("/balance"),
  transferFlash: (to, amount) =>
    request("/balance/transfer", {
      method: "POST",
      body: JSON.stringify({ to, amount }),
    }),

  // Withdraw
  withdraw: (to, amount) =>
    request("/withdraw", {
      method: "POST",
      body: JSON.stringify({ to, amount }),
    }),

  // Token
  getTokenInfo: () => request("/token/info"),
  getTokenBalance: () => request("/token/balance"),
  sendToken: (to, amount) =>
    request("/token/send", {
      method: "POST",
      body: JSON.stringify({ to, amount }),
    }),

  // Faucet
  claimFaucet: () => request("/faucet/claim", { method: "POST" }),

  // Admin
  adminTokenInfo: () => request("/admin/token-info"),
  adminMint: (to, amount) =>
    request("/admin/mint", {
      method: "POST",
      body: JSON.stringify({ to, amount }),
    }),
  adminBurn: (amount) =>
    request("/admin/burn", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
  adminFreeze: (address) =>
    request("/admin/freeze", {
      method: "POST",
      body: JSON.stringify({ address }),
    }),
  adminUnfreeze: (address) =>
    request("/admin/unfreeze", {
      method: "POST",
      body: JSON.stringify({ address }),
    }),
  adminBlacklist: (address) =>
    request("/admin/blacklist", {
      method: "POST",
      body: JSON.stringify({ address }),
    }),
  adminRemoveBlacklist: (address) =>
    request("/admin/remove-blacklist", {
      method: "POST",
      body: JSON.stringify({ address }),
    }),
  adminConfiscate: (address) =>
    request("/admin/confiscate", {
      method: "POST",
      body: JSON.stringify({ address }),
    }),
  adminUpdateMetadata: (name, symbol) =>
    request("/admin/update-metadata", {
      method: "POST",
      body: JSON.stringify({ name, symbol }),
    }),

  // Health
  getHealth: () => request("/health"),
};
