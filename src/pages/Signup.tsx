import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button, Input, Select } from "@/components/ui";

const BUSINESS_TYPES = [
  { value: "private_ltd", label: "Private Limited Company" },
  { value: "llp", label: "Limited Liability Partnership" },
  { value: "proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership Firm" },
  { value: "opc", label: "One Person Company" },
];

const ROLES = [
  { value: "business", label: "Business Owner / Entrepreneur" },
  { value: "compliance", label: "Compliance Manager" },
  { value: "officer", label: "Government Officer" },
  { value: "admin", label: "Administrator" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", org: "",
    bizType: "", password: "", confirm: "", role: "business",
  });

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem("govflow_auth", "true");
    localStorage.setItem("govflow_role", form.role);
    setLoading(false);
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 font-inter" style={{ background: "linear-gradient(135deg, #1c050c 0%, #3d0a17 50%, #800020 100%)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in border border-slate-100">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-6 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-lg bg-[#800020] flex items-center justify-center text-white font-extrabold text-sm shadow-xs font-inter">G</div>
          <span className="font-bold text-slate-900 font-inter">GovFlow AI</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1 font-inter">Create your account</h1>
        <p className="text-sm text-slate-500 mb-6 font-open-sans">Step {step} of 2 — {step === 1 ? "Your Information" : "Organization Details"}</p>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-[#800020]" : "bg-slate-200"} transition-all`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-[#800020]" : "bg-slate-200"} transition-all`} />
        </div>

        <form onSubmit={submit} className="space-y-4">
          {step === 1 ? (
            <>
              <Input label="Full Name" value={form.name} onChange={set("name")} placeholder="Rajan Krishnamurthy" required />
              <Input label="Email Address" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" required />
              <Input label="Phone Number" type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" required />
              <Select label="Your Role" value={form.role} onChange={set("role")} options={ROLES} required />
              <Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Min. 8 characters" required />
              <Input label="Confirm Password" type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat password" required />
            </>
          ) : (
            <>
              <Input label="Organization Name" value={form.org} onChange={set("org")} placeholder="NovaTech Manufacturing Pvt Ltd" required />
              <Select label="Business Type" value={form.bizType} onChange={set("bizType")} options={BUSINESS_TYPES} required />
              <div className="p-4 bg-rose-50/80 rounded-xl border border-rose-100 font-roboto">
                <p className="text-xs font-bold text-[#800020] mb-1">✦ AI-Powered Onboarding</p>
                <p className="text-xs text-slate-600 font-open-sans">After signup, GovFlow AI will analyze your business and generate a personalized compliance plan.</p>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            {step === 2 && (
              <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1 justify-center">← Back</Button>
            )}
            <Button type="submit" disabled={loading} className="flex-1 justify-center">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</span>
                : step === 1 ? "Continue →" : "Create Account & Start →"
              }
            </Button>
          </div>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500 font-open-sans">
          Already have an account?{" "}
          <Link to="/login" className="text-[#800020] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

