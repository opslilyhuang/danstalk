// 诞说大赏 - 用户公开的优质段子，卡片式展现
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import type { PublishedSegment } from "../types";

function SegmentCard({
  segment,
  featured,
  index,
}: {
  segment: PublishedSegment;
  featured: boolean;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const scriptPreview = segment.script.length > 80 && !expanded
    ? segment.script.slice(0, 80) + "…"
    : segment.script;

  const card = (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-2xl border-2 overflow-hidden ${
        featured
          ? "col-span-full md:col-span-full"
          : "col-span-full sm:col-span-1"
      }`}
      style={{
        background: featured
          ? "linear-gradient(135deg, var(--mode-a-accent-soft) 0%, var(--mode-a-bg-card) 50%)"
          : "var(--mode-a-bg-card)",
        borderColor: featured ? "var(--mode-a-accent)" : "rgba(167,139,250,0.35)",
        boxShadow: featured
          ? "0 0 40px rgba(110,231,183,0.12), 0 8px 32px rgba(0,0,0,0.25)"
          : "0 4px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(167,139,250,0.1)",
      }}
    >
      <div className="p-5 sm:p-6">
        <span
          className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium mb-3"
          style={{
            background: "var(--mode-a-primary-soft)",
            color: "var(--mode-a-primary)",
          }}
        >
          {segment.topic}
        </span>
        {featured && (
          <span
            className="ml-2 px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{
              background: "var(--mode-a-accent-soft)",
              color: "var(--mode-a-accent)",
            }}
          >
            精选
          </span>
        )}
        <div
          className="text-[var(--mode-a-text)] text-sm leading-relaxed whitespace-pre-wrap mb-4"
          style={{ minHeight: featured ? "auto" : "2.5em" }}
        >
          {scriptPreview}
          {segment.script.length > 80 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-[var(--mode-a-accent)] text-xs"
            >
              {expanded ? "收起" : "展开"}
            </button>
          )}
        </div>
        <div
          className="pt-3 border-t border-white/10"
          style={{ borderColor: "var(--mode-a-primary)" }}
        >
          <p className="text-[var(--mode-a-primary)] text-xs font-medium mb-1">诞总点评</p>
          <p className="text-[var(--mode-a-text-muted)] text-sm leading-relaxed">
            {segment.danCommentSnippet}
          </p>
        </div>
      </div>
    </motion.article>
  );

  return card;
}

export default function Showcase() {
  const segments = useGameStore((s) => s.publishedSegments ?? []);
  const featured = segments[0];
  const rest = featured
    ? segments.filter((s) => s.id !== featured.id)
    : segments;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1
          className="font-title text-2xl"
          style={{ color: "var(--mode-a-accent)" }}
        >
          诞说大赏
        </h1>
        <Link
          to="/"
          className="text-sm text-[var(--mode-a-text-muted)] hover:text-[var(--mode-a-accent)] transition-colors"
        >
          回首页
        </Link>
      </div>

      <p className="text-[var(--mode-a-text-muted)] text-sm mb-8">
        诞总觉得特别不错的段子，经作者同意后在此展示。
      </p>

      <AnimatePresence mode="wait">
        {segments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border-2 border-dashed border-[var(--mode-a-primary)]/30 p-12 text-center"
            style={{ background: "var(--mode-a-primary-soft)" }}
          >
            <p className="text-[var(--mode-a-text-muted)] mb-2">暂无入选段子</p>
            <p className="text-sm text-[var(--mode-a-text-muted)]">
              在开放麦写完段子后，若诞总评价特别不错，会提示你是否公开到这里。
            </p>
            <Link
              to="/training"
              className="inline-block mt-4 px-4 py-2 rounded-xl font-medium border border-[var(--mode-a-accent)] text-[var(--mode-a-accent)]"
            >
              去写段子
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featured && (
              <SegmentCard
                key={featured.id}
                segment={featured}
                featured
                index={0}
              />
            )}
            {rest.map((seg, i) => (
              <SegmentCard
                key={seg.id}
                segment={seg}
                featured={false}
                index={i + 1}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
