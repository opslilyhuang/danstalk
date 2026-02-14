import { useState, useEffect } from "react";

/**
 * 逐字显示文案，用于电台回复的「打字机」效果
 */
export function useTypewriter(
  fullText: string,
  options: { speedMs?: number; enabled?: boolean } = {}
): string {
  const { speedMs = 40, enabled = true } = options;
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!enabled || !fullText) {
      setDisplay(fullText);
      return;
    }
    setDisplay("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplay(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [fullText, enabled, speedMs]);

  return display;
}
