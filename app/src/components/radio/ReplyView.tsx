// 电台回复展示 - 打字机 + 收藏 + 多说一点（1 币，每封仅一次）
import { useMemo } from "react";
import { useTypewriter } from "../../hooks/useTypewriter";
import { motion } from "framer-motion";
import { getRandomRadioOpening } from "../../config/exploration";
import type { Letter } from "../../types";

interface Props {
  letter: Letter;
  onBack: () => void;
  onCollectQuote?: (text: string) => void;
  /** 花 1 币让诞总再多说一段，每封信仅可点一次 */
  onRequestMore?: () => void;
  coins?: number;
  loadingMore?: boolean;
}

const MORE_COST = 1;

export default function ReplyView({
  letter,
  onBack,
  onCollectQuote,
  onRequestMore,
  coins = 0,
  loadingMore = false,
}: Props) {
  const hasReply = !!letter.reply;
  const hasExtended = !!letter.extendedReply;
  const displayMain = useTypewriter(letter.reply ?? "", {
    speedMs: 50,
    enabled: hasReply,
  });
  const displayExtended = useTypewriter(letter.extendedReply ?? "", {
    speedMs: 50,
    enabled: !!letter.extendedReply && !loadingMore,
  });
  const canRequestMore = hasReply && !hasExtended && coins >= MORE_COST && onRequestMore && !loadingMore;
  const opening = useMemo(() => getRandomRadioOpening(), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div
        className="rounded-2xl p-6 md:p-8 border-2"
        style={{
          background: "linear-gradient(135deg, #2d2318 0%, #1a1510 100%)",
          borderColor: "#8B7355",
        }}
      >
        <p className="text-[var(--mode-b-text-muted)] text-sm mb-2">你的信</p>
        <p className="text-[var(--mode-b-text)]/90 mb-6 whitespace-pre-wrap font-hand text-lg">
          {letter.content}
        </p>
        <p className="text-[var(--mode-b-text-muted)] text-xs italic mb-1">{opening}</p>
        <p className="text-[var(--mode-b-primary)] text-sm mb-2">诞总说</p>
        {!hasReply ? (
          <p className="text-[var(--mode-b-text-muted)] flex items-center gap-2">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              诞总正在喝酒…
            </motion.span>
            <span className="inline-block animate-bounce">🍷</span>
          </p>
        ) : (
          <>
            <p className="text-[var(--mode-b-text)] leading-relaxed whitespace-pre-wrap font-hand text-lg">
              {displayMain}
              <motion.span
                className="inline-block w-2 h-4 ml-0.5 align-middle bg-[var(--mode-b-primary)]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            </p>
            {loadingMore && (
              <p className="text-[var(--mode-b-text-muted)] text-sm mt-3 flex items-center gap-2">
                <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}>
                  诞总正在多说…
                </motion.span>
                🍷
              </p>
            )}
            {(hasExtended || letter.extendedReply) && (
              <p className="text-[var(--mode-b-text)] leading-relaxed whitespace-pre-wrap font-hand text-lg mt-3 pt-3 border-t border-[var(--mode-b-text-muted)]/30">
                {displayExtended}
                {!loadingMore && (
                  <motion.span
                    className="inline-block w-2 h-4 ml-0.5 align-middle bg-[var(--mode-b-primary)]"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                )}
              </p>
            )}
          </>
        )}
        {hasReply && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            {onCollectQuote && (
              <motion.button
                type="button"
                onClick={() => onCollectQuote(letter.reply!)}
                className="text-xs px-2 py-1 rounded border border-[var(--mode-b-text-muted)] text-[var(--mode-b-text-muted)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                收藏这条回复
              </motion.button>
            )}
            {canRequestMore && (
              <motion.button
                type="button"
                onClick={onRequestMore}
                className="text-xs px-2 py-1 rounded border border-[var(--mode-b-primary)] text-[var(--mode-b-primary)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                多说一点（{MORE_COST} 币）
              </motion.button>
            )}
            {hasReply && !hasExtended && coins < MORE_COST && onRequestMore && (
              <span className="text-xs text-[var(--mode-b-text-muted)]">多说一点 需 {MORE_COST} 币</span>
            )}
          </div>
        )}
      </div>
      <motion.button
        type="button"
        onClick={onBack}
        className="mt-6 px-6 py-2 rounded-xl font-medium"
        style={{
          background: "var(--mode-b-accent)",
          color: "var(--mode-b-text)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        再写一封
      </motion.button>
    </motion.div>
  );
}
