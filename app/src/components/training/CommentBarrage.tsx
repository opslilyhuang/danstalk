// 点评阶段 - 你写的段子对照 + 诞总点评 + 另外两人/三人讨论 + 再写一次 / 收藏
import { useState } from "react";
import { useTypewriter } from "../../hooks/useTypewriter";
import { motion } from "framer-motion";

export interface TwoCommentItem {
  name: string;
  comment: string;
}

interface Props {
  script: string;
  comment: string;
  isLoading: boolean;
  coins: number;
  onGoReward: () => void;
  onTwoComments: () => void;
  onTrioDiscussion: () => void;
  onRewrite: () => void;
  onCollectQuote: () => void;
  twoComments: TwoCommentItem[] | null;
  trioText: string | null;
  loadingTwo: boolean;
  loadingTrio: boolean;
  /** 诞总觉得特别不错时提示是否公开到诞说大赏 */
  showPublishOffer?: boolean;
  onPublish?: () => void;
  onSkipPublish?: () => void;
}

const COST_TWO = 2;
const COST_TRIO = 5;

export default function CommentBarrage({
  script,
  comment,
  isLoading,
  coins,
  onGoReward,
  onTwoComments,
  onTrioDiscussion,
  onRewrite,
  onCollectQuote,
  twoComments,
  trioText,
  loadingTwo,
  loadingTrio,
  showPublishOffer = false,
  onPublish,
  onSkipPublish,
}: Props) {
  const display = useTypewriter(comment, { speedMs: 35, enabled: !!comment && !isLoading });
  const commentDone = !isLoading && !!comment;
  const [scriptFolded, setScriptFolded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto px-4 py-6 space-y-6"
    >
      {/* 你写的段子 - 方便对照看点评 */}
      <div>
        <button
          type="button"
          onClick={() => setScriptFolded(!scriptFolded)}
          className="text-[var(--mode-a-text-muted)] text-sm mb-2 flex items-center gap-1"
        >
          {scriptFolded ? "展开" : "收起"} 你写的段子
          <span className="text-xs">{scriptFolded ? "▼" : "▲"}</span>
        </button>
        {!scriptFolded && (
          <div
            className="rounded-xl border border-[var(--mode-a-primary)]/40 p-4 mb-4 max-h-48 overflow-y-auto"
            style={{ background: "var(--mode-a-bg-card)" }}
          >
            <p className="text-[var(--mode-a-text)] text-sm whitespace-pre-wrap leading-relaxed">
              {script}
            </p>
          </div>
        )}
      </div>

      <div>
        <p className="text-[var(--mode-a-primary)] text-sm mb-2">诞总点评</p>
        <div
          className="rounded-xl border-2 p-5 min-h-[100px]"
          style={{
            background: "var(--mode-a-bg-card)",
            borderColor: "var(--mode-a-accent)",
            boxShadow: "0 0 24px rgba(110,231,183,0.08)",
          }}
        >
          {isLoading && !comment && (
            <p className="text-[var(--mode-a-text-muted)] flex items-center gap-2">
              <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}>
                诞总正在喝酒…
              </motion.span>
              🍷
            </p>
          )}
          {(comment || display) && (
            <>
              <p className="text-[var(--mode-a-text)] leading-relaxed whitespace-pre-wrap">
                {display}
                {isLoading && (
                  <motion.span
                    className="inline-block w-2 h-4 ml-0.5 align-middle bg-[var(--mode-a-accent)]"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                  />
                )}
              </p>
              {commentDone && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <motion.button
                    type="button"
                    onClick={onCollectQuote}
                    className="text-xs px-2 py-1 rounded border border-[var(--mode-a-text-muted)] text-[var(--mode-a-text-muted)]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    收藏点评
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {commentDone && showPublishOffer && onPublish && onSkipPublish && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 p-4"
          style={{
            background: "var(--mode-a-accent-soft)",
            borderColor: "var(--mode-a-accent)",
            boxShadow: "0 0 24px rgba(110,231,183,0.12)",
          }}
        >
          <p className="text-[var(--mode-a-accent)] font-medium mb-3">诞总觉得这段不错，要不要放到诞说大赏？</p>
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={onPublish}
              className="px-4 py-2 rounded-xl font-medium bg-[var(--mode-a-accent)]/30 text-[var(--mode-a-accent)] border border-[var(--mode-a-accent)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              公开
            </motion.button>
            <motion.button
              type="button"
              onClick={onSkipPublish}
              className="px-4 py-2 rounded-xl font-medium border border-[var(--mode-a-text-muted)] text-[var(--mode-a-text-muted)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              不公开
            </motion.button>
          </div>
        </motion.div>
      )}

      {commentDone && (
        <>
          <div className="flex flex-wrap gap-2">
            <motion.button
              type="button"
              onClick={onGoReward}
              className="px-4 py-2 rounded-xl font-medium bg-[var(--mode-a-accent)]/20 text-[var(--mode-a-accent)] border border-[var(--mode-a-accent)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              领奖励
            </motion.button>
            <motion.button
              type="button"
              onClick={onRewrite}
              className="px-4 py-2 rounded-xl font-medium border border-[var(--mode-a-primary)] text-[var(--mode-a-text)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              就这题再写一次
            </motion.button>
          </div>

          {/* 听听别人怎么说 - 两人/三人始终显示，币不够时灰色+需 X 币 */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-[var(--mode-a-text-muted)] text-sm mb-2">听听别人怎么说</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <motion.button
                type="button"
                onClick={coins >= COST_TWO ? onTwoComments : undefined}
                disabled={loadingTwo || coins < COST_TWO}
                className="px-4 py-2.5 rounded-xl font-medium border text-sm disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: coins >= COST_TWO ? "var(--mode-a-primary-soft)" : "rgba(167,139,250,0.08)",
                  color: "var(--mode-a-text)",
                  borderColor: coins >= COST_TWO ? "var(--mode-a-primary)" : "var(--mode-a-text-muted)",
                }}
                whileHover={coins >= COST_TWO ? { scale: 1.02 } : {}}
                whileTap={coins >= COST_TWO ? { scale: 0.98 } : {}}
              >
                {loadingTwo ? "生成中…" : coins >= COST_TWO ? `另外两人点评（${COST_TWO} 币）` : `需 ${COST_TWO} 币`}
              </motion.button>
              <motion.button
                type="button"
                onClick={coins >= COST_TRIO ? onTrioDiscussion : undefined}
                disabled={loadingTrio || coins < COST_TRIO}
                className="px-4 py-2.5 rounded-xl font-medium border text-sm disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: coins >= COST_TRIO ? "var(--mode-a-primary-soft)" : "rgba(167,139,250,0.08)",
                  color: "var(--mode-a-text)",
                  borderColor: coins >= COST_TRIO ? "var(--mode-a-primary)" : "var(--mode-a-text-muted)",
                }}
                whileHover={coins >= COST_TRIO ? { scale: 1.02 } : {}}
                whileTap={coins >= COST_TRIO ? { scale: 0.98 } : {}}
              >
                {loadingTrio ? "生成中…" : coins >= COST_TRIO ? `三人讨论（${COST_TRIO} 币）` : `需 ${COST_TRIO} 币`}
              </motion.button>
            </div>
          </div>
        </>
      )}

      {twoComments && twoComments.length > 0 && (
        <div className="space-y-3">
          <p className="text-[var(--mode-a-text-muted)] text-sm">另外两人怎么说</p>
          <div className="grid gap-3">
            {twoComments.map((c) => (
              <div
                key={c.name}
                className="rounded-xl border border-[var(--mode-a-primary)]/50 p-3"
                style={{ background: "var(--mode-a-primary-soft)" }}
              >
                <p className="text-[var(--mode-a-primary)] text-xs mb-1">{c.name}</p>
                <p className="text-[var(--mode-a-text)] text-sm whitespace-pre-wrap">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {trioText && (
        <div className="rounded-xl border-2 border-[var(--mode-a-primary)]/50 p-4" style={{ background: "var(--mode-a-bg-card)" }}>
          <p className="text-[var(--mode-a-primary)] text-sm mb-2">三人讨论</p>
          <p className="text-[var(--mode-a-text)] text-sm leading-relaxed whitespace-pre-wrap">
            {trioText}
          </p>
        </div>
      )}
    </motion.div>
  );
}
