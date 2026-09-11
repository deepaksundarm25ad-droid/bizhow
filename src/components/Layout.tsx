import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import AIChat from "@/components/AIChat";
import { NOTIFICATIONS } from "@/data/mockData";

const BUSINESS_NAV = [
  { path: "/dashboard", icon: "⊞", label: "Dashboard" },
  { path: "/business", icon: "🏢", label: "My Business" },
  { path: "/checklist", icon: "☑", label: "Compliance Checklist" },
  { path: "/applications", icon: "📋", label: "Applications" },
  { path: "/documents", icon: "📁", label: "Documents" },
  { path: "/licences", icon: "🪪", label: "Licences & Renewals" },
  { path: "/inspections", icon: "🔍", label: "Inspections" },
  { path: "/risk", icon: "⚠", label: "Risk Analysis" },
  { path: "/ai-insights", icon: "✦", label: "AI Insights" },
  { path: "/schemes", icon: "🏛", label: "Gov Schemes" },
  { path: "/analytics", icon: "📊", label: "Analytics" },
  { path: "/grievances", icon: "💬", label: "Grievances" },
  { path: "/notifications", icon: "🔔", label: "Notifications" },
];

const OFFICER_NAV = [
  { path: "/officer", icon: "⊞", label: "Dashboard" },
  { path: "/officer/queue", icon: "📋", label: "Application Queue" },
  { path: "/inspections", icon: "🔍", label: "Inspections" },
  { path: "/analytics", icon: "📊", label: "Analytics" },
  { path: "/notifications", icon: "🔔", label: "Notifications" },
];

const ADMIN_NAV = [
  { path: "/admin", icon: "⚙", label: "Admin Dashboard" },
  { path: "/applications", icon: "📋", label: "All Applications" },
  { path: "/analytics", icon: "📊", label: "Analytics" },
  { path: "/notifications", icon: "🔔", label: "Notifications" },
];

const MOBILE_NAV = [
  { path: "/dashboard", icon: "⊞", label: "Home" },
  { path: "/applications", icon: "📋", label: "Apps" },
  { path: "/checklist", icon: "☑", label: "Checklist" },
  { path: "/ai-insights", icon: "✦", label: "AI" },
  { path: "/notifications", icon: "🔔", label: "Alerts" },
];

const SEARCH_INDEX = [
  { label: "Dashboard", path: "/dashboard", category: "Page" },
  { label: "My Business Profile", path: "/business", category: "Page" },
  { label: "Compliance Checklist", path: "/checklist", category: "Page" },
  { label: "Applications", path: "/applications", category: "Page" },
  { label: "Documents", path: "/documents", category: "Page" },
  { label: "Licences & Renewals", path: "/licences", category: "Page" },
  { label: "Inspections", path: "/inspections", category: "Page" },
  { label: "Risk Analysis", path: "/risk", category: "Page" },
  { label: "AI Compliance Insights", path: "/ai-insights", category: "AI Feature" },
  { label: "Government Schemes", path: "/schemes", category: "Page" },
  { label: "Analytics", path: "/analytics", category: "Page" },
  { label: "Grievances", path: "/grievances", category: "Page" },
  { label: "Notifications", path: "/notifications", category: "Page" },
  { label: "Fire Safety Approval", path: "/applications/GF-2026-1024", category: "Application" },
  { label: "Pollution Control NOC", path: "/applications/GF-2026-1021", category: "Application" },
  { label: "Factory Licence", path: "/applications/GF-2026-1018", category: "Application" },
  { label: "MSME Udyam Registration", path: "/applications/GF-2026-1033", category: "Application" },
  { label: "MSME Credit Guarantee Scheme", path: "/schemes", category: "Scheme" },
  { label: "Tamil Nadu Industrial Promotion", path: "/schemes", category: "Scheme" },
];

