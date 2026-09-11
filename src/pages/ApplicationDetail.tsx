import { useParams, useNavigate } from "react-router";
import { Card, Badge, Button, AiBadge, ProgressBar } from "@/components/ui";
import { APPLICATIONS, STATUS_COLORS, RISK_COLORS } from "@/data/mockData";

const TIMELINE_STEPS = [
  { label: "Application Created", done: true, date: "2026-07-10" },
  { label: "Documents Uploaded", done: true, date: "2026-07-12" },
  { label: "Submitted to Department", done: true, date: "2026-07-15" },
  { label: "Department Review", done: true, date: "2026-07-22" },
  { label: "Inspection Scheduled", current: true, date: "2026-09-15" },
  { label: "Inspection Completed", done: false, date: null },
  { label: "Final Approval", done: false, date: null },
];

const SUBMITTED_DOCS = [
  { name: "Company Registration Certificate", status: "Verified" },
  { name: "Site Layout Plan", status: "Verified" },
  { name: "Fire Safety Equipment List", status: "Verified" },
  { name: "NOC from Building Owner", status: "Needs Review" },
];

const MISSING_DOCS = [
  "Fire Hydrant System Certificate",
  "Electrical Safety Audit Report",
];

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = APPLICATIONS.find((a) => a.id === id) || APPLICATIONS[0];

  const riskScore = app.risk === "High" ? 72 : app.risk === "Medium" ? 45 : 18;
  const riskColor = app.risk === "High" ? "#ef4444" : app.risk === "Medium" ? "#f59e0b" : "#10b981";

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div>
        <button onClick={() => navigate("/applications")} className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-3 transition-colors">
          ← Back to Applications
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{app.name}</h1>
              <Badge className={STATUS_COLORS[app.status]}>{app.status}</Badge>
              <Badge className={RISK_COLORS[app.risk]}>{app.risk} Risk</Badge>
            </div>
            <p className="text-sm text-gray-500">Application <span className="font-mono font-medium">{app.id}</span> · {app.department}</p>
          </div>
          <Button onClick={() => {}}>
            ✦ Ask AI About This
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-5">
              <p className="text-sm font-bold text-gray-900 mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Application Timeline</p>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
                <div className="space-y-5">
                  {TIMELINE_STEPS.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 z-10 border-2 ${step.done ? "bg-emerald-500 border-emerald-500 text-white" : (step as any).current ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                        {step.done ? "✓" : (step as any).current ? "→" : "○"}
                      </div>
                      <div className="pt-1">
                        <p className={`text-sm font-medium ${step.done ? "text-gray-900" : (step as any).current ? "text-blue-700" : "text-gray-400"}`}>{step.label}</p>
                        {step.date && <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>}
                        {(step as any).current && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">● Active step</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{app.progress}%</span>
                </div>
                <ProgressBar value={app.progress} color="#3b82f6" />
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Document Status</p>
                <AiBadge label="Validated" />
              </div>
              <div className="space-y-2 mb-4">
                {SUBMITTED_DOCS.map((d) => (
                  <div key={d.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className={`text-sm ${d.status === "Verified" ? "text-emerald-500" : "text-amber-500"}`}>{d.status === "Verified" ? "✓" : "⚠"}</span>
                    <p className="text-sm text-gray-700 flex-1">{d.name}</p>
                    <Badge className={d.status === "Verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>{d.status}</Badge>
                  </div>
                ))}
              </div>
              {MISSING_DOCS.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-xs font-semibold text-red-700 mb-2">Missing Documents</p>
                  {MISSING_DOCS.map((d) => (
                    <div key={d} className="flex items-center gap-2 py-1">
                      <span className="text-red-400 text-sm">✗</span>
                      <p className="text-xs text-red-700">{d}</p>
                    </div>
                  ))}
                  <Button size="sm" className="mt-3" onClick={() => navigate("/documents")}>Upload Documents →</Button>
                </div>
              )}
            </div>
          </Card>

          {/* Activity */}
          <Card>
            <div className="p-5">
              <p className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Activity History</p>
              <div className="space-y-3">
                {[
                  { text: "Inspection scheduled by Fire Department", time: "2026-09-15 10:32 AM", user: "Inspector R. Murugan" },
                  { text: "Department review completed. Inspection pending.", time: "2026-07-22 03:15 PM", user: "System" },
                  { text: "Application submitted successfully", time: "2026-07-15 11:00 AM", user: "You" },
                  { text: "Documents uploaded (4 files)", time: "2026-07-12 02:45 PM", user: "You" },
                  { text: "Application created as draft", time: "2026-07-10 09:20 AM", user: "You" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mt-2" />
                    <div>
                      <p className="text-gray-700">{a.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.time} · {a.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Info */}
          <Card>
            <div className="p-5 space-y-3">
              <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Application Details</p>
              {[
                { label: "Department", value: app.department },
                { label: "Officer", value: app.officerName },
                { label: "Email", value: app.officerEmail },
                { label: "Submitted", value: app.submitted },
                { label: "Due Date", value: app.dueDate },
              ].map((d) => (
                <div key={d.label}>
                  <p className="text-xs text-gray-400">{d.label}</p>
                  <p className="text-sm font-medium text-gray-700">{d.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Risk */}
          <Card>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Risk Score</p>
                <AiBadge />
              </div>
              <div className="text-center mb-4">
                <p className="text-4xl font-extrabold" style={{ color: riskColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{riskScore}</p>
                <p className="text-xs text-gray-400">/100</p>
                <Badge className={RISK_COLORS[app.risk] + " mt-2 text-sm px-4 py-1"}>{app.risk.toUpperCase()} RISK</Badge>
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <p className="font-semibold text-gray-700">Risk Factors:</p>
                {app.risk === "High" ? (
                  <>
                    <p>• Inspection required (critical path)</p>
                    <p>• Missing supporting documents</p>
                    <p>• Application age exceeding 45 days</p>
                  </>
                ) : app.risk === "Medium" ? (
                  <>
                    <p>• Pending inspection on critical path</p>
                    <p>• One document needs review</p>
                  </>
                ) : (
                  <>
                    <p>• All documents verified</p>
                    <p>• No outstanding queries</p>
                  </>
                )}
              </div>
              <button onClick={() => navigate("/risk")} className="mt-3 w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium">Full Risk Analysis →</button>
            </div>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Recommendations</p>
                <AiBadge />
              </div>
              <div className="space-y-2">
                {[
                  "Prepare inspection checklist 3 days before the scheduled date.",
                  "Upload missing fire safety documents to unblock this application.",
                  "Contact the officer directly if inspection is not conducted within 7 days.",
                ].map((r, i) => (
                  <div key={i} className="flex gap-2 p-2 bg-blue-50 rounded-lg">
                    <span className="text-blue-500 text-xs mt-0.5">✦</span>
                    <p className="text-xs text-gray-700">{r}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
