import { Card, SectionHeader, AiBadge } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
import { ANALYTICS_DATA } from "@/data/mockData";

const INSIGHTS = [
  { icon: "🏭", text: "Labour Department currently has the highest average processing time (12 days). Consider following up proactively.", type: "warning" },
  { icon: "✅", text: "Approvals have improved by 40% compared to the previous quarter.", type: "success" },
  { icon: "⚠️", text: "2 applications are at risk of exceeding the statutory processing deadline.", type: "danger" },
  { icon: "📊", text: "Your overall approval rate is 85% — significantly above the national average of 72%.", type: "info" },
];

const MONTHLY_TREND = [
  { month: "Apr", compliance: 68, risk: 32 },
  { month: "May", compliance: 72, risk: 28 },
  { month: "Jun", compliance: 78, risk: 22 },
  { month: "Jul", compliance: 82, risk: 18 },
  { month: "Aug", compliance: 88, risk: 12 },
  { month: "Sep", compliance: 92, risk: 8 },
];

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Analytics & Insights" subtitle="Compliance performance analytics and AI-powered bottleneck detection." badge="AI Insights" />

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Approval Time", value: "8.2 days", sub: "vs 14 days last year", color: "blue" },
          { label: "Approval Rate", value: "85%", sub: "Above national avg", color: "green" },
          { label: "On-Time Completion", value: "78%", sub: "Target: 90%", color: "amber" },
          { label: "Pending Dept. Queries", value: "2", sub: "Needs response", color: "red" },
        ].map((m) => (
          <Card key={m.label}>
            <div className="p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{m.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.value}</p>
              <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area chart */}
        <Card className="lg:col-span-2">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Compliance Health Trend</p>
              <AiBadge label="AI Tracked" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={MONTHLY_TREND}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: 12 }} />
                <Area type="monotone" dataKey="compliance" stroke="#3b82f6" strokeWidth={2} fill="url(#compGrad)" name="Compliance %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut */}
        <Card>
          <div className="p-5">
            <p className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Application Status</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={ANALYTICS_DATA.complianceStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {ANALYTICS_DATA.complianceStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1 mt-2">
              {ANALYTICS_DATA.complianceStatus.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-gray-600">{s.name}</span>
                  <span className="ml-auto font-semibold text-gray-800">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Department processing time */}
      <Card>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Department Processing Time (Days)</p>
              <AiBadge label="Bottleneck" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ANALYTICS_DATA.departmentTime} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={130} />
              <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: 12 }} />
              <Bar dataKey="days" radius={[0, 6, 6, 0]} name="Days">
                {ANALYTICS_DATA.departmentTime.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* AI Insights */}
      <Card>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Bottleneck Analysis</p>
            <AiBadge label="Gemini" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {INSIGHTS.map((ins, i) => (
              <div key={i} className={`flex gap-3 p-4 rounded-xl ${ins.type === "success" ? "bg-emerald-50" : ins.type === "warning" ? "bg-amber-50" : ins.type === "danger" ? "bg-red-50" : "bg-blue-50"}`}>
                <span className="text-xl shrink-0">{ins.icon}</span>
                <p className="text-sm text-gray-700">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Monthly approvals bar */}
      <Card>
        <div className="p-5">
          <p className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Monthly Approvals vs Rejections</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ANALYTICS_DATA.approvalTimes}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} name="Approved" />
              <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
