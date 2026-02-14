// 彩蛋页 - 连续 3 天写段子后「诞总请你喝酒」
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Egg() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-sm text-center"
      >
        <p className="text-6xl mb-6">🍷</p>
        <h1 className="font-title text-xl text-[var(--mode-a-text)] mb-2">诞总请你喝酒</h1>
        <p className="text-[var(--mode-a-text-muted)] text-sm leading-relaxed mb-8">
          连写三天，有诚意。酒先记着，下次一定。<br />
          回去多写段子，比喝酒管用。
        </p>
        <Link to="/">
          <motion.span
            className="inline-block px-6 py-2.5 rounded-xl font-medium border-2 border-[var(--mode-a-primary)] text-[var(--mode-a-text)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            回首页
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}
