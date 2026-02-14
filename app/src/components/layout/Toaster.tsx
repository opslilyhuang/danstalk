import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";

export default function Toaster() {
  const toast = useGameStore((s) => s.toast);
  const setToast = useGameStore((s) => s.setToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast, setToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-lg"
          style={{
            background: "var(--mode-b-accent)",
            color: "var(--mode-b-text)",
          }}
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
