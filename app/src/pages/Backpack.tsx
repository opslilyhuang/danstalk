import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { ACHIEVEMENTS } from "../config/exploration";

export default function Backpack() {
  const quotes = useGameStore((s) => s.user.collectedQuotes ?? []);
  const letters = useGameStore((s) => s.letters).filter((l) => l.status === "replied" && l.reply);
  const achievements = useGameStore((s) => s.achievements ?? []);
  const removeQuote = useGameStore((s) => s.removeQuote);
  const removeLetter = useGameStore((s) => s.removeLetter);

  const unlockedIds = new Set(achievements.map((a) => a.id));
  const [deletingLetterId, setDeletingLetterId] = useState<string | null>(null);

  const handleRemoveLetter = (id: string) => {
    if (deletingLetterId === id) {
      removeLetter(id);
      setDeletingLetterId(null);
    } else {
      setDeletingLetterId(id);
    }
  };

  return (
    <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-title text-xl">背包</h1>
        <Link
          to="/"
          className="text-sm text-[var(--mode-b-text-muted)] hover:underline"
        >
          回首页
        </Link>
      </div>

      <section className="mb-8">
        <h2 className="text-[var(--mode-a-text-muted)] text-sm mb-3">成就</h2>
        <p className="text-xs text-[var(--mode-a-text-muted)] mb-3">
          已解锁 {unlockedIds.size} / {ACHIEVEMENTS.length}
        </p>
        <ul className="space-y-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedIds.has(a.id);
            return (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl border flex flex-col gap-1 ${
                  unlocked
                    ? "border-[var(--mode-a-accent)]/40"
                    : "border-[var(--mode-a-text-muted)]/20 opacity-75"
                }`}
                style={{
                  background: unlocked ? "var(--mode-a-accent-soft)" : "var(--mode-a-bg-elevated)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-medium text-sm ${unlocked ? "text-[var(--mode-a-text)]" : "text-[var(--mode-a-text-muted)]"}`}>
                    {a.name}
                  </span>
                  {unlocked ? (
                    <span className="text-[var(--mode-a-accent)] text-xs">已解锁</span>
                  ) : (
                    <span className="text-[var(--mode-a-text-muted)] text-xs">未解锁</span>
                  )}
                </div>
                <p className="text-xs text-[var(--mode-a-text-muted)]">
                  {a.desc}
                  {unlocked && a.hiddenTopic && (
                    <span className="block mt-1 text-[var(--mode-a-accent)]">解锁话题：{a.hiddenTopic}</span>
                  )}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-[var(--mode-a-text-muted)] text-sm mb-3">收藏的金句</h2>
        {quotes.length === 0 ? (
          <p className="text-sm text-[var(--mode-a-text-muted)]">暂无，在电台或开放麦点评里可收藏</p>
        ) : (
          <ul className="space-y-3">
            {quotes.map((q) => (
              <motion.li
                key={q.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl border border-[var(--mode-a-primary)]/30 flex flex-col gap-2"
                style={{ background: "var(--mode-a-primary-soft)" }}
              >
                <p className="text-[var(--mode-a-text)] text-sm whitespace-pre-wrap">
                  {q.text}
                </p>
                <button
                  type="button"
                  onClick={() => removeQuote(q.id)}
                  className="text-xs text-[var(--mode-a-text-muted)] hover:text-[var(--mode-a-accent)] self-end"
                >
                  取消收藏
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-[var(--mode-a-text-muted)] text-sm mb-3">往期电台</h2>
        {letters.length === 0 ? (
          <p className="text-sm text-[var(--mode-a-text-muted)]">暂无已回复的信</p>
        ) : (
          <ul className="space-y-3">
            {letters.slice(0, 50).map((l) => (
              <motion.li
                key={l.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl border border-[var(--mode-b-primary)]/30 bg-[rgba(245,158,11,0.06)] flex flex-col gap-2"
              >
                <p className="text-[var(--mode-a-text-muted)] text-xs truncate">
                  {l.content.slice(0, 50)}{l.content.length > 50 ? "…" : ""}
                </p>
                <p className="text-[var(--mode-a-text)] text-sm line-clamp-2">
                  {l.reply?.slice(0, 80)}…
                </p>
                <button
                  type="button"
                  onClick={() => handleRemoveLetter(l.id)}
                  className="text-xs text-[var(--mode-a-text-muted)] hover:text-red-400 self-end"
                >
                  {deletingLetterId === l.id ? "确定删除？" : "删除"}
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
