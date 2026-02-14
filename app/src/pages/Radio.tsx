import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import LetterWriter from "../components/radio/LetterWriter";
import ReplyView from "../components/radio/ReplyView";
import { streamRadioReply, streamRadioReplyMore } from "../api/deepseek";

type Step = "write" | "sending" | "waiting" | "reply";

const CUT_IN_COST = 2; // 插队 2 币
const IMMEDIATE_CHANCE = 0.2; // 20% 立即回复

const MORE_COST = 1; // 多说一点 1 币

export default function Radio() {
  const [step, setStep] = useState<Step>("write");
  const [currentLetterId, setCurrentLetterId] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const addLetter = useGameStore((s) => s.addLetter);
  const setLetterReply = useGameStore((s) => s.setLetterReply);
  const setLetterExtendedReply = useGameStore((s) => s.setLetterExtendedReply);
  const spendCoins = useGameStore((s) => s.spendCoins);
  const collectQuote = useGameStore((s) => s.collectQuote);
  const setToast = useGameStore((s) => s.setToast);
  const coins = useGameStore((s) => s.user.coins ?? 0);

  const runReply = async (id: string, content: string) => {
    setStep("reply");
    try {
      await streamRadioReply(content, {
        onChunk: () => {},
        onDone: (fullText) => setLetterReply(id, fullText),
        onError: () =>
          setLetterReply(id, "害，今儿喝多了，信号不好…改天再聊。"),
      });
    } catch {
      setLetterReply(id, "害，今儿喝多了，信号不好…改天再聊。");
    }
  };

  const handleSubmit = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) {
      setToast("写点什么再投递吧");
      return;
    }
    const id = addLetter(trimmed);
    setCurrentLetterId(id);
    setStep("sending");
    await new Promise((r) => setTimeout(r, 1500));
    setStep("waiting");

    const immediate = Math.random() < IMMEDIATE_CHANCE;
    if (immediate) {
      await runReply(id, trimmed);
    }
  };

  const handleCutIn = async () => {
    if (coins < CUT_IN_COST || !currentLetterId) return;
    const letters = useGameStore.getState().letters;
    const letter = letters.find((l) => l.id === currentLetterId);
    if (!letter?.content) return;
    if (!spendCoins(CUT_IN_COST)) return;
    await runReply(currentLetterId, letter.content);
  };

  const letters = useGameStore((s) => s.letters);
  const letter = currentLetterId
    ? letters.find((l) => l.id === currentLetterId) ?? null
    : null;

  const handleRequestMore = async () => {
    if (!letter?.reply || letter.extendedReply || coins < MORE_COST || loadingMore) return;
    if (!spendCoins(MORE_COST)) return;
    setLoadingMore(true);
    try {
      await streamRadioReplyMore(letter.content, letter.reply, {
        onChunk: () => {},
        onDone: (text) => setLetterExtendedReply(letter.id, text),
        onError: () => setLetterExtendedReply(letter.id, "害，今儿真喝多了…下回再说。"),
      });
    } catch {
      setLetterExtendedReply(letter.id, "害，今儿真喝多了…下回再说。");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center max-w-lg mx-auto w-full px-4 py-6">
      <AnimatePresence mode="wait">
        {step === "write" && (
          <motion.div
            key="write"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <LetterWriter onSubmit={handleSubmit} />
          </motion.div>
        )}
        {step === "sending" && (
          <motion.div
            key="sending"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center justify-center py-20"
          >
            <p className="text-[var(--mode-b-text-muted)] mb-4">信飞向诞总中…</p>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="text-5xl"
            >
              ✉️
            </motion.div>
          </motion.div>
        )}
        {step === "waiting" && !letter?.reply && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center justify-center py-16 text-center"
          >
            <p className="text-[var(--mode-b-text-muted)] mb-2">
              信已投入，等待诞总拆阅…
            </p>
            <p className="text-sm text-[var(--mode-b-text-muted)]/80 mb-6">
              可能需一段时间，或花币插队立即回复
            </p>
            <motion.span
              className="inline-block text-4xl mb-6"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🍷
            </motion.span>
            {coins >= CUT_IN_COST && (
              <motion.button
                type="button"
                onClick={handleCutIn}
                className="px-6 py-2 rounded-xl font-medium bg-[var(--mode-b-primary)] text-[var(--mode-b-bg)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                花 {CUT_IN_COST} 币插队立即回复
              </motion.button>
            )}
            {coins < CUT_IN_COST && (
              <p className="text-sm text-[var(--mode-b-text-muted)]">
                毒硬币不足（需 {CUT_IN_COST} 币），去开放麦赚点吧
              </p>
            )}
          </motion.div>
        )}
        {(step === "reply" || letter?.reply) && letter && (
          <motion.div
            key="reply"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <ReplyView
              letter={letter}
              onBack={() => {
                setStep("write");
                setCurrentLetterId(null);
              }}
              onCollectQuote={(text) => {
                collectQuote({
                  id: crypto.randomUUID(),
                  text,
                  sourceLetterId: letter.id,
                  collectedAt: Date.now(),
                });
                setToast("已收藏到背包");
              }}
              onRequestMore={handleRequestMore}
              coins={coins}
              loadingMore={loadingMore}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
