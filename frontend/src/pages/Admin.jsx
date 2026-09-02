import { useState } from "react";
import { api } from "../lib/api.js";
import { useToast } from "../contexts/ToastContext.jsx";
import {
  Settings,
  Coins,
  Flame,
  Snowflake,
  Ban,
  Shield,
  Loader2,
  Pencil,
} from "lucide-react";

function AdminCard({ title, icon: Icon, children }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-flash-400" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function AdminPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(null);
  const [results, setResults] = useState({});

  const exec = async (key, fn) => {
    setLoading(key);
    try {
      const res = await fn();
      setResults({ ...results, [key]: res });
      showToast(`${key} successful!`);
    } catch (err) {
      showToast(err.message, "error");
    }
    setLoading(null);
  };

  // Mint
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");

  // Burn
  const [burnAmount, setBurnAmount] = useState("");

  // Freeze/Unfreeze/Blacklist/Confiscate
  const [targetAddr, setTargetAddr] = useState("");

  // Metadata
  const [metaName, setMetaName] = useState("");
  const [metaSymbol, setMetaSymbol] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6" /> Admin Panel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Mint */}
        <AdminCard title="Mint FLASH" icon={Coins}>
          <div className="space-y-3">
            <input
              className="input"
              placeholder="Destination address (T...)"
              value={mintTo}
              onChange={(e) => setMintTo(e.target.value)}
            />
            <input
              className="input"
              type="number"
              placeholder="Amount (base units)"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
            />
            <button
              onClick={() => exec("mint", () => api.adminMint(mintTo, Number(mintAmount)))}
              disabled={loading === "mint" || !mintTo || !mintAmount}
              className="btn-primary w-full"
            >
              {loading === "mint" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
              Mint
            </button>
            {results.mint && (
              <div className="text-xs font-mono text-slate-400 break-all">TXID: {results.mint.txid}</div>
            )}
          </div>
        </AdminCard>

        {/* Burn */}
        <AdminCard title="Burn FLASH" icon={Flame}>
          <div className="space-y-3">
            <input
              className="input"
              type="number"
              placeholder="Amount to burn (base units)"
              value={burnAmount}
              onChange={(e) => setBurnAmount(e.target.value)}
            />
            <button
              onClick={() => exec("burn", () => api.adminBurn(Number(burnAmount)))}
              disabled={loading === "burn" || !burnAmount}
              className="btn-danger w-full"
            >
              {loading === "burn" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
              Burn
            </button>
            {results.burn && (
              <div className="text-xs font-mono text-slate-400 break-all">TXID: {results.burn.txid}</div>
            )}
          </div>
        </AdminCard>

        {/* Freeze / Unfreeze */}
        <AdminCard title="Freeze / Unfreeze" icon={Snowflake}>
          <div className="space-y-3">
            <input
              className="input"
              placeholder="Address to freeze/unfreeze"
              value={targetAddr}
              onChange={(e) => setTargetAddr(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => exec("freeze", () => api.adminFreeze(targetAddr))}
                disabled={loading === "freeze" || !targetAddr}
                className="btn-secondary flex-1"
              >
                {loading === "freeze" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Snowflake className="w-4 h-4" />}
                Freeze
              </button>
              <button
                onClick={() => exec("unfreeze", () => api.adminUnfreeze(targetAddr))}
                disabled={loading === "unfreeze" || !targetAddr}
                className="btn-secondary flex-1"
              >
                Unfreeze
              </button>
            </div>
            {results.freeze && <div className="text-xs text-green-400">Frozen: {results.freeze.frozen}</div>}
            {results.unfreeze && <div className="text-xs text-green-400">Unfrozen: {results.unfreeze.unfrozen}</div>}
          </div>
        </AdminCard>

        {/* Blacklist */}
        <AdminCard title="Blacklist" icon={Ban}>
          <div className="space-y-3">
            <input
              className="input"
              placeholder="Address to blacklist/remove"
              value={targetAddr}
              onChange={(e) => setTargetAddr(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => exec("blacklist", () => api.adminBlacklist(targetAddr))}
                disabled={loading === "blacklist" || !targetAddr}
                className="btn-danger flex-1"
              >
                {loading === "blacklist" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                Blacklist
              </button>
              <button
                onClick={() => exec("removeBlacklist", () => api.adminRemoveBlacklist(targetAddr))}
                disabled={loading === "removeBlacklist" || !targetAddr}
                className="btn-secondary flex-1"
              >
                Remove
              </button>
            </div>
            {results.blacklist && <div className="text-xs text-red-400">Blacklisted: {results.blacklist.blacklisted}</div>}
            {results.removeBlacklist && <div className="text-xs text-green-400">Removed: {results.removeBlacklist.removed}</div>}
          </div>
        </AdminCard>

        {/* Confiscate */}
        <AdminCard title="Confiscate" icon={Shield}>
          <div className="space-y-3">
            <input
              className="input"
              placeholder="Address to confiscate from"
              value={targetAddr}
              onChange={(e) => setTargetAddr(e.target.value)}
            />
            <button
              onClick={() => exec("confiscate", () => api.adminConfiscate(targetAddr))}
              disabled={loading === "confiscate" || !targetAddr}
              className="btn-danger w-full"
            >
              {loading === "confiscate" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              Confiscate All Tokens
            </button>
            {results.confiscate && (
              <div className="text-xs text-red-400">Confiscated from: {results.confiscate.confiscated}</div>
            )}
          </div>
        </AdminCard>

        {/* Update Metadata */}
        <AdminCard title="Update Token Metadata" icon={Pencil}>
          <div className="space-y-3">
            <input
              className="input"
              placeholder="New token name"
              value={metaName}
              onChange={(e) => setMetaName(e.target.value)}
            />
            <input
              className="input"
              placeholder="New token symbol"
              value={metaSymbol}
              onChange={(e) => setMetaSymbol(e.target.value)}
            />
            <button
              onClick={() => exec("metadata", () => api.adminUpdateMetadata(metaName, metaSymbol))}
              disabled={loading === "metadata" || !metaName || !metaSymbol}
              className="btn-primary w-full"
            >
              {loading === "metadata" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
              Update Metadata
            </button>
            {results.metadata && (
              <div className="text-xs text-green-400">
                Updated: {results.metadata.newName} ({results.metadata.newSymbol})
              </div>
            )}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
