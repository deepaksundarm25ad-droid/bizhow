import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Select, Input } from "@/components/ui";
import { analyzeCompliance } from "@/services/gemini";

const SECTORS = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "food", label: "Food Processing" },
  { value: "chemical", label: "Chemical / Pharma" },
  { value: "textile", label: "Textile" },
  { value: "it", label: "IT / Software" },
  { value: "construction", label: "Construction" },
  { value: "logistics", label: "Logistics / Warehousing" },
  { value: "retail", label: "Retail / Trade" },
  { value: "energy", label: "Energy / Power" },
  { value: "other", label: "Other" },
];

const ACTIVITIES = [
  "Production / Manufacturing", "Warehousing / Storage", "Export / Import",
  "Retail Sales", "Office / Administration", "Research & Development",
  "Hazardous Material Handling", "Food Processing", "Mining / Quarrying",
  "Construction / Building", "Chemical Processing", "Cold Storage",
];

const STAGES = ["Planning", "Startup", "Under Construction", "Operational", "Expansion"];

const AI_RESULTS = [
  { icon: "📋", count: 12, label: "Applicable Approvals", color: "blue" },
  { icon: "📁", count: 8, label: "Required Documents", color: "purple" },
  { icon: "🔍", count: 3, label: "Mandatory Inspections", color: "amber" },
  { icon: "🔄", count: 4, label: "Renewal Requirements", color: "green" },
  { icon: "🏛", count: 5, label: "Eligible Gov Schemes", color: "teal" },
];

