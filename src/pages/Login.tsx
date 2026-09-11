import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button, Input } from "@/components/ui";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@novatech.in");
  const [password, setPassword] = useState("demo1234");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("business");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem("govflow_auth", "true");
    localStorage.setItem("govflow_role", role);
    setLoading(false);
    navigate(role === "officer" ? "/officer" : "/dashboard");
  };

  return (
    <div className="min-h-screen flex font-inter" style={{ background: "linear-gradient(135deg, #1c050c 0%, #3d0a17 50%, #800020 100%)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 p-10 border-r border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-12 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-white text-[#800020] flex items-center justify-center font-extrabold text-sm shadow-sm font-inter">G</div>
            <span className="font-bold text-white text-lg font-inter">GovFlow AI</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 font-inter tracking-tight leading-snug">
            Intelligent Business Approvals, Licensing & Compliance
          </h2>
          <p className="text-rose-200 text-sm font-open-sans leading-relaxed">One unified platform. Every approval. Smarter statutory compliance.</p>
        </div>
        <div className="space-y-3 font-open-sans">
          {["AI-powered compliance engine", "Real-time departmental tracking", "Smart document validation", "Government scheme discovery"].map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-rose-100">
              <span className="text-rose-300 font-bold">✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in border border-slate-100">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 font-inter">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1 font-open-sans">Sign in to your GovFlow AI account</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-1.5 p-1.5 bg-slate-100/80 rounded-xl mb-6 font-roboto">
            {["business", "officer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${role === r ? "bg-[#800020] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
              >
                {r === "business" ? "🏢 Business" : r === "officer" ? "🏛 Officer" : "⚙ Admin"}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" required />
            <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />

            <div className="flex items-center justify-between font-roboto">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded accent-[#800020]" />
                Remember me
              </label>
              <button type="button" className="text-xs text-[#800020] hover:underline font-semibold">Forgot password?</button>
            </div>

            <Button type="submit" disabled={loading} className="w-full justify-center">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</span>
              ) : "Sign In →"}
            </Button>
          </form>

          <div className="mt-5 p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl font-roboto">
            <p className="text-xs text-[#800020] font-bold mb-0.5">Demo Credentials</p>
            <p className="text-xs text-slate-600">Email: <span className="font-mono">demo@novatech.in</span> · Password: <span className="font-mono">demo1234</span></p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 font-open-sans">
            New to GovFlow AI?{" "}
            <Link to="/signup" className="text-[#800020] font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

