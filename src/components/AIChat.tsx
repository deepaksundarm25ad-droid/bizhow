import { useState, useRef, useEffect } from "react";
import { sendChatMessage, type ChatMessage } from "@/services/gemini";

const SUGGESTIONS = [
  "What approvals do I need for a manufacturing unit?",
  "Which documents are missing for my applications?",
  "When should I renew my fire safety licence?",
  "Why is my Pollution Control NOC delayed?",
  "Which government schemes apply to my business?",
  "What is the current status of my approvals?",
];

function parseInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2 && !part.startsWith("**")) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return <code key={i} className="px-1 py-0.5 bg-slate-200 text-slate-900 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function FormattedMessage({ text, isUser }: { text: string; isUser: boolean }) {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        if (line.startsWith("### ")) {
          return (
            <p key={idx} className="font-bold text-slate-900 text-sm mt-1.5 mb-0.5 font-inter">
              {parseInlineMarkdown(line.slice(4))}
            </p>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <p key={idx} className="font-bold text-slate-900 text-sm mt-1.5 mb-0.5 font-inter">
              {parseInlineMarkdown(line.slice(3))}
            </p>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {parseInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const reply = await sendChatMessage(messages, text);
    setMessages((prev) => [...prev, { role: "model", text: reply }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
        style={{ background: "linear-gradient(135deg, #800020, #a31d42)" }}
        title="GovFlow AI Assistant"
      >
        {open ? (
          <span className="text-white text-xl font-bold font-inter">✕</span>
        ) : (
          <span className="text-white text-xl font-bold font-inter">✦</span>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse-soft" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[580px] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 animate-fade-in font-inter">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-rose-950/20 rounded-t-2xl" style={{ background: "linear-gradient(135deg, #1c050c, #800020)" }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold shadow-xs">✦</div>
            <div>
              <p className="text-sm font-bold text-white font-inter">GovFlow AI Assistant</p>
              <p className="text-xs text-rose-200 font-roboto">Powered by Gemini · Always active</p>
            </div>
            <button
              onClick={() => setMessages([])}
              className="ml-auto text-xs text-rose-200 hover:text-white transition-colors font-roboto"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 max-h-[380px]">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 text-center font-open-sans">Ask anything about your compliance journey</p>
                <div className="space-y-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="w-full text-left text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-[#800020] text-slate-700 transition-colors border border-slate-200/70 font-open-sans"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                {m.role === "model" && (
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs text-[#800020] mr-2 mt-0.5 shrink-0 font-bold">✦</div>
                )}
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed font-open-sans ${
                    m.role === "user"
                      ? "bg-[#800020] text-white rounded-br-xs shadow-xs"
                      : "bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-xs"
                  }`}
                >
                  <FormattedMessage text={m.text} isUser={m.role === "user"} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs text-[#800020] mr-2 mt-0.5 shrink-0 font-bold">✦</div>
                <div className="bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#800020] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#800020] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#800020] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-200/80">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                placeholder="Ask about approvals, licences, documents..."
                className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:bg-white transition-all font-roboto"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-[#800020] hover:bg-[#5c0017] text-white flex items-center justify-center disabled:opacity-50 transition-all shadow-xs cursor-pointer"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

