// 随便聊聊 - 每晚 20:00（中国时间）开放，多轮对话约 5 分钟，可花币延长
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { streamChatReply, type ChatMessage } from "../api/deepseek";
import {
  isChatOpen,
  getMsUntilOpen,
  CHAT_DURATION_SEC,
  CHAT_EXTEND_SEC,
  CHAT_EXTEND_COST,
} from "../config/chat";

function formatCountdown(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Chat() {
  const coins = useGameStore((s) => s.user.coins ?? 0);
  const spendCoins = useGameStore((s) => s.spendCoins);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [partial, setPartial] = useState("");
  const [sessionEndsAt, setSessionEndsAt] = useState<number | null>(null);
  const [countdownMs, setCountdownMs] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const open = isChatOpen();
  const remainingSec = sessionEndsAt ? Math.max(0, Math.ceil((sessionEndsAt - Date.now()) / 1000)) : null;
  const hasTime = sessionEndsAt == null || (remainingSec != null && remainingSec > 0);
  const canSend = open && !loading && hasTime && !!input.trim();
  const canExtend = open && coins >= CHAT_EXTEND_COST;
  const isExpired = sessionEndsAt != null && remainingSec != null && remainingSec <= 0;

  useEffect(() => {
    if (sessionEndsAt == null) return;
    const tick = () => setCountdownMs(Math.max(0, sessionEndsAt - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sessionEndsAt]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, partial]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || loading || !open) return;
    if (sessionEndsAt && Date.now() >= sessionEndsAt) return;

    if (!sessionEndsAt) {
      setSessionEndsAt(Date.now() + CHAT_DURATION_SEC * 1000);
    }

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    setPartial("");

    const nextHistory: ChatMessage[] = [...messages, { role: "user", content: text }];

    streamChatReply(nextHistory, {
      onChunk: (chunk) => setPartial((p) => p + chunk),
      onDone: (full) => {
        setMessages((prev) => [...prev, { role: "assistant", content: full }]);
        setPartial("");
        setLoading(false);
      },
      onError: () => {
        setMessages((prev) => [...prev, { role: "assistant", content: "害，信号不好…你再说一遍？" }]);
        setPartial("");
        setLoading(false);
      },
    }).catch(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: "害，信号不好…你再说一遍？" }]);
      setPartial("");
      setLoading(false);
    });
  }, [input, loading, open, messages, sessionEndsAt]);

  const extend = useCallback(() => {
    if (coins < CHAT_EXTEND_COST || !spendCoins(CHAT_EXTEND_COST)) return;
    setSessionEndsAt((prev) => (prev ?? Date.now()) + CHAT_EXTEND_SEC * 1000);
  }, [coins, spendCoins]);

  if (!open) {
    const ms = getMsUntilOpen();
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm text-center"
        >
          <p className="text-4xl mb-4">🍷</p>
          <h1 className="font-title text-xl text-[var(--mode-a-text)] mb-2">随便聊聊</h1>
          <p className="text-[var(--mode-a-text-muted)] text-sm mb-4">
            每晚 <strong className="text-[var(--mode-a-accent)]">20:00—02:00</strong>（中国时间）开放，和诞总随便唠唠。
          </p>
          <p className="text-[var(--mode-a-text-muted)] text-sm mb-6">
            距离开放还有 <span className="text-[var(--mode-a-accent)] font-medium">{formatCountdown(ms)}</span>
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 rounded-xl font-medium border-2 border-[var(--mode-a-primary)] text-[var(--mode-a-text)]"
          >
            回首页
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-8rem)] max-h-[700px] max-w-lg mx-auto w-full px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="font-title text-lg text-[var(--mode-a-text)]">和诞总聊聊</h1>
        <div className="flex items-center gap-3">
          {sessionEndsAt != null && remainingSec != null && (
            <span className="text-xs text-[var(--mode-a-text-muted)]">
              剩余 {formatCountdown(countdownMs)}
            </span>
          )}
          {canExtend && sessionEndsAt != null && (
            <motion.button
              type="button"
              onClick={extend}
              className="text-xs px-2 py-1 rounded-lg border border-[var(--mode-a-accent)] text-[var(--mode-a-accent)]"
              whileTap={{ scale: 0.98 }}
            >
              +2 分钟（{CHAT_EXTEND_COST} 币）
            </motion.button>
          )}
          <Link to="/" className="text-xs text-[var(--mode-a-text-muted)] hover:text-[var(--mode-a-accent)]">
            回首页
          </Link>
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2"
        style={{ minHeight: 200 }}
      >
        {messages.length === 0 && !partial && (
          <p className="text-[var(--mode-a-text-muted)] text-sm text-center py-8">
            随便说点啥，诞总在。
          </p>
        )}
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-[var(--mode-a-primary)]/30 text-[var(--mode-a-text)]"
                  : "bg-[var(--mode-a-bg-elevated)] border border-[var(--mode-a-primary)]/30 text-[var(--mode-a-text)]"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
          </motion.div>
        ))}
        {partial && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-[var(--mode-a-bg-elevated)] border border-[var(--mode-a-primary)]/30 text-[var(--mode-a-text)]">
              <p className="whitespace-pre-wrap leading-relaxed">
                {partial}
                <span className="inline-block w-2 h-4 ml-0.5 align-middle bg-[var(--mode-a-accent)] animate-pulse" />
              </p>
            </div>
          </div>
        )}
      </div>

      {sessionEndsAt != null && remainingSec != null && remainingSec <= 0 && (
        <p className="text-center text-sm text-[var(--mode-a-text-muted)] mb-2">
          本次时间到了
          {open && <button onClick={() => setSessionEndsAt(null)} className="ml-2 text-[var(--mode-a-accent)] underline">重新开始</button>}
          {!open && "，明天 20:00 再来。"}
        </p>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={remainingSec && remainingSec > 0 ? "说点什么…" : "时间已到"}
          disabled={!canSend}
          className="flex-1 rounded-xl px-4 py-3 bg-[var(--mode-a-bg-elevated)] border border-[var(--mode-a-primary)]/30 text-[var(--mode-a-text)] placeholder-[var(--mode-a-text-muted)] focus:outline-none focus:border-[var(--mode-a-primary)] disabled:opacity-50"
        />
        <motion.button
          type="button"
          onClick={send}
          disabled={!canSend}
          className="px-5 py-3 rounded-xl font-medium bg-[var(--mode-a-primary)] text-white disabled:opacity-40 disabled:cursor-not-allowed"
          whileTap={canSend ? { scale: 0.98 } : {}}
        >
          发送
        </motion.button>
      </div>
    </div>
  );
}
