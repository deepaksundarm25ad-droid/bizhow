import { useState } from "react";
import { Card, Badge, Button, SectionHeader, AiBadge, ProgressBar } from "@/components/ui";
import { CHECKLIST } from "@/data/mockData";

export default function Checklist() {
  const [items, setItems] = useState(CHECKLIST);
  const completed = items.filter((i) => i.completed).length;
  const pct = Math.round((completed / items.length) * 100);

  const toggle = (id: number) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, completed: !i.completed } : i));
  };

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Compliance Checklist"
        subtitle="AI-generated checklist for NovaTech Manufacturing Pvt Ltd · Tamil Nadu · Manufacturing"
        badge="AI Generated"
      />

      {/* Progress */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Overall Completion</p>
              <p className="text-xs text-gray-500 mt-0.5">{completed} of {items.length} items completed</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{pct}%</p>
              <Badge className={pct >= 80 ? "bg-emerald-100 text-emerald-700" : pct >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}>
                {pct >= 80 ? "On Track" : pct >= 50 ? "Needs Attention" : "Critical Gaps"}
              </Badge>
            </div>
          </div>
          <ProgressBar value={pct} color={pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444"} />
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2">
              <AiBadge />
              <p className="text-xs font-semibold text-blue-700">AI Insight</p>
            </div>
            <p className="text-xs text-gray-700 mt-1">Based on your business profile, 5 additional requirements may apply if you handle hazardous materials or expand employee count above 200.</p>
          </div>
        </div>
      </Card>

      {/* Categories */}
      {categories.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        const catDone = catItems.filter((i) => i.completed).length;
        return (
          <Card key={cat}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{cat}</h3>
                  <span className="text-xs text-gray-400">{catDone}/{catItems.length}</span>
                </div>
                <div className="w-24">
                  <ProgressBar value={catItems.length > 0 ? (catDone / catItems.length) * 100 : 0} color="#3b82f6" />
                </div>
              </div>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${item.completed ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100 hover:border-blue-200"}`}
                  >
                    <button
                      onClick={() => toggle(item.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${item.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 hover:border-blue-400"}`}
                    >
                      {item.completed && <span className="text-[10px]">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${item.completed ? "line-through text-gray-400" : "text-gray-800 font-medium"}`}>{item.item}</p>
                    </div>
                    {item.required ? (
                      <Badge className="bg-red-100 text-red-600 shrink-0">Required</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-500 shrink-0">Optional</Badge>
                    )}
                    <div className="flex gap-2 ml-2">
                      <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-blue-600">View</Button>
                      <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-blue-600">✦ Ask AI</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
