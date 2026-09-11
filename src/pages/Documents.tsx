import { useState } from "react";
import { Card, Badge, Button, SectionHeader, AiBadge } from "@/components/ui";
import { DOCUMENTS } from "@/data/mockData";

const STATUS_STYLES: Record<string, string> = {
  Verified: "bg-emerald-100 text-emerald-700",
  Missing: "bg-red-100 text-red-700",
  "Needs Review": "bg-amber-100 text-amber-700",
  Expired: "bg-orange-100 text-orange-700",
};

const STATUS_ICON: Record<string, string> = {
  Verified: "✓",
  Missing: "✗",
  "Needs Review": "⚠",
  Expired: "⚠",
};

export default function Documents() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  const statuses = ["All", "Verified", "Needs Review", "Missing", "Expired"];
  const filtered = DOCUMENTS.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || d.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    Verified: DOCUMENTS.filter((d) => d.status === "Verified").length,
    Missing: DOCUMENTS.filter((d) => d.status === "Missing").length,
    "Needs Review": DOCUMENTS.filter((d) => d.status === "Needs Review").length,
  };

  const runValidation = async () => {
    setValidating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setValidating(false);
    setValidated(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <SectionHeader
          title="Document Intelligence"
          subtitle="Upload, manage and validate all compliance documents in one place."
          badge="AI Validated"
        />
        <Button onClick={runValidation} disabled={validating}>
          {validating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Validating...
            </span>
          ) : "✦ Validate Documents"}
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg">✓</div>
            <div>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{counts.Verified}</p>
              <p className="text-xs text-gray-500">Verified</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 text-lg">⚠</div>
            <div>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{counts["Needs Review"]}</p>
              <p className="text-xs text-gray-500">Needs Review</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 text-lg">✗</div>
            <div>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{counts.Missing}</p>
              <p className="text-xs text-gray-500">Missing</p>
            </div>
          </div>
        </Card>
      </div>

      {validated && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
          <span className="text-blue-500 text-xl">✦</span>
          <div>
            <p className="text-sm font-semibold text-blue-800">AI Validation Complete</p>
            <p className="text-xs text-blue-600 mt-0.5">10 documents verified · 2 need attention · 2 missing. Environmental documents are blocking the Pollution Control NOC application.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? "bg-blue-700 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Document grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((doc) => (
          <Card key={doc.id}>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${STATUS_STYLES[doc.status]}`}>
                  {STATUS_ICON[doc.status]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                    <Badge className={STATUS_STYLES[doc.status]}>{doc.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{doc.category}</p>
                  {doc.uploaded && <p className="text-xs text-gray-400 mt-0.5">Uploaded: {doc.uploaded} · {doc.size}</p>}
                  {doc.expiry && <p className="text-xs text-amber-600 mt-0.5">Expires: {doc.expiry}</p>}
                  {doc.status === "Missing" && <p className="text-xs text-red-600 mt-0.5">Required for compliance — upload required</p>}
                </div>
              </div>
              {doc.status !== "Verified" && (
                <div className="mt-3 flex gap-2">
                  <label className="flex-1">
                    <Button size="sm" variant="secondary" className="w-full justify-center cursor-pointer">
                      {doc.status === "Missing" ? "Upload Document" : "Replace / Update"}
                    </Button>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Upload area */}
      <Card>
        <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
          <p className="text-3xl mb-2">📁</p>
          <p className="text-sm font-medium text-gray-700">Drop files here or click to upload</p>
          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG · Max 20MB per file</p>
          <Button size="sm" variant="secondary" className="mt-3">Browse Files</Button>
        </div>
      </Card>
    </div>
  );
}
