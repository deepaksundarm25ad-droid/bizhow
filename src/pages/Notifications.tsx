import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, Badge, Button, SectionHeader } from "@/components/ui";
import { NOTIFICATIONS } from "@/data/mockData";

const TYPE_STYLES: Record<string, string> = {
  critical: "bg-red-50 border-red-200",
  warning: "bg-amber-50 border-amber-200",
  success: "bg-emerald-50 border-emerald-200",
  info: "bg-blue-50 border-blue-200",
};
const TYPE_ICON: Record<string, string> = {
  critical: "🔴",
  warning: "⚠️",
  success: "✅",
  info: "ℹ️",
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("All");

  const markAll = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id: number) => setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));

  const filters = ["All", "Critical", "Warning", "Success", "Info"];
  const filtered = notifs.filter((n) => filter === "All" || n.type === filter.toLowerCase());

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-start justify-between">
        <SectionHeader
          title="Notification Center"
          subtitle={`${notifs.filter((n) => !n.read).length} unread notifications`}
        />
        <Button variant="secondary" size="sm" onClick={markAll}>Mark all read</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-blue-700 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="space-y-2">
        {filtered.map((n) => (
          <div
            key={n.id}
            className={`flex gap-4 p-4 rounded-xl border transition-all ${TYPE_STYLES[n.type]} ${!n.read ? "shadow-sm" : "opacity-70"}`}
          >
            <span className="text-xl shrink-0 mt-0.5">{TYPE_ICON[n.type]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-soft" />}
              </div>
              <p className="text-xs text-gray-600">{n.message}</p>
              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              {n.appId && (
                <Button size="sm" variant="ghost" onClick={() => navigate(`/applications/${n.appId}`)}>
                  View →
                </Button>
              )}
              {!n.read && (
                <Button size="sm" variant="ghost" onClick={() => markRead(n.id)} className="text-gray-400 hover:text-gray-600">
                  Mark read
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔔</p>
          <p className="font-medium">No notifications</p>
        </div>
      )}
    </div>
  );
}