export default function Layout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const role = localStorage.getItem("govflow_role") || "business";
  const nav = role === "officer" ? OFFICER_NAV : role === "admin" ? ADMIN_NAV : BUSINESS_NAV;
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  const searchResults = search.length >= 2
    ? SEARCH_INDEX.filter((s) => s.label.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("govflow_auth");
    localStorage.removeItem("govflow_role");
    navigate("/");
  };

  const switchRole = () => {
    const roles = ["business", "officer", "admin"];
    const next = roles[(roles.indexOf(role) + 1) % roles.length];
    localStorage.setItem("govflow_role", next);
    navigate(next === "officer" ? "/officer" : next === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar — hidden on mobile */}
      <aside className={`sidebar hidden md:flex flex-col transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"} shrink-0 z-30`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#800020] flex items-center justify-center text-white font-extrabold text-sm shrink-0 cursor-pointer shadow-xs font-inter" onClick={() => navigate("/dashboard")}>G</div>
          {sidebarOpen && (
            <div className="animate-fade-in flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate font-inter">GovFlow AI</p>
              <p className="text-rose-300 text-[10px] font-roboto uppercase tracking-wider font-semibold">Compliance Platform</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen((o) => !o)} className="ml-auto text-rose-200 hover:text-white text-sm transition-colors shrink-0">
            {sidebarOpen ? "◂" : "▸"}
          </button>
        </div>

        {/* Role badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 font-roboto">
            <p className="text-[10px] text-rose-300 uppercase tracking-wider font-semibold">
              {role === "officer" ? "🏛 Government Officer" : role === "admin" ? "⚙ Administrator" : "🏢 Business Owner"}
            </p>
            <p className="text-xs text-white/90 font-medium mt-0.5 truncate">
              {role === "officer" ? "Inspector R. Murugan" : role === "admin" ? "System Admin" : "NovaTech Mfg Pvt Ltd"}
            </p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2 font-inter">
          {nav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group ${
                  isActive ? "bg-[#800020] text-white shadow-sm font-semibold" : "text-rose-100/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-base shrink-0 w-5 text-center">{item.icon}</span>
              {sidebarOpen && (
                <span className="truncate animate-fade-in flex-1">
                  {item.label}
                  {item.path === "/notifications" && unread > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-rose-600 text-white text-[10px] rounded-full font-lato">{unread}</span>
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom controls */}
        <div className="p-3 border-t border-white/10 space-y-1 font-inter">
          {sidebarOpen && (
            <>
              <button
                onClick={() => navigate("/admin")}
                className="w-full text-left text-xs text-rose-200 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all font-medium"
              >
                ⚙ Admin Panel
              </button>
              <button
                onClick={switchRole}
                className="w-full text-left text-xs text-rose-200 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all font-medium"
              >
                ⇄ Switch Role ({role === "officer" ? "→ Admin" : role === "admin" ? "→ Business" : "→ Officer"})
              </button>
            </>
          )}
          <button
            onClick={logout}
            className="w-full text-left text-xs text-rose-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all font-medium"
          >
            {sidebarOpen ? "← Sign Out" : "←"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#faf9fa]">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200/80 px-4 md:px-6 py-3 flex items-center gap-3 shrink-0 shadow-2xs font-inter">
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setSidebarOpen((o) => !o)}>
            <span className="text-slate-700">☰</span>
          </button>

          {/* Search */}
          <div ref={searchRef} className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:bg-white transition-all font-roboto"
              placeholder="Search applications, documents, schemes..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in font-inter">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => { navigate(r.path); setSearch(""); setSearchOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50/70 text-left transition-colors"
                  >
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold font-roboto">{r.category}</span>
                    <span className="text-sm text-slate-800 font-medium">{r.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/notifications")}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="text-lg">🔔</span>
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-700 text-white text-[9px] rounded-full flex items-center justify-center font-bold font-lato">
                {unread}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/ai-insights")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all hover:opacity-95 font-inter"
            style={{ background: "linear-gradient(135deg, #800020, #a31d42)", color: "white" }}
          >
            <span>✦</span> AI Insights
          </button>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 font-inter">
            <div className="w-8 h-8 rounded-full bg-[#800020] flex items-center justify-center text-white text-sm font-bold cursor-pointer shadow-xs" onClick={() => navigate("/business")}>N</div>
            <span className="hidden lg:block text-xs font-semibold text-slate-700 max-w-[110px] truncate">
              {role === "officer" ? "Officer View" : role === "admin" ? "Admin" : "NovaTech"}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 bg-[#faf9fa]">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around px-2 py-2 shadow-lg font-inter">
        {MOBILE_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${isActive ? "text-[#800020] font-bold" : "text-slate-500 hover:text-slate-800"}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-xl ${isActive ? "" : "opacity-70"}`}>
                  {item.icon}
                  {item.path === "/notifications" && unread > 0 && <sup className="text-[9px] text-rose-600 font-bold font-lato">{unread}</sup>}
                </span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <AIChat />
    </div>
  );
}

