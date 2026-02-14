// 演出阶段 - 简单舞台 + 随机观众反应（掌声/哄笑/冷场/再来一个等）
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { getRandomAudienceReaction } from "../../config/exploration";

interface Props {
  script: string;
  onFinish: () => void;
}

export default function Stage({ script, onFinish }: Props) {
  const chosen = useMemo(() => getRandomAudienceReaction(), []);
  const [reaction, setReaction] = useState<"idle" | "done">("idle");

  useEffect(() => {
    const t = setTimeout(() => setReaction("done"), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reaction !== "done") return;
    const t = setTimeout(onFinish, 2800);
    return () => clearTimeout(t);
  }, [reaction, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center min-h-[320px]"
    >
      <div
        className="w-full rounded-2xl p-6 mb-8 border-2 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, var(--mode-a-primary-soft) 0%, var(--mode-a-bg-card) 70%)",
          borderColor: "var(--mode-a-primary)",
          boxShadow: "0 0 40px rgba(167,139,250,0.12)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.06),transparent_70%)]" />
        <p className="text-[var(--mode-a-text-muted)] text-xs mb-2">开放麦 · 台上</p>
        <p className="text-[var(--mode-a-text)] whitespace-pre-wrap text-left text-sm leading-relaxed">
          {script}
        </p>
      </div>

      <div className="flex gap-4 text-2xl">
        {reaction === "idle" && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-[var(--mode-a-text-muted)]"
          >
            观众在听…
          </motion.p>
        )}
        {reaction === "done" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex gap-2"
          >
            <span>{chosen.emoji}</span>
            <span className="text-[var(--mode-a-text-muted)] text-base align-middle">{chosen.label}</span>
          </motion.div>
        )}
      </div>

      {reaction === "done" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-[var(--mode-a-accent)] text-center"
        >
          {chosen.subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
