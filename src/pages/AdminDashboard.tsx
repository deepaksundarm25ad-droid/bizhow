import { useState } from "react";
import { Card, StatCard, Badge, SectionHeader, AiBadge, Button } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const USERS = [
  { id: "USR-001", name: "Rajan Krishnamurthy", email: "rajan@novatech.in", role: "Business Owner", org: "NovaTech Manufacturing", status: "Active", joined: "2026-03-01" },
  { id: "USR-002", name: "Inspector R. Murugan", email: "r.murugan@tnfire.gov.in", role: "Government Officer", org: "TN Fire & Rescue", status: "Active", joined: "2026-01-15" },
  { id: "USR-003", name: "P. Suresh", email: "p.suresh@tnpcb.gov.in", role: "Government Officer", org: "TNPCB", status: "Active", joined: "2026-01-15" },
  { id: "USR-004", name: "Compliance Mgr A. Devi", email: "a.devi@novatech.in", role: "Compliance Manager", org: "NovaTech Manufacturing", status: "Active", joined: "2026-04-01" },
  { id: "USR-005", name: "SunPower Admin", email: "admin@sunpower.in", role: "Business Owner", org: "SunPower Energy", status: "Inactive", joined: "2026-05-10" },
];

const DEPARTMENTS = [
  { name: "Tamil Nadu Fire & Rescue", code: "TNFRD", apps: 18, avgTime: "3 days", status: "Operational" },
  { name: "TNPCB", code: "TNPCB", apps: 24, avgTime: "8 days", status: "Overloaded" },
  { name: "Dept. of Labour", code: "LABOUR", apps: 31, avgTime: "12 days", status: "Overloaded" },
  { name: "Ministry of Corporate Affairs", code: "MCA", apps: 8, avgTime: "2 days", status: "Operational" },
  { name: "MSME Ministry", code: "MSME", apps: 15, avgTime: "5 days", status: "Operational" },
  { name: "Local Authority", code: "LOCAL", apps: 22, avgTime: "4 days", status: "Operational" },
];

const SYSTEM_GROWTH = [
  { month: "Apr", users: 120, apps: 280 },
  { month: "May", users: 185, apps: 430 },
  { month: "Jun", users: 240, apps: 590 },
  { month: "Jul", users: 320, apps: 780 },
  { month: "Aug", users: 410, apps: 1020 },
  { month: "Sep", users: 520, apps: 1248 },
];

const COMPLIANCE_RULES = [
  { name: "Factory Licence Threshold", rule: "Required for establishments with 10+ workers using power", applies: "Manufacturing, Chemical, Textile", active: true },
  { name: "TNPCB CTE/CTO", rule: "Mandatory for all industrial units with environmental impact", applies: "All industrial sectors", active: true },
  { name: "Fire Safety NOC", rule: "Required for buildings > 500 sq. m. or with hazardous materials", applies: "All sectors", active: true },
  { name: "ESIC Registration", rule: "Required for establishments with 10+ employees", applies: "All sectors", active: true },
];

