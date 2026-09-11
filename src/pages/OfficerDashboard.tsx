import { useNavigate } from "react-router";
import { Card, StatCard, Badge, SectionHeader, AiBadge } from "@/components/ui";
import { OFFICER_QUEUE } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const PRIORITY_STYLES: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-emerald-100 text-emerald-700",
};

const RISK_STYLES: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const DEPT_LOAD = [
  { dept: "Fire Dept.", pending: 18, processed: 42 },
  { dept: "TNPCB", pending: 24, processed: 38 },
  { dept: "Labour", pending: 31, processed: 55 },
  { dept: "MCA", pending: 8, processed: 120 },
  { dept: "Local Auth.", pending: 15, processed: 28 },
];

export default function OfficerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">Government Officer Portal · TNPCB</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Inspector Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Asst. Director P. Suresh · Thursday, September 10, 2026</p>
        </div>
        <AiBadge label="AI Priority Queue" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Applications" value={1248} sub="All departments" icon="📋" color="blue" />
        <StatCard label="Pending Reviews" value={186} sub="Awaiting action" icon="⏳" color="amber" />
        <StatCard label="High Risk" value={42} sub="Needs priority" icon="⚠" color="red" />
        <StatCard label="Inspections Today" value={18} sub="Scheduled" icon="🔍" color="purple" />
        <StatCard label="Avg. Process Time" value="8.2d" sub="Target: 7 days" icon="⏱" color="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Priority Queue */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Priority Queue</p>
                <AiBadge label="AI Sorted" />
              </div>
              <div className="space-y-3">
                {OFFICER_QUEUE.map((app, idx) => (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-all group"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${idx === 0 ? "bg-red-100 text-red-700" : idx === 1 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{app.approval}</p>
                        <Badge className={PRIORITY_STYLES[app.priority]}>{app.priority}</Badge>
                        <Badge className={RISK_STYLES[app.risk]}>{app.risk} Risk</Badge>
                      </div>
                      <p className="text-xs text-gray-500">{app.business} · <span className="font-mono">{app.id}</span></p>
                      <p className="text-xs text-gray-400 mt-0.5">Submitted: {app.submitted} · {app.days} days pending</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-blue-400 transition-colors mt-1">→</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <Card>
            <div className="p-5">
              <p className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Department Alerts</p>
              <div className="space-y-2">
                {[
                  { icon: "🔴", text: "3 applications exceeded 45-day limit", color: "red" },
                  { icon: "⚠️", text: "Factory Department queue: 31 pending", color: "amber" },
                  { icon: "📅", text: "18 inspections scheduled for today", color: "blue" },
                  { icon: "✅", text: "Response rate this week: 92%", color: "green" },
                ].map((a, i) => (
                  <div key={i} className={`flex gap-2 p-3 rounded-xl bg-${a.color}-50 border border-${a.color}-100`}>
                    <span>{a.icon}</span>
                    <p className="text-xs text-gray-700">{a.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Insights</p>
                <AiBadge />
              </div>
              <div className="space-y-2">
                {[
                  "High-risk manufacturing application GF-2026-1021 has exceeded 45-day processing limit. Immediate action required.",
                  "TNPCB department has the highest bottleneck this week. 24 applications pending.",
                  "Inspection backlog may delay 3 applications beyond statutory timelines.",
                ].map((ins, i) => (
                  <div key={i} className="flex gap-2 p-2 bg-blue-50 rounded-lg">
                    <span className="text-blue-400 text-xs mt-0.5">✦</span>
                    <p className="text-xs text-gray-700">{ins}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Department load chart */}
      <Card>
        <div className="p-5">
          <p className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Department Workload Overview</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DEPT_LOAD}>
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: 12 }} />
              <Bar dataKey="processed" fill="#10b981" radius={[4, 4, 0, 0]} name="Processed" />
              <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
