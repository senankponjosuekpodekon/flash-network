import { useState } from "react";
import { api } from "../lib/api.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { Zap, Loader2 } from "lucide-react";

export default function TokenSendPage() {
  const { showToast } = useToast();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await api.sendToken(to, Number(amount));
      setResult(res);
      showToast("FLASH sent on-chain!");
      setTo("");
      setAmount("");
    } catch (err) {
      showToast(err.message, "error");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Send FLASH (On-chain)</h1>

      <div className="card max-w-lg">
        <p className="text-sm text-slate-400 mb-4">
          Send FLASH tokens directly on the TRON blockchain to any address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Destination TRON Address</label>
            <input
              type="text"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="input"
              placeholder="T..."
            />
          </div>

          <div>
            <label className="label">Amount (in base units, 1 FLASH = 10^18)</label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              placeholder="1000000000000000000"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Send FLASH
          </button>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-green-950/50 border border-green-900 rounded-lg">
            <div className="text-sm text-green-400 font-medium">Transaction sent!</div>
            <div className="text-xs font-mono text-slate-400 mt-1 break-all">TXID: {result.txid}</div>
          </div>
        )}
      </div>
    </div>
  );
}
