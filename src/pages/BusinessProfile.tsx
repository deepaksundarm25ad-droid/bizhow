import { Card, Badge, SectionHeader } from "@/components/ui";
import { DEMO_BUSINESS } from "@/data/mockData";

export default function BusinessProfile() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <SectionHeader title="My Business Profile" subtitle="Complete business information and registration details." />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-5">
              <p className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Business Identity</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Business Name", value: DEMO_BUSINESS.name },
                  { label: "Industry Sector", value: DEMO_BUSINESS.sector },
                  { label: "Organization Type", value: DEMO_BUSINESS.type },
                  { label: "Business Stage", value: DEMO_BUSINESS.stage },
                  { label: "CIN", value: DEMO_BUSINESS.cin },
                  { label: "PAN", value: DEMO_BUSINESS.pan },
                  { label: "GSTIN", value: DEMO_BUSINESS.gstin },
                  { label: "Business ID", value: DEMO_BUSINESS.id },
                ].map((d) => (
                  <div key={d.label}>
                    <p className="text-xs text-gray-400">{d.label}</p>
                    <p className="text-sm font-medium text-gray-800 font-mono">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <p className="text-sm font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Location & Operations</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "State", value: DEMO_BUSINESS.state },
                  { label: "District", value: DEMO_BUSINESS.district },
                  { label: "City / Town", value: DEMO_BUSINESS.city },
                  { label: "Industrial Area", value: DEMO_BUSINESS.area },
                  { label: "Total Investment", value: DEMO_BUSINESS.investment },
                  { label: "Employees", value: DEMO_BUSINESS.employees.toString() },
                ].map((d) => (
                  <div key={d.label}>
                    <p className="text-xs text-gray-400">{d.label}</p>
                    <p className="text-sm font-medium text-gray-800">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="p-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>N</div>
              <p className="font-bold text-gray-900 text-sm">{DEMO_BUSINESS.name}</p>
              <p className="text-xs text-gray-500 mt-1">{DEMO_BUSINESS.sector} · {DEMO_BUSINESS.type}</p>
              <div className="mt-3 flex justify-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-700">Verified</Badge>
                <Badge className="bg-blue-100 text-blue-700">{DEMO_BUSINESS.stage}</Badge>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-5">
              <p className="text-xs font-semibold text-gray-600 mb-3">Compliance Health</p>
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{DEMO_BUSINESS.complianceHealth}%</p>
                <p className="text-xs text-gray-400 mt-1">Risk Level: <span className="text-emerald-600 font-semibold">{DEMO_BUSINESS.riskLevel}</span></p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
