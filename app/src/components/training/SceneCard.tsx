// 选题阶段 - 话题卡片；高级话题可花币解锁
import { motion } from "framer-motion";

interface Props {
  topic: string;
  isLocked: boolean;
  coins: number;
  unlockCost: number;
  onUnlock: () => void;
  onNext: () => void;
  /** 换一题（免费题），不花币也能写段子赚币 */
  onSwapTopic?: () => void;
}

export default function SceneCard({ topic, isLocked, coins, unlockCost, onUnlock, onNext, onSwapTopic }: Props) {
  const canUnlock = isLocked && coins >= unlockCost;
  const cannotUnlock = isLocked && coins < unlockCost;

  const handleMain = () => {
    if (!isLocked) {
      onNext();
      return;
    }
    if (canUnlock) {
      onUnlock();
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[280px] px-4"
    >
      <p className="text-[var(--mode-a-text-muted)] text-sm mb-4">今日话题</p>
      <motion.div
        className="w-full max-w-xs aspect-[4/3] rounded-2xl flex flex-col items-center justify-center p-6 border-2 cursor-pointer"
        style={{
          background: "linear-gradient(145deg, var(--mode-a-primary-soft), rgba(167,139,250,0.06))",
          borderColor: cannotUnlock ? "var(--mode-a-text-muted)" : "var(--mode-a-primary)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px rgba(167,139,250,0.15)",
        }}
        whileHover={!cannotUnlock ? { scale: 1.03 } : {}}
        whileTap={!cannotUnlock ? { scale: 0.98 } : {}}
        onClick={cannotUnlock ? undefined : handleMain}
      >
        <span className="font-title text-xl md:text-2xl text-center text-[var(--mode-a-text)]">
          {topic}
        </span>
        {isLocked && (
          <span className="mt-2 text-xs text-[var(--mode-a-text-muted)]">
            {cannotUnlock
              ? `需 ${unlockCost} 币解锁（当前 ${coins} 币）`
              : `花 ${unlockCost} 币解锁`}
          </span>
        )}
      </motion.div>
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        {!cannotUnlock && (
          <motion.button
            type="button"
            onClick={handleMain}
            className="px-6 py-2 rounded-xl font-medium bg-[var(--mode-a-primary)] text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {canUnlock ? `花 ${unlockCost} 币解锁并开始` : "就这个"}
          </motion.button>
        )}
        {onSwapTopic && (
          <motion.button
            type="button"
            onClick={onSwapTopic}
            className="px-6 py-2 rounded-xl font-medium border border-[var(--mode-a-text-muted)] text-[var(--mode-a-text-muted)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            换一题（写别的赚币）
          </motion.button>
        )}
      </div>
      {cannotUnlock && !onSwapTopic && (
        <p className="mt-2 text-sm text-[var(--mode-a-text-muted)]">先去开放麦赚点币再来</p>
      )}
    </motion.div>
  );
}
