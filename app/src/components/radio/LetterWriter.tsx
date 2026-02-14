// Mode B 写信 - 羊皮纸风格、300 字限制、手写体光标
// #91 别让我思考 - 单一任务、明确字数
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const MAX_LENGTH = 300;

interface Props {
  onSubmit: (content: string) => void | Promise<void>;
}

export default function LetterWriter({ onSubmit }: Props) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    void onSubmit(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div
        className="rounded-2xl p-6 md:p-8 min-h-[320px] border-2 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #2d2318 0%, #1a1510 100%)",
          borderColor: "#8B7355",
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.2)",
        }}
      >
        <p className="text-[var(--mode-b-text-muted)] text-sm mb-3 font-hand text-lg">
          写给诞总的信（{content.length}/{MAX_LENGTH}）
        </p>
        <textarea
          ref={textareaRef}
          className="font-hand w-full min-h-[200px] resize-none bg-transparent text-[var(--mode-b-text)] placeholder-[var(--mode-b-text-muted)]/60 text-lg leading-relaxed focus:outline-none caret-amber-200"
          placeholder="说说你最近的烦恼、迷茫，或只是想聊两句…"
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
          maxLength={MAX_LENGTH}
          style={{ caretColor: "var(--mode-b-primary)" }}
        />
        <div className="flex justify-end mt-4">
          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-6 py-2 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--mode-b-primary)",
              color: "var(--mode-b-bg)",
            }}
            whileHover={{ scale: content.trim() ? 1.05 : 1 }}
            whileTap={{ scale: content.trim() ? 0.95 : 1 }}
          >
            投递
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
