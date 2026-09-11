import { Card, Badge, SectionHeader, AiBadge, ProgressBar } from "@/components/ui";
import { APPLICATIONS, RISK_COLORS } from "@/data/mockData";

function RiskGauge({ score }: { score: number }) {
  const angle = (score / 100) * 180 - 90;
  const color = score >= 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#10b981";
  return (
    <div className="relative w-48 h-24 mx-auto">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round" />
        <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke={color} strokeWidth="16" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 282} 282`} />
        <line
          x1="100" y1="100"
          x2={100 + 60 * Math.cos((angle - 90) * Math.PI / 180)}
          y2={100 + 60 * Math.sin((angle - 90) * Math.PI / 180)}
          stroke="#0d1117" strokeWidth="3" strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="5" fill="#0d1117" />
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <p className="text-2xl font-extrabold" style={{ color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{score}</p>
        <p className="text-xs text-gray-400">/100</p>
      </div>
    </div>
  );
}

const RISK_APPS = [
  {
    id: "GF-2026-1021", name: "Pollution Control NOC", score: 72, level: "High",
    factors: ["Processing time exceeded 45-day limit", "Missing Environmental Impact Assessment", "Pending department query unanswered"],
    mitigation: "Upload EIA report immediately and respond to department query within 24 hours.",
  },
  {
    id: "GF-2026-1024", name: "Fire Safety Approval", score: 45, level: "Medium",
    factors: ["Inspection not yet completed", "One document needs review", "Critical path item for factory operations"],
    mitigation: "Prepare premises for inspection and upload NOC from building owner.",
  },
  {
    id: "GF-2026-1030", name: "Local Authority Trade Licence", score: 28, level: "Low",
    factors: ["Missing 3 documents", "Application is recent (30 days)"],
    mitigation: "Upload remaining documents at earliest to keep this application on track.",
  },
];

export default function RiskAnalysis() {
  const overallScore = Math.round(RISK_APPS.reduce((a, r) => a + r.score, 0) / RISK_APPS.length);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <SectionHeader title="AI Risk Analysis" subtitle="Real-time risk scoring and mitigation recommendations for all active applications." badge="AI Risk" />

      {/* Overall */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-bold text-gray-700">Overall Portfolio Risk</h2>
                <AiBadge label="AI Scored" />
              </div>
              <p className="text-xs text-gray-500 mb-4">Composite risk score across all active applications for NovaTech Manufacturing Pvt Ltd</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-24">High Risk</span>
                  <div className="flex-1"><ProgressBar value={33} color="#ef4444" /></div>
                  <span className="text-xs text-gray-500">1 app</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-24">Medium Risk</span>
                  <div className="flex-1"><ProgressBar value={33} color="#f59e0b" /></div>
                  <span className="text-xs text-gray-500">1 app</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-24">Low Risk</span>
                  <div className="flex-1"><ProgressBar value={33} color="#10b981" /></div>
                  <span className="text-xs text-gray-500">1 app</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <RiskGauge score={overallScore} />
              <Badge className={RISK_COLORS[overallScore >= 70 ? "High" : overallScore >= 40 ? "Medium" : "Low"] + " mt-2 text-sm px-4 py-1"}>
                {overallScore >= 70 ? "HIGH" : overallScore >= 40 ? "MEDIUM" : "LOW"} RISK
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Per-application risk */}
      <div className="space-y-4">
        {RISK_APPS.map((app) => (
          <Card key={app.id}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{app.name}</h3>
                    <Badge className={RISK_COLORS[app.level]}>{app.level.toUpperCase()} RISK</Badge>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">{app.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold" style={{ color: app.level === "High" ? "#ef4444" : app.level === "Medium" ? "#f59e0b" : "#10b981", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{app.score}</p>
                  <p className="text-xs text-gray-400">/100 risk score</p>
                </div>
              </div>

              <div className="mb-4">
                <ProgressBar value={app.score} color={app.level === "High" ? "#ef4444" : app.level === "Medium" ? "#f59e0b" : "#10b981"} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Why this score:</p>
                  <div className="space-y-1.5">
                    {app.factors.map((f, i) => (
                      <div key={i} className="flex gap-2 text-xs text-gray-600">
                        <span className={app.level === "High" ? "text-red-500" : app.level === "Medium" ? "text-amber-500" : "text-emerald-500"}>•</span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-1 mb-1">
                    <AiBadge />
                    <p className="text-xs font-semibold text-blue-700">AI Mitigation</p>
                  </div>
                  <p className="text-xs text-gray-700">{app.mitigation}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Department flow */}
      <Card>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Department Coordination Flow</h3>
            <AiBadge label="Tracked" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="px-4 py-2 bg-blue-700 text-white text-xs font-semibold rounded-lg">NovaTech Manufacturing Pvt Ltd</div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
              {[
                { name: "Ministry of Corporate Affairs", status: "Completed", color: "emerald" },
                { name: "Dept. of Labour", status: "Completed", color: "emerald" },
                { name: "MSME Ministry", status: "In Progress", color: "blue" },
              ].map((d) => (
                <div key={d.name} className={`text-center p-3 rounded-xl border ${d.color === "emerald" ? "bg-emerald-50 border-emerald-200" : "bg-blue-50 border-blue-200"}`}>
                  <p className={`text-xs font-semibold ${d.color === "emerald" ? "text-emerald-700" : "text-blue-700"}`}>{d.status === "Completed" ? "✓" : "⏳"}</p>
                  <p className="text-xs text-gray-700 mt-1">{d.name}</p>
                  <Badge className={d.color === "emerald" ? "bg-emerald-100 text-emerald-700 mt-1" : "bg-blue-100 text-blue-700 mt-1"}>{d.status}</Badge>
                </div>
              ))}
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {[
                { name: "Tamil Nadu Fire & Rescue", status: "Under Review", color: "amber" },
                { name: "TNPCB", status: "Delayed", color: "red" },
              ].map((d) => (
                <div key={d.name} className={`text-center p-3 rounded-xl border ${d.color === "amber" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                  <p className={`text-xs font-semibold ${d.color === "amber" ? "text-amber-700" : "text-red-700"}`}>{d.status === "Delayed" ? "⚠" : "⏳"}</p>
                  <p className="text-xs text-gray-700 mt-1">{d.name}</p>
                  <Badge className={d.color === "amber" ? "bg-amber-100 text-amber-700 mt-1" : "bg-red-100 text-red-700 mt-1"}>{d.status}</Badge>
                </div>
              ))}
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="px-6 py-2 border-2 border-dashed border-gray-300 text-xs font-semibold text-gray-400 rounded-lg">Final Approval · Pending</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
