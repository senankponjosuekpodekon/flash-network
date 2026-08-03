import { useState } from "react";
import { api } from "../lib/api.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { Send, Loader2 } from "lucide-react";

export default function SendPage() {
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
      const res = await api.sendTrx(to, Number(amount));
      setResult(res);
      showToast("TRX sent successfully!");
      setTo("");
      setAmount("");
    } catch (err) {
      showToast(err.message, "error");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Send TRX</h1>

      <div className="card max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Destination Address</label>
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
            <label className="label">Amount (in sun, 1 TRX = 1,000,000 sun)</label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              placeholder="1000000"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send TRX
          </button>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-green-950/50 border border-green-900 rounded-lg">
            <div className="text-sm text-green-400 font-medium mb-1">Transaction sent!</div>
            <div className="text-xs font-mono text-slate-400 break-all">TXID: {result.txid}</div>
          </div>
        )}
      </div>
    </div>
  );
}
