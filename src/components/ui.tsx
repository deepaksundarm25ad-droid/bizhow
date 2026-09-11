import { type ReactNode } from "react";
import AnimatedNumber from "@/components/AnimatedNumber";

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold font-inter ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/90 shadow-sm ${onClick ? "cursor-pointer hover:shadow-md hover:border-rose-200 hover:-translate-y-0.5 transition-all duration-200" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const variants = {
    primary: "bg-[#800020] hover:bg-[#5c0017] text-white shadow-sm font-inter",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-inter",
    ghost: "hover:bg-rose-50/60 text-slate-700 hover:text-[#800020] font-inter",
    danger: "bg-red-700 hover:bg-red-800 text-white font-inter",
    success: "bg-emerald-700 hover:bg-emerald-800 text-white font-inter",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs font-semibold",
    md: "px-4 py-2 text-sm font-semibold",
    lg: "px-6 py-3 text-base font-semibold",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1 font-roboto">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">{label}{required && <span className="text-rose-600 ml-1">*</span>}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all"
      />
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div className="space-y-1 font-roboto">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">{label}{required && <span className="text-rose-600 ml-1">*</span>}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all"
      >
        <option value="">Select option...</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function AiBadge({ label = "AI" }: { label?: string }) {
  return (
    <span className="ai-badge">✦ {label}</span>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  color = "blue",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  color?: "blue" | "green" | "amber" | "red" | "purple" | "burgundy";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
    purple: "bg-purple-50 text-purple-700",
    burgundy: "bg-rose-50 text-[#800020]",
  };
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-roboto">{label}</p>
            <p className="mt-1.5 text-3xl font-extrabold text-slate-900 font-lato tracking-tight">
              {typeof value === "number" ? <AnimatedNumber target={value} /> : value}
            </p>
            {sub && <p className="mt-1 text-xs text-slate-500 font-open-sans">{sub}</p>}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs ${colors[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ProgressBar({ value, color = "#800020" }: { value: number; color?: string }) {
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

export function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-rose-200 border-t-[#800020] rounded-full animate-spin" />
  );
}

export function SectionHeader({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900 font-inter">{title}</h1>
        {badge && <AiBadge label={badge} />}
      </div>
      {subtitle && <p className="mt-1 text-sm text-slate-500 font-open-sans">{subtitle}</p>}
    </div>
  );
}

