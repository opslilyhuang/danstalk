// 角度选择 - 三选一，降低空白页焦虑
// #70 希克定律 - 选项少、决策快
import { motion } from "framer-motion";
import { ANGLE_OPTIONS } from "../../config/topics";

type Angle = (typeof ANGLE_OPTIONS)[number];

interface Props {
  options: readonly Angle[];
  onSelect: (angle: Angle) => void;
}

export default function AngleSelector({ options, onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto px-4 py-6"
    >
      <p className="text-[var(--mode-a-text-muted)] text-sm mb-6 text-center">
        选一个角度来写
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((opt, i) => (
          <motion.button
            key={opt.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl border-2 text-left transition-colors"
            style={{
              background: "var(--mode-a-primary-soft)",
              borderColor: "var(--mode-a-primary)",
              color: "var(--mode-a-text)",
            }}
            whileHover={{ scale: 1.05, borderColor: "var(--mode-a-accent)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(opt)}
          >
            <span className="font-title text-base block mb-1">{opt.label}</span>
            <span className="text-xs text-[var(--mode-a-text-muted)]">
              {opt.desc}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
