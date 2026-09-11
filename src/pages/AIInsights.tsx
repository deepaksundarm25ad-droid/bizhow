import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, Badge, SectionHeader, AiBadge, ProgressBar, Spinner } from "@/components/ui";
import { DEMO_BUSINESS, RENEWALS, SCHEMES } from "@/data/mockData";
import { sendChatMessage } from "@/services/gemini";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

const RADAR_DATA = [
  { axis: "Registrations", score: 100 },
  { axis: "Licences", score: 85 },
  { axis: "Environment", score: 55 },
  { axis: "Safety", score: 70 },
  { axis: "Labour", score: 95 },
  { axis: "Tax", score: 100 },
];

const RISK_TREND = [
  { week: "W1", risk: 62 },
  { week: "W2", risk: 58 },
  { week: "W3", risk: 51 },
  { week: "W4", risk: 48 },
  { week: "W5", risk: 45 },
  { week: "W6", risk: 42 },
];

const ACTIONS = [
  { priority: "Critical", icon: "🔴", text: "Upload Environmental Impact Assessment — blocking Pollution Control NOC", action: "/documents", actionLabel: "Upload Now" },
  { priority: "Critical", icon: "🔴", text: "Respond to TNPCB department query within 7 days", action: "/applications/GF-2026-1021", actionLabel: "View Application" },
  { priority: "High", icon: "🟠", text: "Prepare premises for Fire Safety inspection on Sept 20", action: "/applications/GF-2026-1024", actionLabel: "View Details" },
  { priority: "High", icon: "🟠", text: "Upload missing documents for Local Authority Trade Licence", action: "/documents", actionLabel: "Upload Docs" },
  { priority: "Medium", icon: "🟡", text: "Review 2 government schemes with >85% eligibility match", action: "/schemes", actionLabel: "View Schemes" },
  { priority: "Low", icon: "🟢", text: "MSME Udyam Registration processing — no action needed", action: "/applications/GF-2026-1033", actionLabel: "Track Status" },
];

