import { useState, useEffect } from "react";
import { api } from "../lib/api.js";
import { Wallet, Zap, Coins, TrendingUp, ArrowDownToLine, ArrowLeftRight, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [internalBalance, setInternalBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.getBalance(),
      api.getTokenBalance(),
      api.getTokenInfo(),
      api.getWallet(),
    ]).then(([bal, tokenBal, info, wal]) => {
      if (bal.status === "fulfilled") setInternalBalance(bal.value);
      if (tokenBal.status === "fulfilled") setTokenBalance(tokenBal.value);
      if (info.status === "fulfilled") setTokenInfo(info.value);
      if (wal.status === "fulfilled") setWallet(wal.value);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-flash-400">Loading dashboard...</div>
      </div>
    );
  }

  const fmt = (val, decimals = 18) => {
    if (!val) return "0";
    const bn = BigInt(val);
    const divisor = BigInt(10 ** decimals);
    const whole = bn / divisor;
    const fraction = bn % divisor;
    return `${whole}.${fraction.toString().padStart(decimals, "0").slice(0, 4)}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-flash-600/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-flash-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Internal FLASH Balance</div>
              <div className="text-2xl font-bold">{fmt(internalBalance?.balance)}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">On-chain FLASH</div>
              <div className="text-2xl font-bold">{fmt(tokenBalance?.balance)}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-600/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">TRON Wallet</div>
              <div className="text-sm font-mono truncate max-w-[200px]">
                {wallet?.address || "No wallet"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token info */}
      {tokenInfo && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold mb-4">Token Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-slate-500">Name</div>
              <div className="font-medium">{tokenInfo.name}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Symbol</div>
              <div className="font-medium">{tokenInfo.symbol}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Decimals</div>
              <div className="font-medium">{tokenInfo.decimals}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Total Supply</div>
              <div className="font-medium">{fmt(tokenInfo.totalSupply)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/transfer" className="card hover:border-flash-600 transition group">
          <ArrowLeftRight className="w-6 h-6 text-flash-400 mb-2 group-hover:scale-110 transition" />
          <div className="font-medium">Transfer FLASH</div>
          <div className="text-xs text-slate-500">Off-chain, instant</div>
        </Link>
        <Link to="/withdraw" className="card hover:border-flash-600 transition group">
          <ArrowDownToLine className="w-6 h-6 text-flash-400 mb-2 group-hover:scale-110 transition" />
          <div className="font-medium">Withdraw</div>
          <div className="text-xs text-slate-500">On-chain FLASH</div>
        </Link>
        <Link to="/send" className="card hover:border-flash-600 transition group">
          <Send className="w-6 h-6 text-flash-400 mb-2 group-hover:scale-110 transition" />
          <div className="font-medium">Send TRX</div>
          <div className="text-xs text-slate-500">On-chain TRX</div>
        </Link>
        <Link to="/faucet" className="card hover:border-flash-600 transition group">
          <TrendingUp className="w-6 h-6 text-flash-400 mb-2 group-hover:scale-110 transition" />
          <div className="font-medium">Faucet</div>
          <div className="text-xs text-slate-500">Claim 1000 FLASH</div>
        </Link>
      </div>
    </div>
  );
}
