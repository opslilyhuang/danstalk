// 开放麦奖励规则：按字数，避免随便写一个字就拿币

export const MIN_SCRIPT_LENGTH = 30;

/** 根据段子字数计算本局毒硬币和经验；不足 MIN 则 0 */
export function getCoinsAndExpForScript(scriptLength: number): { coins: number; exp: number } {
  const len = scriptLength;
  if (len < MIN_SCRIPT_LENGTH) return { coins: 0, exp: 0 };
  if (len < 100) return { coins: 1, exp: 2 };
  if (len < 200) return { coins: 2, exp: 4 };
  if (len < 300) return { coins: 3, exp: 6 };
  if (len < 400) return { coins: 4, exp: 8 };
  return { coins: 5, exp: 10 };
}
