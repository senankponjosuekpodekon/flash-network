import { useState, useEffect } from "react";
import { api } from "../lib/api.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { Wallet as WalletIcon, Plus, Loader2, Copy, Check } from "lucide-react";

export default function WalletPage() {
  const { showToast } = useToast();
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadData = async () => {
    try {
      const wal = await api.getWallet();
      setWallet(wal);
      try {
        const bal = await api.getWalletBalance();
        setBalance(bal);
      } catch {}
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await api.createWallet();
      showToast("Wallet created successfully!");
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
    setCreating(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet?.address || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-flash-400">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>

      {!wallet ? (
        <div className="card text-center py-12">
          <WalletIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">You don't have a wallet yet</p>
          <button onClick={handleCreate} disabled={creating} className="btn-primary">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create TRON Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card">
            <label className="label">Wallet Address</label>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-slate-950 rounded-lg px-4 py-3 text-sm font-mono break-all">
                {wallet.address}
              </code>
              <button onClick={copyAddress} className="btn-secondary">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {balance && (
            <div className="card">
              <label className="label">TRX Balance</label>
              <div className="text-3xl font-bold text-orange-400">
                {balance.balance} <span className="text-lg text-slate-500">TRX</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
