// 创作阶段 - 写段子，可选「求灵感」AI 辅助
// #60 以用户为中心 - 减少阻力，给灵感不代劳
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  topic: string;
  angleLabel: string;
  onSubmit: (script: string) => void;
  onRequestHint?: () => Promise<string>;
}

export default function WritingDesk({
  topic,
  angleLabel,
  onSubmit,
  onRequestHint,
}: Props) {
  const [script, setScript] = useState("");
  const [hint, setHint] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  const hintRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    const t = script.trim();
    if (!t) return;
    onSubmit(t);
  };

  const handleHint = async () => {
    if (!onRequestHint || loadingHint) return;
    setLoadingHint(true);
    setHint("");
    try {
      const text = await onRequestHint();
      setHint(text);
      hintRef.current?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setLoadingHint(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl mx-auto px-4 py-6"
    >
      <p className="text-[var(--mode-a-text-muted)] text-sm mb-2">
        {topic} · {angleLabel}
      </p>
      <div
        className="rounded-xl border-2 p-4 min-h-[200px] mb-4"
        style={{
          background: "var(--mode-a-bg-card)",
          borderColor: "var(--mode-a-primary)",
        }}
      >
        <textarea
          className="w-full min-h-[180px] resize-none bg-transparent text-[var(--mode-a-text)] placeholder-[var(--mode-a-text-muted)] focus:outline-none text-base leading-relaxed"
          placeholder="写你的段子…铺垫、笑点、底。诞总不会代写，只会点评。"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          maxLength={1200}
        />
        <p className="text-right text-xs text-[var(--mode-a-text-muted)]">
          {script.length}/1200
        </p>
      </div>

      {onRequestHint && (
        <div className="flex gap-3 mb-4">
          <motion.button
            type="button"
            onClick={handleHint}
            disabled={loadingHint}
            className="px-4 py-2 rounded-lg text-sm border border-[var(--mode-a-primary)] text-[var(--mode-a-primary)] disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loadingHint ? "诞总在想…" : "求灵感"}
          </motion.button>
        </div>
      )}

      {hint && (
        <div
          ref={hintRef}
          className="p-3 rounded-lg mb-4 text-sm border border-[var(--mode-a-accent)]/50 bg-[var(--mode-a-accent)]/5 text-[var(--mode-a-text-muted)]"
        >
          {hint}
        </div>
      )}

      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={!script.trim()}
        className="w-full py-3 rounded-xl font-medium bg-[var(--mode-a-primary)] text-white disabled:opacity-40 disabled:cursor-not-allowed"
        whileHover={{ scale: script.trim() ? 1.02 : 1 }}
        whileTap={{ scale: script.trim() ? 0.98 : 1 }}
      >
        上台
      </motion.button>
    </motion.div>
  );
}
