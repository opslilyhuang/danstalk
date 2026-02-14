import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IconMic, IconRadio } from "../components/icons/NavIcons";
import { getDanMoodToday } from "../config/exploration";
import { getLockedHiddenTopicCount } from "../config/topics";
import { isChatOpen } from "../config/chat";
import { useGameStore } from "../store/gameStore";

export default function Home() {
  const unlockedHiddenTopics = useGameStore((s) => s.unlockedHiddenTopics ?? []);
  const trainingStreak = useGameStore((s) => s.trainingStreak ?? 0);

  const danMood = getDanMoodToday();
  const lockedCount = getLockedHiddenTopicCount(unlockedHiddenTopics);
  const showEgg = trainingStreak >= 3;
  const chatOpen = isChatOpen();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <motion.h1
        className="font-title text-3xl md:text-4xl mb-4 text-[var(--mode-a-text)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        诞说无妨
      </motion.h1>

      <motion.p
        className="text-[var(--mode-a-text-muted)] text-xs mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        诞总今日：{danMood.label} · {danMood.hint}
      </motion.p>

      <Link to="/guide" className="mb-6">
        <motion.span
          className="inline-block text-sm text-[var(--mode-a-accent)] border-b border-[var(--mode-a-accent)]/50 hover:border-[var(--mode-a-accent)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          whileHover={{ opacity: 0.9 }}
        >
          诞总让你先看这个
        </motion.span>
      </Link>

      <motion.div
        className="w-24 h-24 md:w-32 md:h-32 rounded-2xl mb-10 flex items-center justify-center border border-[var(--mode-a-primary)]/40"
        style={{
          background: "linear-gradient(145deg, var(--mode-a-primary-soft), rgba(110, 231, 183, 0.08))",
          boxShadow: "0 0 40px rgba(167, 139, 250, 0.15)",
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <IconMic className="w-12 h-12 md:w-16 md:h-16 text-[var(--mode-a-primary)]" />
      </motion.div>

      <p className="text-[var(--mode-a-text-muted)] text-sm mb-4 text-center max-w-xs">
        选一扇门进去
      </p>

      {lockedCount > 0 && (
        <p className="text-[var(--mode-a-text-muted)] text-xs mb-6">
          还有 <span className="text-[var(--mode-a-accent)]">{lockedCount}</span> 个隐藏话题待解锁
        </p>
      )}

      {showEgg && (
        <Link to="/egg" className="mb-6">
          <motion.span
            className="inline-block px-4 py-2 rounded-xl text-sm border border-[var(--mode-a-accent)]/50 text-[var(--mode-a-accent)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            🍷 诞总请你喝酒
          </motion.span>
        </Link>
      )}

      <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
        <Link to="/training">
          <motion.div
            className="w-24 h-32 md:w-28 md:h-40 rounded-2xl flex flex-col items-center justify-center gap-2 border px-3"
            style={{
              background: "var(--mode-a-bg-elevated)",
              borderColor: "rgba(167, 139, 250, 0.35)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(167,139,250,0.1)",
            }}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-[var(--mode-a-primary)]">
              <IconMic className="w-8 h-8 md:w-10 md:h-10" />
            </span>
            <span className="font-title text-xs md:text-sm text-[var(--mode-a-text)]">开放麦</span>
            <span className="text-xs text-[var(--mode-a-text-muted)]">训练营</span>
          </motion.div>
        </Link>
        <Link to="/radio">
          <motion.div
            className="w-24 h-32 md:w-28 md:h-40 rounded-2xl flex flex-col items-center justify-center gap-2 border px-3"
            style={{
              background: "var(--mode-a-bg-elevated)",
              borderColor: "rgba(245, 158, 11, 0.35)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(245,158,11,0.1)",
            }}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-[var(--mode-b-primary)]">
              <IconRadio className="w-8 h-8 md:w-10 md:h-10" />
            </span>
            <span className="font-title text-xs md:text-sm text-[var(--mode-a-text)]">深夜</span>
            <span className="text-xs text-[var(--mode-a-text-muted)]">电台</span>
          </motion.div>
        </Link>
        {chatOpen ? (
          <Link to="/chat">
            <motion.div
              className="w-24 h-32 md:w-28 md:h-40 rounded-2xl flex flex-col items-center justify-center gap-2 border px-3"
              style={{
                background: "var(--mode-a-bg-elevated)",
                borderColor: "rgba(167, 139, 250, 0.6)",
                boxShadow: "0 8px 32px rgba(167, 139, 250, 0.2), 0 0 0 1px rgba(167,139,250,0.2)",
              }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-3xl">🍷</span>
              <span className="font-title text-xs md:text-sm text-[var(--mode-a-text)]">和诞总</span>
              <span className="text-xs text-[var(--mode-a-accent)]">聊聊</span>
            </motion.div>
          </Link>
        ) : (
          <motion.div
            className="w-24 h-32 md:w-28 md:h-40 rounded-2xl flex flex-col items-center justify-center gap-2 border px-3 opacity-60"
            style={{
              background: "var(--mode-a-bg-elevated)",
              borderColor: "rgba(156, 163, 175, 0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(156,163,175,0.1)",
            }}
          >
            <span className="text-3xl grayscale">🍷</span>
            <span className="font-title text-xs md:text-sm text-[var(--mode-a-text-muted)]">和诞总</span>
            <span className="text-xs text-[var(--mode-a-text-muted)] text-center leading-tight">
              暂未开放
            </span>
            <span className="text-[10px] text-[var(--mode-a-text-muted)]/70 text-center leading-tight">
              20点-凌晨2点
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
