"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { GREETING, SUGGESTIONS } from "@/lib/knowledge";
import { site } from "@/lib/site";
import { OPEN_CHAT_EVENT } from "@/lib/chat-events";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || busy) return;

      const next: Msg[] = [...messages, { role: "user", content }];
      setMessages(next);
      setInput("");
      setBusy(true);
      scrollToEnd();

      // placeholder assistant message we stream into
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
        });

        if (!res.body) throw new Error("no stream");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: acc };
            return copy;
          });
          scrollToEnd();
        }
      } catch {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: `Sorry — I hit a snag. Please email us at ${site.contact.email} and we'll jump right on it.`,
          };
          return copy;
        });
      } finally {
        setBusy(false);
        scrollToEnd();
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [messages, busy, scrollToEnd]
  );

  // Open from anywhere (navbar/hero/etc.), with optional prefilled prompt.
  useEffect(() => {
    const handler = (e: Event) => {
      setOpen(true);
      setUnread(false);
      const detail = (e as CustomEvent).detail as { prompt?: string } | undefined;
      if (detail?.prompt) setTimeout(() => send(detail.prompt!), 250);
    };
    window.addEventListener(OPEN_CHAT_EVENT, handler);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handler);
  }, [send]);

  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  return (
    <>
      {/* Launcher */}
      <div className="fixed bottom-5 right-5 z-50 md:bottom-7 md:right-7">
        <AnimatePresence>
          {!open && (
            <motion.button
              key="launcher"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => setOpen(true)}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950 shadow-[0_12px_40px_-8px_rgba(227,168,28,0.75)]"
              aria-label="Open chat"
            >
              <span className="absolute inset-0 rounded-full bg-gold-400/60 animate-pulse-ring" />
              <MessageCircle className="relative h-6 w-6" strokeWidth={2.2} />
              {unread && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink-950 text-[0.6rem] font-bold text-gold-300 ring-2 ring-gold-400">
                  1
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed bottom-5 right-5 z-50 flex h-[min(620px,calc(100vh-2.5rem))] w-[calc(100vw-2.5rem)] max-w-[400px] flex-col overflow-hidden rounded-3xl border border-white/12 bg-ink-900/95 shadow-soft backdrop-blur-xl md:bottom-7 md:right-7"
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-ink-800 to-ink-900 px-5 py-4">
              <div className="bg-radial-gold pointer-events-none absolute inset-0 opacity-50" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-gold-300 to-gold-500 font-serif text-lg text-ink-950">
                P
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-900 bg-emerald-400" />
              </div>
              <div className="relative flex-1">
                <div className="flex items-center gap-1.5 font-serif text-cream">
                  Portia
                  <Sparkles className="h-3.5 w-3.5 text-gold-300" />
                </div>
                <div className="text-xs text-cream/55">
                  {site.brand} concierge · online
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="relative rounded-lg p-1.5 text-cream/60 transition-colors hover:bg-white/10 hover:text-cream"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
            >
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} content={m.content} busy={busy && i === messages.length - 1} />
              ))}

              {/* Suggestions only on the very first turn */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-gold-500/30 bg-gold-500/5 px-3 py-1.5 text-xs text-gold-200 transition-colors hover:bg-gold-500/15"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-white/10 bg-ink-950/60 p-3"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-ink-900 px-3 py-2 focus-within:border-gold-400/50">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your book…"
                  className="flex-1 bg-transparent py-1.5 text-sm text-cream placeholder:text-cream/35 outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950 transition-opacity disabled:opacity-40"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[0.65rem] text-cream/30">
                AI concierge · for exact quotes, request one in the contact form
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({
  role,
  content,
  busy,
}: {
  role: "user" | "assistant";
  content: string;
  busy: boolean;
}) {
  const isUser = role === "user";
  const showTyping = !isUser && busy && content.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950"
            : "rounded-bl-sm border border-white/10 bg-white/[0.04] text-cream/90"
        }`}
      >
        {showTyping ? (
          <span className="flex gap-1 py-1">
            <Dot d={0} />
            <Dot d={0.15} />
            <Dot d={0.3} />
          </span>
        ) : (
          <span className="whitespace-pre-wrap">{content}</span>
        )}
      </div>
    </motion.div>
  );
}

function Dot({ d }: { d: number }) {
  return (
    <motion.span
      className="h-1.5 w-1.5 rounded-full bg-cream/50"
      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, delay: d }}
    />
  );
}
