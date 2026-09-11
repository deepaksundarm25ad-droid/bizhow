import { useNavigate } from "react-router";
import { Button } from "@/components/ui";

const FEATURES = [
  { icon: "🤖", title: "AI Requirement Engine", desc: "Automatically identifies all licences, NOCs, and approvals needed for your business based on sector, location, and size.", loraTag: "Intelligent Mapping" },
  { icon: "📊", title: "Predictive Risk Scoring", desc: "AI-powered risk analysis scores your applications and flags potential department delays before they happen.", loraTag: "Proactive Compliance" },
  { icon: "📋", title: "Smart Compliance Checklist", desc: "Dynamic checklist that updates as your business evolves. Never miss a critical regulatory approval.", loraTag: "Real-time Tracking" },
  { icon: "🏛", title: "Government Incentive Engine", desc: "AI matches your business profile with relevant subsidies, grants, and industrial incentives.", loraTag: "Financial Growth" },
  { icon: "📁", title: "Document Vault Intelligence", desc: "Upload documents once. AI validates format, tracks expiration dates, and alerts on missing items.", loraTag: "Secure Vault" },
  { icon: "💬", title: "24/7 Regulatory AI Assistant", desc: "Ask anything about approvals, statutory renewals, or compliance queries. Powered by Google Gemini.", loraTag: "Gemini Powered" },
];

const STEPS = [
  { n: "01", title: "Create Business Profile", desc: "Enter your industry sector, location, investment scale, and project details." },
  { n: "02", title: "AI Analyzes Requirements", desc: "GovFlow AI maps all applicable state and central approvals and licences." },
  { n: "03", title: "Submit Applications", desc: "Apply for multiple departmental approvals through one unified platform." },
  { n: "04", title: "Track & Monitor", desc: "Real-time status updates, predictive risk insights, and automated renewal alerts." },
];

const STATS = [
  { value: "2,400+", label: "Businesses Onboarded" },
  { value: "18,000+", label: "Applications Processed" },
  { value: "42%", label: "Faster Approvals" },
  { value: "98%", label: "Compliance Rate" },
];

