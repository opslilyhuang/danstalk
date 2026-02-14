// 奖励 - 毒硬币按字数；太短无奖励
import { motion } from "framer-motion";
import { IconCoin } from "../icons/NavIcons";
import { MIN_SCRIPT_LENGTH } from "../../config/coins";

interface Props {
  scriptLength: number;
  coinsEarned: number;
  onAgain: () => void;
  onExit: () => void;
}

export default function RewardScreen({ scriptLength, coinsEarned, onAgain, onExit }: Props) {
  const tooShort = scriptLength < MIN_SCRIPT_LENGTH;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm mx-auto px-4 py-10 flex flex-col items-center"
    >
      {tooShort ? (
        <>
          <p className="text-[var(--mode-a-text-muted)] text-sm mb-2">诞总说</p>
          <p className="text-[var(--mode-a-text)] text-center mb-2">
            写得太短了，懒得评。至少写够 {MIN_SCRIPT_LENGTH} 字再来领奖。
          </p>
          <p className="text-sm text-[var(--mode-a-accent)]">本局 0 毒硬币</p>
        </>
      ) : (
        <>
          <p className="text-[var(--mode-a-text-muted)] text-sm mb-2">本局获得</p>
          <motion.div
            className="flex items-center gap-2 text-2xl font-title text-[var(--mode-a-accent)]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <IconCoin className="w-7 h-7" />
            <span>+{coinsEarned} 毒硬币</span>
          </motion.div>
        </>
      )}
      <div className="flex gap-4 mt-10">
        <motion.button
          type="button"
          onClick={onAgain}
          className="px-6 py-2 rounded-xl font-medium bg-[var(--mode-a-primary)] text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          再来一局
        </motion.button>
        <motion.button
          type="button"
          onClick={onExit}
          className="px-6 py-2 rounded-xl font-medium border-2 border-[var(--mode-a-primary)] text-[var(--mode-a-text)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          回首页
        </motion.button>
      </div>
    </motion.div>
  );
}
