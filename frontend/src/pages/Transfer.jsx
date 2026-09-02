import { useState } from "react";
import { api } from "../lib/api.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { ArrowLeftRight, Loader2 } from "lucide-react";

export default function TransferPage() {
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
      const res = await api.transferFlash(to, Number(amount));
      setResult(res);
      showToast("FLASH transferred successfully!");
      setTo("");
      setAmount("");
    } catch (err) {
      showToast(err.message, "error");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transfer FLASH (Internal)</h1>

      <div className="card max-w-lg">
        <p className="text-sm text-slate-400 mb-4">
          Instant off-chain transfer to another FLASH Network user by email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Recipient Email</label>
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="input"
              placeholder="user@example.com"
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowLeftRight className="w-4 h-4" />}
            Transfer FLASH
          </button>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-green-950/50 border border-green-900 rounded-lg">
            <div className="text-sm text-green-400 font-medium">Transfer completed!</div>
            <div className="text-xs text-slate-400 mt-1">
              Sent {result.transferred} FLASH to {result.to}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
