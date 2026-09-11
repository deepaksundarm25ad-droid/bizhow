import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";
interface ToastItem { id: number; message: string; type: ToastType; }

const ToastContext = createContext<(msg: string, type?: ToastType) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

const ICONS: Record<ToastType, string> = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
const COLORS: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  let nextId = 0;

  const show = useCallback((message: string, type: ToastType = "info") => {
    const id = ++nextId;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium max-w-xs animate-fade-in ${COLORS[t.type]}`}
          >
            <span>{ICONS[t.type]}</span>
            <span>{t.message}</span>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="ml-auto opacity-60 hover:opacity-100 text-xs font-bold">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
