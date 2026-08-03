import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertCircle className="w-16 h-16 text-slate-600 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-slate-400 mb-6">Page not found</p>
      <Link to="/dashboard" className="btn-primary">
        <Home className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
