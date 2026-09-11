import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, Badge, Button, SectionHeader, ProgressBar } from "@/components/ui";
import { APPLICATIONS, STATUS_COLORS, RISK_COLORS } from "@/data/mockData";

const ALL_STATUSES = ["All", "Submitted", "Under Review", "Inspection Scheduled", "Documents Required", "Approved", "Rejected"];
const ALL_RISKS = ["All", "Low", "Medium", "High"];

export default function Applications() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [risk, setRisk] = useState("All");

  const filtered = APPLICATIONS.filter((a) => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()) || a.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "All" || a.status === status;
    const matchRisk = risk === "All" || a.risk === risk;
    return matchSearch && matchStatus && matchRisk;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="My Applications" subtitle="Track, manage and monitor all your government approval applications." />

      {/* Filters */}
      <Card>
        <div className="p-4 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or department..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${status === s ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {ALL_RISKS.map((r) => (
              <button
                key={r}
                onClick={() => setRisk(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${risk === r ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
              >
                {r === "All" ? "All Risk" : `${r} Risk`}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Count */}
      <p className="text-sm text-gray-500">{filtered.length} applications found</p>

      {/* Applications list */}
      <div className="space-y-3">
        {filtered.map((app) => (
          <Card key={app.id} onClick={() => navigate(`/applications/${app.id}`)}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{app.name}</h3>
                    <Badge className={STATUS_COLORS[app.status]}>{app.status}</Badge>
                    <Badge className={RISK_COLORS[app.risk]}>{app.risk} Risk</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <span className="font-mono">{app.id}</span>
                    <span>·</span>
                    <span>{app.department}</span>
                    <span>·</span>
                    <span>Submitted {app.submitted}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500 mb-1">Next Action</p>
                  <p className="text-xs font-medium text-gray-700 max-w-[180px] text-right">{app.nextAction}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{app.progress}%</span>
                </div>
                <ProgressBar value={app.progress} color={app.progress === 100 ? "#10b981" : app.progress >= 60 ? "#3b82f6" : "#f59e0b"} />
              </div>

              {app.status === "Documents Required" && (
                <div className="mt-3 flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-100">
                  <span className="text-orange-500 text-sm">⚠</span>
                  <p className="text-xs text-orange-700">Action required: Upload missing documents to proceed.</p>
                  <Button size="sm" variant="ghost" className="ml-auto text-orange-600 hover:text-orange-800" onClick={() => navigate("/documents")}>Upload →</Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">No applications match your filters</p>
          <p className="text-sm mt-1">Try clearing the search or changing filters</p>
        </div>
      )}
    </div>
  );
}