const CHECKLIST_PREVIEW = [
  { item: "Factory Licence (Factories Act 1948)", priority: "Critical", dept: "Labour Dept." },
  { item: "Pollution Control Board Consent (CTE/CTO)", priority: "Critical", dept: "TNPCB" },
  { item: "Fire Safety NOC", priority: "Critical", dept: "Fire & Rescue" },
  { item: "MSME/Udyam Registration", priority: "High", dept: "MSME Ministry" },
  { item: "GST Registration", priority: "Critical", dept: "Tax Authority" },
  { item: "Local Authority Trade Licence", priority: "High", dept: "Municipality" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [form, setForm] = useState({
    bizName: "NovaTech Manufacturing Pvt Ltd",
    bizType: "private_ltd",
    sector: "manufacturing",
    orgType: "Private Limited",
    state: "Tamil Nadu",
    district: "Chennai",
    city: "Sriperumbudur",
    area: "SIPCOT Industrial Area",
    size: "medium",
    investment: "5-10cr",
    employees: "150",
    stage: "Operational",
  });

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const toggleActivity = (a: string) => {
    setActivities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const runAnalysis = async () => {
    setStep(5);
    setAnalyzing(true);
    const result = await analyzeCompliance({
      "Business Name": form.bizName,
      "Industry Sector": form.sector,
      "Location": `${form.city}, ${form.state}`,
      "Project Size": form.size,
      "Business Stage": form.stage,
      "Activities": activities.join(", ") || "Manufacturing",
    });
    setAiResult(result);
    setAnalyzing(false);
  };

  const TOTAL = 5;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-xs">G</div>
          <span className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>GovFlow AI</span>
        </div>
        <p className="text-sm text-gray-500">Business Onboarding · Step {step} of {TOTAL}</p>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(step / TOTAL) * 100}%` }} />
      </div>

      <div className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl p-8 animate-fade-in">

          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Business Information</h2>
                <p className="text-sm text-gray-500 mt-1">Tell us about your business so GovFlow AI can analyze your compliance requirements.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><Input label="Business Name" value={form.bizName} onChange={set("bizName")} required /></div>
                <Select label="Industry Sector" value={form.sector} onChange={set("sector")} options={SECTORS} required />
                <Select label="Business Type" value={form.bizType} onChange={set("bizType")} options={[
                  { value: "private_ltd", label: "Private Limited" },
                  { value: "llp", label: "LLP" },
                  { value: "proprietorship", label: "Proprietorship" },
                  { value: "public_ltd", label: "Public Limited" },
                ]} required />
              </div>
              <Button onClick={() => setStep(2)} className="w-full justify-center">Continue →</Button>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Business Location</h2>
                <p className="text-sm text-gray-500 mt-1">Location determines applicable state regulations, NOCs, and environmental rules.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="State" value={form.state} onChange={set("state")} options={[
                  { value: "Tamil Nadu", label: "Tamil Nadu" },
                  { value: "Maharashtra", label: "Maharashtra" },
                  { value: "Gujarat", label: "Gujarat" },
                  { value: "Karnataka", label: "Karnataka" },
                  { value: "Telangana", label: "Telangana" },
                ]} required />
                <Input label="District" value={form.district} onChange={set("district")} required />
                <Input label="City / Town" value={form.city} onChange={set("city")} required />
                <Input label="Industrial Area / Zone" value={form.area} onChange={set("area")} />
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1 justify-center">← Back</Button>
                <Button onClick={() => setStep(3)} className="flex-1 justify-center">Continue →</Button>
              </div>
            </div>
          )}

          {/* Step 3: Project Info */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Project Information</h2>
                <p className="text-sm text-gray-500 mt-1">Project size and stage affect which licences and inspections apply.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Project Size" value={form.size} onChange={set("size")} options={[
                  { value: "micro", label: "Micro (< ₹1 Cr)" },
                  { value: "small", label: "Small (₹1–10 Cr)" },
                  { value: "medium", label: "Medium (₹10–50 Cr)" },
                  { value: "large", label: "Large (> ₹50 Cr)" },
                ]} required />
                <Select label="Investment Range" value={form.investment} onChange={set("investment")} options={[
                  { value: "lt1cr", label: "< ₹1 Crore" },
                  { value: "1-5cr", label: "₹1–5 Crore" },
                  { value: "5-10cr", label: "₹5–10 Crore" },
                  { value: "10-50cr", label: "₹10–50 Crore" },
                  { value: "gt50cr", label: "> ₹50 Crore" },
                ]} required />
                <Input label="Number of Employees" value={form.employees} onChange={set("employees")} required />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Business Stage <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {STAGES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set("stage")(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${form.stage === s ? "bg-blue-700 text-white border-blue-700" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1 justify-center">← Back</Button>
                <Button onClick={() => setStep(4)} className="flex-1 justify-center">Continue →</Button>
              </div>
            </div>
          )}

          {/* Step 4: Activities */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Business Activities</h2>
                <p className="text-sm text-gray-500 mt-1">Select all activities your business will perform. This helps AI identify specific licences.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ACTIVITIES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleActivity(a)}
                    className={`p-3 rounded-xl text-left text-sm transition-all border ${activities.includes(a) ? "bg-blue-50 border-blue-400 text-blue-800 font-medium" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-200"}`}
                  >
                    <span className="mr-2">{activities.includes(a) ? "✓" : "○"}</span>
                    {a}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(3)} className="flex-1 justify-center">← Back</Button>
                <Button onClick={runAnalysis} className="flex-1 justify-center">
                  ✦ Generate AI Compliance Plan →
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: AI Analysis */}
          {step === 5 && (
            <div className="space-y-6">
              {analyzing ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl animate-pulse-soft" style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}>✦</div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Analyzing your business profile…</h2>
                  <p className="text-sm text-gray-500">GovFlow AI is mapping applicable regulations, licences and government schemes for your specific business.</p>
                  <div className="flex flex-col gap-2 max-w-xs mx-auto text-left">
                    {["Checking sector regulations...", "Mapping Tamil Nadu state rules...", "Identifying applicable NOCs...", "Scanning government schemes..."].map((t, i) => (
                      <p key={t} className="text-xs text-blue-600 flex items-center gap-2" style={{ animationDelay: `${i * 0.5}s` }}>
                        <span className="w-3 h-3 border border-blue-400 border-t-blue-700 rounded-full animate-spin shrink-0" />
                        {t}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}>✦</div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Compliance Analysis Complete</h2>
                      <p className="text-sm text-gray-500">For {form.bizName} · {form.sector} · {form.city}, {form.state}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-5 gap-3">
                    {AI_RESULTS.map((r) => (
                      <div key={r.label} className={`text-center p-3 rounded-xl bg-${r.color}-50 border border-${r.color}-100`}>
                        <p className="text-lg">{r.icon}</p>
                        <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.count}</p>
                        <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{r.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Checklist preview */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Priority Compliance Items</p>
                    {CHECKLIST_PREVIEW.map((c) => (
                      <div key={c.item} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${c.priority === "Critical" ? "bg-red-500" : "bg-amber-400"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{c.item}</p>
                          <p className="text-xs text-gray-400">{c.dept}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.priority === "Critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{c.priority}</span>
                      </div>
                    ))}
                  </div>

                  {aiResult && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs font-semibold text-blue-700 mb-1">✦ AI Analysis</p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{aiResult}</p>
                    </div>
                  )}

                  <Button onClick={() => navigate("/dashboard")} className="w-full justify-center" size="lg">
                    Go to My Dashboard →
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