const TABS = ["Overview", "Users", "Departments", "Compliance Rules", "AI Config"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("Overview");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <SectionHeader title="Admin Dashboard" subtitle="System administration, user management, and platform configuration." />
        <AiBadge label="Admin Mode" />
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t ? "bg-white shadow text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "Overview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={520} sub="↑ 27% this month" icon="👥" color="blue" />
            <StatCard label="Businesses" value={248} sub="Active on platform" icon="🏢" color="green" />
            <StatCard label="Applications" value={1248} sub="All time" icon="📋" color="purple" />
            <StatCard label="Approvals Issued" value={892} sub="71% approval rate" icon="✓" color="green" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-5">
                <p className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Platform Growth</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={SYSTEM_GROWTH}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: 12 }} />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} name="Users" />
                    <Line type="monotone" dataKey="apps" stroke="#10b981" strokeWidth={2} dot={false} name="Applications" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <p className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>System Health</p>
                <div className="space-y-3">
                  {[
                    { label: "API Uptime", value: "99.98%", status: "healthy" },
                    { label: "Gemini AI Availability", value: "99.7%", status: "healthy" },
                    { label: "Document Storage", value: "62% used", status: "ok" },
                    { label: "Email Notifications", value: "All delivered", status: "healthy" },
                    { label: "Database Response Time", value: "18ms avg", status: "healthy" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">{s.label}</p>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${s.status === "healthy" ? "bg-emerald-500" : "bg-amber-400"}`} />
                        <span className="text-sm font-medium text-gray-800">{s.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="p-5">
              <p className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Department Workload</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={DEPARTMENTS.map((d) => ({ name: d.code, apps: d.apps }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: 12 }} />
                  <Bar dataKey="apps" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Pending Apps" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Users */}
      {tab === "Users" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{USERS.length} users registered</p>
            <Button size="sm">+ Add User</Button>
          </div>
          <Card>
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <th className="text-left py-2 pb-3">User</th>
                    <th className="text-left py-2 pb-3">Role</th>
                    <th className="text-left py-2 pb-3">Organization</th>
                    <th className="text-left py-2 pb-3">Joined</th>
                    <th className="text-left py-2 pb-3">Status</th>
                    <th className="text-left py-2 pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {USERS.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">{u.name[0]}</div>
                          <div>
                            <p className="font-medium text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge className={u.role === "Government Officer" ? "bg-purple-100 text-purple-700" : u.role === "Business Owner" ? "bg-blue-100 text-blue-700" : u.role === "Compliance Manager" ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-700"}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-sm text-gray-600">{u.org}</td>
                      <td className="py-3 pr-4 text-xs text-gray-400">{u.joined}</td>
                      <td className="py-3 pr-4">
                        <Badge className={u.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{u.status}</Badge>
                      </td>
                      <td className="py-3">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-blue-600">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Departments */}
      {tab === "Departments" && (
        <div className="space-y-3 animate-fade-in">
          {DEPARTMENTS.map((d) => (
            <Card key={d.code}>
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d.code}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{d.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Pending: {d.apps} apps · Avg time: {d.avgTime}</p>
                </div>
                <Badge className={d.status === "Operational" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>{d.status}</Badge>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-blue-600">Configure</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Compliance Rules */}
      {tab === "Compliance Rules" && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex justify-end">
            <Button size="sm">+ Add Rule</Button>
          </div>
          {COMPLIANCE_RULES.map((r, i) => (
            <Card key={i}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                      <Badge className={r.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{r.active ? "Active" : "Inactive"}</Badge>
                    </div>
                    <p className="text-xs text-gray-600">{r.rule}</p>
                    <p className="text-xs text-gray-400 mt-1">Applies to: {r.applies}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-blue-600">Edit</Button>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600">Disable</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* AI Config */}
      {tab === "AI Config" && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Configuration</p>
                <AiBadge label="Gemini API" />
              </div>
              {[
                { label: "AI Provider", value: "Google Gemini 2.5 Flash", editable: false },
                { label: "API Key Status", value: "● Connected", color: "text-emerald-600", editable: false },
                { label: "AI Model", value: "gemini-2.5-flash", editable: true },
                { label: "Max Response Tokens", value: "512", editable: true },
                { label: "Temperature", value: "0.7", editable: true },
                { label: "AI Chat", value: "Enabled", editable: true },
                { label: "AI Risk Scoring", value: "Enabled", editable: true },
                { label: "AI Scheme Matching", value: "Enabled", editable: true },
              ].map((c) => (
                <div key={c.label} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <p className="text-sm text-gray-600">{c.label}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${(c as any).color || "text-gray-800"}`}>{c.value}</span>
                    {c.editable && <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-blue-600">Edit</Button>}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <p className="text-sm font-bold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Usage This Month</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Chat Messages", value: "1,284" },
                  { label: "Compliance Analyses", value: "248" },
                  { label: "Risk Assessments", value: "512" },
                ].map((u) => (
                  <div key={u.label} className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{u.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{u.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