export default function AIInsights() {
  const navigate = useNavigate();
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const urgentRenewals = RENEWALS.filter((r) => r.daysLeft <= 30);
  const topSchemes = SCHEMES.filter((s) => s.match >= 85);
  const fallbackSummary = "NovaTech Manufacturing Pvt Ltd maintains a strong compliance health of 92%. Two critical items require immediate attention: the Environmental Impact Assessment upload blocking the Pollution Control NOC, and an unanswered TNPCB department query. Two licence renewals are due within 30 days — proactive renewal is recommended.";

  useEffect(() => {
    setLoading(true);
    sendChatMessage([], `Give a brief 3-sentence overall compliance health summary for NovaTech Manufacturing Pvt Ltd, Tamil Nadu. Mention: compliance is 92%, 2 critical items pending (EIA upload and TNPCB query), and 2 renewals within 30 days. Be concise and professional.`)
      .then((txt) => { setAiSummary(txt.startsWith("AI service is unavailable") ? fallbackSummary : txt); setLoading(false); })
      .catch(() => {
        setAiSummary(fallbackSummary);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <SectionHeader
        title="AI Compliance Intelligence"
        subtitle="Real-time AI analysis of your compliance health, risk trends, and recommended actions."
        badge="Gemini AI"
      />

      {/* AI Summary Card */}
      <Card>
        <div className="p-6" style={{ background: "linear-gradient(135deg, #0a1628 0%, #1d3461 100%)", borderRadius: "0.75rem" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-400/20 flex items-center justify-center text-blue-300 text-lg">✦</div>
            <div>
              <p className="text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>GovFlow AI — Compliance Summary</p>
              <p className="text-xs text-blue-300">Powered by Google Gemini · Updated just now</p>
            </div>
            {loading && <Spinner />}
          </div>
          {loading ? (
            <div className="space-y-2">
              <div className="skeleton h-4 w-full" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="skeleton h-4 w-4/5" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="skeleton h-4 w-3/5" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>
          ) : (
            <p className="text-sm text-blue-100 leading-relaxed">{aiSummary}</p>
          )}
        </div>
      </Card>

      {/* Health metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Compliance Health", value: "92%", sub: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Overall Risk", value: "Low", sub: "Score: 18/100", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Actions", value: "4", sub: "2 critical", color: "text-red-600", bg: "bg-red-50" },
          { label: "Eligible Schemes", value: "6", sub: "3 highly matched", color: "text-blue-600", bg: "bg-blue-50" },
        ].map((m) => (
          <Card key={m.label}>
            <div className={`p-5 ${m.bg} rounded-xl`}>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{m.label}</p>
              <p className={`text-2xl font-bold mt-1 ${m.color}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar chart */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Compliance Coverage Map</p>
              <AiBadge label="AI Scored" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "#64748b" }} />
                <Radar name="Compliance" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.18} strokeWidth={2} />
                <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {RADAR_DATA.map((d) => (
                <div key={d.axis} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.score >= 90 ? "#10b981" : d.score >= 70 ? "#f59e0b" : "#ef4444" }} />
                  <span className="text-[10px] text-gray-500">{d.axis}: {d.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Upcoming risks */}
        <Card>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Upcoming Risks & Deadlines</p>
              <AiBadge />
            </div>
            <div className="space-y-3">
              {urgentRenewals.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                  <span className="text-red-400 text-sm animate-pulse-soft">🔴</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500">Due {r.dueDate} · <span className="text-red-600 font-semibold">{r.daysLeft} days left</span></p>
                  </div>
                  <button onClick={() => navigate("/licences")} className="text-xs text-red-600 hover:text-red-800 font-semibold shrink-0">Renew →</button>
                </div>
              ))}
              {[
                { text: "Potential delay: TNPCB application at 80+ days (limit: 45 days)", color: "amber" },
                { text: "Environmental coverage gap identified — 2 documents missing", color: "amber" },
                { text: "Factory Licence renewal due in 242 days — plan ahead", color: "blue" },
              ].map((ins, i) => (
                <div key={i} className={`flex gap-2 p-3 rounded-xl bg-${ins.color}-50 border border-${ins.color}-100`}>
                  <span className="text-sm">{ins.color === "amber" ? "⚠️" : "ℹ️"}</span>
                  <p className="text-xs text-gray-700">{ins.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recommended Actions */}
      <Card>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Recommended Actions</p>
            <AiBadge label="Priority Sorted" />
          </div>
          <div className="space-y-2">
            {ACTIONS.map((a, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <span className="text-lg shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{a.text}</p>
                </div>
                <Badge className={
                  a.priority === "Critical" ? "bg-red-100 text-red-700 shrink-0" :
                  a.priority === "High" ? "bg-orange-100 text-orange-700 shrink-0" :
                  a.priority === "Medium" ? "bg-amber-100 text-amber-700 shrink-0" :
                  "bg-emerald-100 text-emerald-700 shrink-0"
                }>{a.priority}</Badge>
                <button
                  onClick={() => navigate(a.action)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold shrink-0 whitespace-nowrap"
                >
                  {a.actionLabel} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Eligible schemes */}
      <Card>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI-Recommended Government Schemes</p>
              <AiBadge label="Matched" />
            </div>
            <button onClick={() => navigate("/schemes")} className="text-xs text-blue-600 hover:text-blue-800 font-medium">View all →</button>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {topSchemes.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer" onClick={() => navigate("/schemes")}>
                <div className="flex items-center justify-between mb-2">
                  <AiBadge label="Recommended" />
                  <span className="text-lg font-bold text-blue-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.match}%</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-500 mt-1">{s.authority}</p>
                <p className="text-xs text-blue-700 font-medium mt-2">{s.benefit}</p>
                <div className="mt-2 w-full h-1 bg-blue-200 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.match}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Missing documents */}
      <Card>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Missing Documents Analysis</p>
            <AiBadge />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { doc: "Environmental Impact Assessment", impact: "Blocking Pollution Control NOC", urgency: "Critical" },
              { doc: "Water Source Declaration", impact: "Required for factory compliance", urgency: "High" },
              { doc: "Fire Hydrant System Certificate", impact: "Required for Fire Safety approval", urgency: "High" },
              { doc: "Electrical Safety Audit Report", impact: "Required for Fire Safety approval", urgency: "Medium" },
            ].map((d, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-red-400 text-lg shrink-0">✗</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{d.doc}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.impact}</p>
                </div>
                <Badge className={d.urgency === "Critical" ? "bg-red-100 text-red-700 shrink-0" : d.urgency === "High" ? "bg-orange-100 text-orange-700 shrink-0" : "bg-amber-100 text-amber-700 shrink-0"}>
                  {d.urgency}
                </Badge>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/documents")} className="mt-3 w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">Upload Missing Documents →</button>
        </div>
      </Card>
    </div>
  );
}
