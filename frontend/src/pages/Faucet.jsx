import { useState } from "react";
import { api } from "../lib/api.js";
import { Droplet, Loader2, Zap } from "lucide-react";

export default function FaucetPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClaim = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.claimFaucet();
      setResult(res);
      showToast("1000 FLASH claimed successfully!");
    } catch (err) {
      showToast(err.message, "error");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">FLASH Faucet</h1>

      <div className="card max-w-lg text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-flash-600/20 mb-4">
          <Droplet className="w-8 h-8 text-flash-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Claim 1000 FLASH</h2>
        <p className="text-slate-400 text-sm mb-6">
          Get free FLASH tokens for testing. Only available for wallets with less than 1000 FLASH.
        </p>

        <button onClick={handleClaim} disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Claim 1000 FLASH
        </button>

        {result && (
          <div className="mt-6 p-4 bg-green-950/50 border border-green-900 rounded-lg text-left">
            <div className="text-sm text-green-400 font-medium mb-1">Tokens minted!</div>
            <div className="text-xs font-mono text-slate-400 break-all">TXID: {result.txid}</div>
            <div className="text-xs text-slate-400 mt-1">To: {result.to}</div>
          </div>
        )}
      </div>
    </div>
  );
}
