import { useState, useEffect } from "react";
import { api } from "../lib/api.js";
import { History as HistoryIcon, ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getHistory()
      .then((data) => setTransactions(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (val) => {
    if (!val) return "0";
    try {
      const bn = BigInt(val);
      const divisor = BigInt(10 ** 18);
      return `${bn / divisor}.${(bn % divisor).toString().padStart(18, "0").slice(0, 4)}`;
    } catch {
      return val;
    }
  };

  const getIcon = (tx) => {
    if (tx.direction === "IN") return <ArrowDown className="w-4 h-4 text-green-400" />;
    if (tx.direction === "OUT") return <ArrowUp className="w-4 h-4 text-red-400" />;
    return <ArrowLeftRight className="w-4 h-4 text-flash-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-flash-400">Loading history...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

      {transactions.length === 0 ? (
        <div className="card text-center py-12">
          <HistoryIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No transactions yet</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  <th className="text-left py-3 px-2">Type</th>
                  <th className="text-left py-3 px-2">Direction</th>
                  <th className="text-left py-3 px-2">From</th>
                  <th className="text-left py-3 px-2">To</th>
                  <th className="text-right py-3 px-2">Amount</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">TXID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        {getIcon(tx)}
                        <span>{tx.type || "TRANSFER"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-400">{tx.direction || "-"}</td>
                    <td className="py-3 px-2 font-mono text-xs text-slate-400 truncate max-w-[120px]">
                      {tx.from_address || "-"}
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-slate-400 truncate max-w-[120px]">
                      {tx.to_address || "-"}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">{fmt(tx.amount)}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          tx.status === "CONFIRMED"
                            ? "bg-green-950 text-green-400"
                            : tx.status === "PENDING"
                            ? "bg-yellow-950 text-yellow-400"
                            : tx.status === "FAILED"
                            ? "bg-red-950 text-red-400"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-slate-500 truncate max-w-[100px]">
                      {tx.txid?.slice(0, 12)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {transactions.map((tx, i) => (
              <div key={i} className="card py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getIcon(tx)}
                    <span className="font-medium">{tx.type || "TRANSFER"}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      tx.status === "CONFIRMED"
                        ? "bg-green-950 text-green-400"
                        : tx.status === "PENDING"
                        ? "bg-yellow-950 text-yellow-400"
                        : tx.status === "FAILED"
                        ? "bg-red-950 text-red-400"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">From: </span>
                    <span className="font-mono text-slate-400">{tx.from_address?.slice(0, 12) || "-"}...</span>
                  </div>
                  <div>
                    <span className="text-slate-500">To: </span>
                    <span className="font-mono text-slate-400">{tx.to_address?.slice(0, 12) || "-"}...</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Amount: </span>
                    <span className="font-medium">{fmt(tx.amount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">TXID: </span>
                    <span className="font-mono text-slate-500">{tx.txid?.slice(0, 10) || "-"}...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
