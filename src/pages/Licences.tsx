import { useNavigate } from "react-router";
import { Card, Badge, Button, SectionHeader } from "@/components/ui";
import { RENEWALS } from "@/data/mockData";

const LICENCES = [
  { id: "LIC-001", name: "Factory Licence", dept: "Dept. of Labour", number: "TN/FAC/2026/01234", issued: "2026-05-20", expiry: "2027-05-19", status: "Active", daysLeft: 252 },
  { id: "LIC-002", name: "GST Registration", dept: "Tax Authority", number: "33AABCN1234F1Z5", issued: "2026-03-05", expiry: "Perpetual", status: "Active", daysLeft: 9999 },
  { id: "LIC-003", name: "Business Registration (CIN)", dept: "MCA", number: "U28112TN2022PTC150123", issued: "2026-03-01", expiry: "Perpetual", status: "Active", daysLeft: 9999 },
  { id: "LIC-004", name: "Employee State Insurance (ESIC)", dept: "ESIC", number: "53-0012345-000-0001", issued: "2026-06-01", expiry: "Annual", status: "Active", daysLeft: 264 },
  { id: "LIC-005", name: "EPF Registration", dept: "EPFO", number: "TN/CHE/0012345/ENF/EPS/000/14", issued: "2026-06-01", expiry: "Perpetual", status: "Active", daysLeft: 9999 },
  { id: "LIC-006", name: "Fire Safety Certificate", dept: "TN Fire & Rescue", number: "Pending Inspection", issued: "2026-07-15", expiry: "2026-09-24", status: "Expiring", daysLeft: 14 },
];

export default function Licences() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Licences & Renewals" subtitle="Manage all active licences and track upcoming renewal deadlines." />

      {/* Renewal alerts */}
      <div className="space-y-2">
        {RENEWALS.filter((r) => r.status !== "ok").map((r) => (
          <div key={r.id} className={`flex items-center gap-4 p-4 rounded-xl border ${r.status === "urgent" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
            <span className="text-xl">{r.status === "urgent" ? "🔴" : "⚠️"}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{r.name}</p>
              <p className="text-xs text-gray-500">Due: {r.dueDate} · {r.daysLeft} days remaining</p>
            </div>
            <Button size="sm" onClick={() => r.appId && navigate(`/applications/${r.appId}`)}>
              Renew Now →
            </Button>
          </div>
        ))}
      </div>

      {/* Licence table */}
      <Card>
        <div className="p-5">
          <p className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Active Licences</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left py-2 pb-3">Licence</th>
                  <th className="text-left py-2 pb-3">Licence Number</th>
                  <th className="text-left py-2 pb-3">Issued</th>
                  <th className="text-left py-2 pb-3">Expiry</th>
                  <th className="text-left py-2 pb-3">Status</th>
                  <th className="text-left py-2 pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {LICENCES.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-900">{l.name}</p>
                      <p className="text-xs text-gray-400">{l.dept}</p>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-gray-600">{l.number}</td>
                    <td className="py-3 pr-4 text-xs text-gray-500">{l.issued}</td>
                    <td className="py-3 pr-4 text-xs text-gray-500">
                      {l.expiry}
                      {l.daysLeft < 60 && l.daysLeft < 9999 && (
                        <span className="ml-1 text-red-500 font-semibold">({l.daysLeft}d)</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge className={l.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                        {l.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      {l.status === "Expiring" && <Button size="sm" variant="ghost" className="text-red-600">Renew</Button>}
                      {l.status === "Active" && <Button size="sm" variant="ghost" className="text-gray-400">Download</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
