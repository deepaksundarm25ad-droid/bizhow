import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, StatCard, Badge, ProgressBar, AiBadge } from "@/components/ui";
import { APPLICATIONS, RENEWALS, NOTIFICATIONS, DEMO_BUSINESS, STATUS_COLORS, RISK_COLORS } from "@/data/mockData";

function ComplianceRing({ value }: { value: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke={value >= 90 ? "#800020" : value >= 70 ? "#f59e0b" : "#ef4444"}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text x="70" y="65" textAnchor="middle" className="font-bold font-lato" style={{ fontSize: 28, fontWeight: 800, fill: "#111827" }}>{value}%</text>
      <text x="70" y="82" textAnchor="middle" className="font-roboto" style={{ fontSize: 10, fill: "#6b7280" }}>Compliance</text>
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [animVal, setAnimVal] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimVal(DEMO_BUSINESS.complianceHealth), 400);
    return () => clearTimeout(t);
  }, []);

  const pending = APPLICATIONS.filter((a) => !["Approved", "Rejected"].includes(a.status));
  const approved = APPLICATIONS.filter((a) => a.status === "Approved");
  const urgentRenewals = RENEWALS.filter((r) => r.status === "urgent");
  const unread = NOTIFICATIONS.filter((n) => !n.read);

  return (
    <div className="space-y-6 animate-fade-in font-inter">
      {/* Greeting */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs text-slate-500 font-open-sans">Good morning 👋</p>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5 font-inter tracking-tight">
            {DEMO_BUSINESS.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-roboto">
            <span className="font-semibold text-[#800020]">{DEMO_BUSINESS.sector}</span> · {DEMO_BUSINESS.city}, {DEMO_BUSINESS.state} · <span className="font-lato font-semibold">{DEMO_BUSINESS.employees}</span> employees
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AiBadge label="AI Active" />
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">● Risk: {DEMO_BUSINESS.riskLevel}</Badge>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Licences" value={8} sub="All in good standing" icon="✓" color="burgundy" />
        <StatCard label="Pending Applications" value={pending.length} sub="Action required on 2" icon="⏳" color="amber" />
        <StatCard label="Approvals Completed" value={approved.length} sub="Since incorporation" icon="🎯" color="green" />
        <StatCard label="Renewals Due" value={urgentRenewals.length} sub="Within 30 days" icon="📅" color="red" />
      </div>

      {/* Middle row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Compliance ring */}
        <Card>
          <div className="p-6 flex flex-col items-center text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 font-roboto">Compliance Health Score</p>
            <ComplianceRing value={animVal} />
            <Badge className="mt-3 bg-rose-50 text-[#800020] border border-rose-200 text-xs px-3.5 py-1 font-inter">Optimal Rating</Badge>
            <p className="text-xs text-slate-500 mt-2.5 max-w-[180px] font-open-sans">2 pending approvals require attention to reach 100%</p>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="lg:col-span-2">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-bold text-slate-900 font-inter">Alerts & Notifications</p>
              <button onClick={() => navigate("/notifications")} className="text-xs font-semibold text-[#800020] hover:underline font-roboto">View all →</button>
            </div>
            <div className="space-y-2">
              {unread.slice(0, 4).map((n) => (
                <div key={n.id} className={`flex gap-3 p-3 rounded-xl border ${
                  n.type === "critical" ? "bg-rose-50/70 border-rose-100" :
                  n.type === "warning" ? "bg-amber-50/70 border-amber-100" :
                  n.type === "success" ? "bg-emerald-50/70 border-emerald-100" :
                  "bg-slate-50 border-slate-100"
                }`}>
                  <span className="text-base mt-0.5">
                    {n.type === "critical" ? "🔴" : n.type === "warning" ? "⚠️" : n.type === "success" ? "✅" : "ℹ️"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate font-inter">{n.title}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5 font-open-sans">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-roboto">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Applications */}
      <Card>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-slate-900 font-inter">Active Applications</p>
              <AiBadge label="Tracked" />
            </div>
            <button onClick={() => navigate("/applications")} className="text-xs font-semibold text-[#800020] hover:underline font-roboto">View all →</button>
          </div>
          <div className="space-y-3">
            {APPLICATIONS.filter((a) => a.status !== "Approved").map((app) => (
              <div
                key={app.id}
                onClick={() => navigate(`/applications/${app.id}`)}
                className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-slate-100 hover:border-rose-200 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-slate-900 truncate font-inter">{app.name}</p>
                    <Badge className={STATUS_COLORS[app.status]}>{app.status}</Badge>
                    <Badge className={RISK_COLORS[app.risk]}>{app.risk}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-roboto">{app.department} · <span className="font-mono text-[#800020]">#{app.id}</span></p>
                  <div className="mt-2">
                    <ProgressBar value={app.progress} color={app.progress === 100 ? "#10b981" : "#800020"} />
                  </div>
                </div>
                <span className="text-slate-300 group-hover:text-[#800020] transition-colors font-bold">→</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Renewals */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-bold text-slate-900 font-inter">Upcoming Statutory Renewals</p>
              <button onClick={() => navigate("/licences")} className="text-xs font-semibold text-[#800020] hover:underline font-roboto">Manage →</button>
            </div>
            <div className="space-y-3">
              {RENEWALS.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${r.status === "urgent" ? "bg-rose-600 animate-pulse" : r.status === "upcoming" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate font-inter">{r.name}</p>
                    <p className="text-xs text-slate-500 font-roboto">Due: {r.dueDate}</p>
                  </div>
                  <span className={`text-xs font-extrabold font-lato ${r.status === "urgent" ? "text-rose-700" : r.status === "upcoming" ? "text-amber-700" : "text-emerald-700"}`}>
                    {r.daysLeft}d left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* AI Insights */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-base font-bold text-slate-900 font-inter">AI Compliance Insights</p>
              <AiBadge label="Gemini" />
            </div>
            <div className="space-y-3">
              {[
                { icon: "💚", text: "Your compliance health score is 92%. Two items require attention.", type: "success" },
                { icon: "⚠️", text: "Fire Safety inspection scheduled for Sept 20. Prepare premises checklist.", type: "warning" },
                { icon: "🔴", text: "Pollution Control NOC has exceeded the 45-day statutory review period.", type: "danger" },
                { icon: "🏛", text: "3 government incentive schemes match your manufacturing profile.", type: "info" },
              ].map((ins, i) => (
                <div key={i} className={`flex gap-3 p-3 rounded-xl text-sm border ${ins.type === "success" ? "bg-emerald-50/60 border-emerald-100" : ins.type === "warning" ? "bg-amber-50/60 border-amber-100" : ins.type === "danger" ? "bg-rose-50/60 border-rose-100" : "bg-slate-50 border-slate-100"}`}>
                  <span className="text-base">{ins.icon}</span>
                  <p className="text-xs text-slate-700 font-open-sans leading-relaxed">{ins.text}</p>
                </div>
              ))}
              <button onClick={() => navigate("/risk")} className="w-full text-center text-xs text-[#800020] hover:underline font-semibold pt-1 font-roboto">
                View Full Risk & Compliance Analysis →
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