const DEPARTMENTS = [
  "Fire & Rescue", "Pollution Control", "Labour Dept.",
  "MSME Ministry", "Local Authority", "Factory Inspectorate",
  "Tax Authority", "Municipal Corp."
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf9fa] text-slate-900 overflow-x-hidden font-inter">
      {/* Header / Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-[#800020] flex items-center justify-center text-white font-extrabold text-sm shadow-xs font-inter">G</div>
            <span className="font-bold text-slate-900 text-lg font-inter tracking-tight">GovFlow <span className="text-[#800020]">AI</span></span>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium font-inter text-slate-600">
            <a href="#how" className="hover:text-[#800020] transition-colors">How it Works</a>
            <a href="#features" className="hover:text-[#800020] transition-colors">Features</a>
            <a href="#security" className="hover:text-[#800020] transition-colors">Security</a>
            <a href="#schemes" className="hover:text-[#800020] transition-colors">Schemes</a>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign In</Button>
            <Button size="sm" onClick={() => navigate("/signup")}>Get Started →</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-gradient-to-b from-rose-50/40 via-[#faf9fa] to-white border-b border-slate-200/60">
        {/* Department Tags floating background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          {DEPARTMENTS.map((d, i) => (
            <div
              key={d}
              className="absolute px-3 py-1 rounded-full text-xs font-semibold border border-rose-200 text-[#800020] bg-white/80 shadow-xs font-roboto"
              style={{
                top: `${12 + (i * 11) % 70}%`,
                left: `${4 + (i * 12) % 88}%`,
                animation: `pulse-soft ${3.5 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-200/80 bg-rose-50 text-[#800020] text-xs font-semibold mb-8 font-inter shadow-2xs">
            <span>✦</span> Powered by Google Gemini AI · Challenge 20 Solution
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-6 font-inter tracking-tight">
            Your Business Approvals,<br />
            <span className="text-[#800020] editorial-text italic font-normal">
              Powered by Intelligence.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-open-sans">
            Streamline licences, registrations, NOCs, inspections, renewals, and government incentives
            from one unified, intelligent compliance platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")} className="px-8 shadow-md">
              Start Your Compliance Journey →
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate("/login")} className="px-8">
              Explore Platform
            </Button>
          </div>

          {/* SaaS Product Preview Card */}
          <div className="mt-16 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xl text-left">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-roboto">Compliance Health Score</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1 font-lato">92% <span className="text-xs text-emerald-600 font-semibold font-inter">● Excellent</span></p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-roboto">Predicted Risk Level</p>
                <span className="inline-block mt-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold font-inter border border-emerald-200">
                  LOW RISK
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-roboto">Gemini AI Index</p>
                <p className="text-3xl font-extrabold text-[#800020] mt-1 font-lato">8.8<span className="text-xs text-slate-400">/10</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Active Licences", value: "8", icon: "✓", color: "text-emerald-700 bg-emerald-50" },
                { label: "Pending Approvals", value: "3", icon: "⏳", color: "text-amber-700 bg-amber-50" },
                { label: "Completed Approvals", value: "12", icon: "🎯", color: "text-[#800020] bg-rose-50" },
                { label: "Renewals Due", value: "2", icon: "📅", color: "text-rose-700 bg-rose-50" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-50/70 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-roboto text-slate-500 uppercase">{s.label}</span>
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${s.color}`}>{s.icon}</span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 font-lato">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#800020] font-lato">{s.value}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-open-sans">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-[#faf9fa]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#800020] uppercase tracking-widest mb-2 font-roboto">The Statutory Challenge</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-inter">
              Business compliance in India is fragmented.
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl mx-auto font-open-sans">
              Enterprises navigate 20+ departments, 50+ approvals, and complex paperwork with little visibility or predictive guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🌐", title: "No Unified Window", desc: "Enterprises separately log into 15+ departmental portals with non-standard processes and delayed approvals." },
              { icon: "📄", title: "Document Uncertainty", desc: "Lacking clarity on specific document requirements, validity periods, and critical missing attachments." },
              { icon: "⏳", title: "Opaque Processing Delays", desc: "Applications sit in departmental review queues with zero visibility into status or expected completion timelines." },
            ].map((p) => (
              <div key={p.title} className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#800020] text-2xl flex items-center justify-center mb-4">{p.icon}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 font-inter">{p.title}</h3>
                <p className="text-sm text-slate-600 font-open-sans leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how" className="py-20 px-6 bg-white border-y border-slate-200/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#800020] uppercase tracking-widest mb-2 font-roboto">Workflow Blueprint</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-inter">
              From onboarding to approval in 4 steps
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative bg-[#faf9fa] p-6 rounded-xl border border-slate-200/70 text-center">
                <div className="w-10 h-10 rounded-lg bg-[#800020] text-white font-bold text-sm flex items-center justify-center mx-auto mb-4 font-lato shadow-xs">
                  {s.n}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2 font-inter">{s.title}</h3>
                <p className="text-xs text-slate-600 font-open-sans leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="features" className="py-20 px-6 bg-[#faf9fa]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#800020] uppercase tracking-widest mb-2 font-roboto">Platform Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-inter">
              Intelligence built for enterprise speed
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{f.icon}</span>
                  <span className="ai-badge">✦ {f.loraTag}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2 font-inter">{f.title}</h3>
                <p className="text-xs text-slate-600 font-open-sans leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-6 bg-white border-t border-slate-200/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#800020] uppercase tracking-widest mb-2 font-roboto">Security & Compliance</p>
            <h2 className="text-3xl font-bold text-slate-900 font-inter">
              Enterprise security standards
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "🔐", title: "Role-Based Access Control", desc: "Strict RBAC ensures users see only what they are explicitly authorized to view." },
              { icon: "🔒", title: "Encrypted Storage", desc: "All uploaded documents and sensitive data are encrypted in transit and at rest." },
              { icon: "📝", title: "Audit Trail Logging", desc: "Every action, review stage, and modification is logged with accurate timestamps." },
              { icon: "✅", title: "Verified Credentials", desc: "Business and officer credentials are validated through government databases." },
              { icon: "🌐", title: "Statutory Transparency", desc: "Every workflow step is transparent and traceable by authorized parties." },
              { icon: "🛡", title: "Regulatory Compliance", desc: "Architected to align with IT Act 2000, DPDP Act 2023, and CERT-IN guidelines." },
            ].map((s) => (
              <div key={s.title} className="flex gap-4 p-4 rounded-xl border border-slate-200/80 bg-[#faf9fa]">
                <div className="text-xl shrink-0 mt-0.5">{s.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm font-inter">{s.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-open-sans leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#5c0017] to-[#800020] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 font-inter">
            Ready to streamline your business approvals?
          </h2>
          <p className="text-rose-100 mb-8 font-open-sans max-w-xl mx-auto text-base">
            Join thousands of businesses that have accelerated their compliance journey with GovFlow AI.
          </p>
          <Button size="lg" onClick={() => navigate("/signup")} className="bg-white text-[#800020] hover:bg-rose-50 px-8 shadow-lg font-inter">
            Start Your Compliance Journey →
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 font-inter">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#800020] flex items-center justify-center text-white font-bold text-xs">G</div>
            <span className="font-bold text-white text-base">GovFlow AI</span>
            <span className="text-slate-500 text-xs">— Intelligent Business Approvals</span>
          </div>
          <p className="text-xs text-slate-400 font-roboto">© 2026 GovFlow AI · Hackathon Challenge 20 Demo</p>
        </div>
      </footer>
    </div>
  );
}

