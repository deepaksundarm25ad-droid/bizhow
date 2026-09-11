import { useState } from "react";
import { Card, Badge, Button, SectionHeader, AiBadge } from "@/components/ui";
import { SCHEMES } from "@/data/mockData";

export default function Schemes() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Government Schemes & Incentives"
        subtitle="AI-matched government schemes and incentives based on your business profile."
        badge="AI Matched"
      />

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <span className="text-2xl">✦</span>
        <div>
          <p className="text-sm font-semibold text-blue-800">AI Scheme Discovery</p>
          <p className="text-xs text-blue-600 mt-0.5">Analyzed 240+ central and state schemes for NovaTech Manufacturing · Tamil Nadu · Medium Enterprise · Manufacturing sector. Found 6 potentially eligible schemes.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {SCHEMES.map((scheme) => (
          <Card key={scheme.id} onClick={() => setSelected(selected === scheme.id ? null : scheme.id)}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{scheme.name}</h3>
                    {scheme.tag === "AI Recommended" && <AiBadge label="Recommended" />}
                    {scheme.tag === "Eligible" && <Badge className="bg-emerald-100 text-emerald-700">Eligible</Badge>}
                    {scheme.tag === "Explore" && <Badge className="bg-gray-100 text-gray-600">Explore</Badge>}
                  </div>
                  <p className="text-xs text-gray-500">{scheme.authority}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-blue-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{scheme.match}%</p>
                  <p className="text-[10px] text-gray-400">Match Score</p>
                </div>
              </div>

              {/* Match bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3">
                <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${scheme.match}%` }} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Benefit</p>
                  <p className="text-xs font-medium text-gray-700">{scheme.benefit}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Deadline</p>
                  <p className="text-xs font-medium text-gray-700">{scheme.deadline}</p>
                </div>
              </div>

              {selected === scheme.id && (
                <div className="space-y-3 pt-3 border-t border-gray-100 animate-fade-in">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Description</p>
                    <p className="text-xs text-gray-600">{scheme.description}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Required Documents</p>
                    <div className="flex flex-wrap gap-1">
                      {scheme.documents.map((d) => (
                        <span key={d} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{d}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                    <span className="text-blue-500 text-sm">✦</span>
                    <p className="text-xs text-blue-700">Your business matches {scheme.match}% of eligibility criteria for this scheme. Review full eligibility on the official portal.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 justify-center">Apply Now →</Button>
                    <Button size="sm" variant="ghost" className="text-blue-600">✦ Ask AI</Button>
                  </div>
                </div>
              )}

              {selected !== scheme.id && (
                <button className="w-full text-left text-xs text-blue-600 hover:text-blue-800 font-medium mt-1">
                  {selected === scheme.id ? "Show less ↑" : "View details & apply ↓"}
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
