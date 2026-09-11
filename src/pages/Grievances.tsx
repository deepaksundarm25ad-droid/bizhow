import { useState } from "react";
import { Card, Badge, Button, Input, Select, SectionHeader } from "@/components/ui";
import { GRIEVANCES } from "@/data/mockData";

const STATUS_STYLES: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-700",
  Assigned: "bg-purple-100 text-purple-700",
  "Under Review": "bg-amber-100 text-amber-700",
  Response: "bg-cyan-100 text-cyan-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

export default function Grievances() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ appId: "", department: "", type: "", description: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-start justify-between">
        <SectionHeader title="Grievance Management" subtitle="Raise and track grievances for delayed or unfair processing." />
        <Button onClick={() => setShowForm((s) => !s)}>+ Raise Grievance</Button>
      </div>

      {/* Raise form */}
      {showForm && (
        <Card className="animate-fade-in">
          <div className="p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>New Grievance</h3>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Application ID" value={form.appId} onChange={set("appId")} placeholder="GF-2026-XXXX" required />
                <Select label="Department" value={form.department} onChange={set("department")} options={[
                  { value: "tnpcb", label: "TNPCB" },
                  { value: "fire", label: "Fire & Rescue" },
                  { value: "labour", label: "Dept. of Labour" },
                  { value: "mca", label: "MCA" },
                  { value: "local", label: "Local Authority" },
                ]} required />
              </div>
              <Select label="Issue Type" value={form.type} onChange={set("type")} options={[
                { value: "delay", label: "Excessive Processing Delay" },
                { value: "info", label: "Lack of Information / Transparency" },
                { value: "query", label: "Unreasonable / Unclear Query" },
                { value: "rejection", label: "Unjustified Rejection" },
                { value: "inspection", label: "Inspection Not Conducted" },
                { value: "other", label: "Other" },
              ]} required />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description")(e.target.value)}
                  placeholder="Describe the issue in detail. Include dates, communications, and any supporting context."
                  rows={4}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1 justify-center">Cancel</Button>
                <Button type="submit" className="flex-1 justify-center">Submit Grievance →</Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in">
          <p className="text-sm font-semibold text-emerald-800">✓ Grievance Submitted Successfully</p>
          <p className="text-xs text-emerald-600 mt-1">Your grievance ID: <span className="font-mono font-bold">GRV-2026-1009</span> · Expected response within 7 working days.</p>
        </div>
      )}

      {/* Existing grievances */}
      {GRIEVANCES.map((g) => (
        <Card key={g.id}>
          <div className="p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-blue-700">{g.id}</span>
                  <Badge className="bg-amber-100 text-amber-700">{g.status}</Badge>
                </div>
                <p className="text-sm font-semibold text-gray-900">{g.type}</p>
                <p className="text-xs text-gray-500 mt-0.5">Application {g.appId} · {g.department}</p>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>Submitted: {g.submitted}</p>
                <p className="mt-0.5">Assigned to: {g.assignedTo}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">{g.description}</p>

            {/* Timeline */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-3">Grievance Timeline</p>
              <div className="flex items-center gap-2">
                {g.timeline.map((t, i) => (
                  <div key={t.stage} className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${t.done ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                        {t.done ? "✓" : i + 1}
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1 text-center w-14 leading-tight">{t.stage}</p>
                      {t.date && <p className="text-[9px] text-gray-300">{t.date.split("-").slice(1).join("/")}</p>}
                    </div>
                    {i < g.timeline.length - 1 && (
                      <div className={`flex-1 h-px mb-4 ${t.done ? "bg-emerald-400" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
