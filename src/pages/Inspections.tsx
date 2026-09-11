import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, Badge, Button, SectionHeader, AiBadge } from "@/components/ui";

const INSPECTIONS = [
  {
    id: "INS-001", appId: "GF-2026-1024", name: "Fire Safety Premises Inspection",
    dept: "Tamil Nadu Fire & Rescue", officer: "Inspector R. Murugan",
    scheduledDate: "2026-09-20", scheduledTime: "10:00 AM",
    status: "Scheduled", location: "Plot 45, SIPCOT Industrial Area, Sriperumbudur",
    notes: "Ensure all fire safety equipment is functional and visible. Keep fire exit routes clear.",
    checklist: ["Fire extinguishers (all zones)", "Smoke detectors operational", "Emergency exit signs", "Sprinkler system test", "Electrical panel safety", "Storage of flammable materials"],
  },
  {
    id: "INS-002", appId: "GF-2026-1021", name: "Environmental Compliance Inspection",
    dept: "TNPCB", officer: "Asst. Dir. P. Suresh",
    scheduledDate: "2026-10-05", scheduledTime: "11:30 AM",
    status: "Pending Schedule", location: "NovaTech Manufacturing Unit, Sriperumbudur",
    notes: "Inspector will check effluent treatment plant, air emission control, and solid waste disposal.",
    checklist: ["ETP (Effluent Treatment Plant) operational", "Air emission levels within limits", "Solid waste disposal records", "Environment logs for last 6 months", "Consent to Operate compliance"],
  },
  {
    id: "INS-003", appId: "GF-2026-1018", name: "Factory Premises Inspection",
    dept: "Dept. of Labour", officer: "Labour Insp. K. Ramesh",
    scheduledDate: "2026-05-18", scheduledTime: "09:30 AM",
    status: "Completed", location: "NovaTech Manufacturing Unit, Sriperumbudur",
    notes: "Inspection completed successfully. Factory Licence approved.",
    checklist: ["Worker safety equipment", "Machinery guarding", "Labour records", "Working hours compliance", "Welfare facilities"],
  },
];

const CALENDAR_EVENTS = [
  { date: 20, month: "Sep", label: "Fire Safety Inspection", type: "urgent" },
  { date: 5, month: "Oct", label: "TNPCB Inspection", type: "upcoming" },
  { date: 24, month: "Sep", label: "Fire Safety Renewal", type: "renewal" },
];

const STATUS_STYLES: Record<string, string> = {
  "Scheduled": "bg-blue-100 text-blue-700",
  "Pending Schedule": "bg-amber-100 text-amber-700",
  "Completed": "bg-emerald-100 text-emerald-700",
  "Cancelled": "bg-red-100 text-red-700",
};

export default function Inspections() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>("INS-001");

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Inspections" subtitle="Track scheduled, pending, and completed inspections across all departments." badge="AI Tracked" />

      {/* Upcoming alert */}
      <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
        <span className="text-2xl animate-pulse-soft">🔴</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-red-800">Inspection in 10 days</p>
          <p className="text-xs text-red-600 mt-0.5">Fire Safety Inspection by Tamil Nadu Fire & Rescue — September 20, 2026 at 10:00 AM. Begin preparation immediately.</p>
        </div>
        <Button size="sm" onClick={() => setExpanded("INS-001")} className="bg-red-600 hover:bg-red-700 text-white shrink-0">Prepare</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Scheduled", value: 1, icon: "📅", color: "blue" },
          { label: "Pending Schedule", value: 1, icon: "⏳", color: "amber" },
          { label: "Completed", value: 1, icon: "✓", color: "green" },
        ].map((s) => (
          <Card key={s.label}>
            <div className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-${s.color}-50`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Calendar strip */}
      <Card>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Compliance Calendar — September 2026</p>
            <AiBadge label="Smart" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
              const event = CALENDAR_EVENTS.find((e) => e.date === d && e.month === "Sep");
              return (
                <div
                  key={d}
                  className={`min-w-[52px] h-16 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all border ${
                    event
                      ? event.type === "urgent"
                        ? "bg-red-500 border-red-500 text-white shadow-md"
                        : event.type === "upcoming"
                          ? "bg-blue-100 border-blue-300 text-blue-800"
                          : "bg-amber-100 border-amber-300 text-amber-800"
                      : d === 10
                        ? "bg-blue-700 border-blue-700 text-white"
                        : "bg-gray-50 border-gray-100 text-gray-500 hover:border-blue-200"
                  }`}
                >
                  <p className="text-xs font-medium">Sep</p>
                  <p className="text-lg font-bold leading-none">{d}</p>
                  {event && <p className="text-[8px] leading-tight px-1 mt-0.5 truncate w-full text-center opacity-80">{event.type === "urgent" ? "🔥" : event.type === "renewal" ? "🔄" : "🔍"}</p>}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3">
            {[{ color: "bg-red-500", label: "Inspection Scheduled" }, { color: "bg-amber-400", label: "Renewal Due" }, { color: "bg-blue-700", label: "Today" }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Inspections list */}
      <div className="space-y-3">
        {INSPECTIONS.map((ins) => (
          <Card key={ins.id} onClick={() => setExpanded(expanded === ins.id ? null : ins.id)}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{ins.name}</h3>
                    <Badge className={STATUS_STYLES[ins.status]}>{ins.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">{ins.dept} · {ins.officer}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>📅 {ins.scheduledDate} at {ins.scheduledTime}</span>
                    <span>📍 {ins.location.split(",")[0]}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/applications/${ins.appId}`); }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium shrink-0"
                >
                  View App →
                </button>
              </div>

              {expanded === ins.id && (
                <div className="mt-4 space-y-4 border-t border-gray-100 pt-4 animate-fade-in">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Inspector Notes</p>
                    <p className="text-xs text-gray-700">{ins.notes}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Inspection Checklist — Prepare these items:</p>
                    <div className="grid md:grid-cols-2 gap-1.5">
                      {ins.checklist.map((c) => (
                        <div key={c} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <span className={`text-sm ${ins.status === "Completed" ? "text-emerald-500" : "text-gray-300"}`}>{ins.status === "Completed" ? "✓" : "○"}</span>
                          <p className="text-xs text-gray-700">{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {ins.status === "Scheduled" && (
                    <div className="flex gap-3">
                      <Button size="sm" className="flex-1 justify-center">Mark Premises Ready</Button>
                      <Button size="sm" variant="secondary">Contact Officer</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
