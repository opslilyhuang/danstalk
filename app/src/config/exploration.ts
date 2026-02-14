// 探索感配置：隐藏话题、诞总心情、观众反应、电台开场、成就

/** 隐藏话题 - 达成成就后解锁，不事先展示具体内容 */
export const HIDDEN_TOPICS = [
  "诞总年轻时干的蠢事",
  "如果脱口秀说真话",
  "台下观众比台上好笑",
] as const;

/** 成就定义：id、名称、描述、解锁的隐藏话题（可选） */
export const ACHIEVEMENTS = [
  { id: "first_script", name: "开麦", desc: "完成第一段段子", hiddenTopic: undefined },
  { id: "quote_3", name: "金句收集", desc: "收藏 3 条诞总金句", hiddenTopic: undefined },
  { id: "openmic", name: "开放麦老炮", desc: "升到开放麦段位", hiddenTopic: "诞总年轻时干的蠢事" },
  { id: "showcase", name: "入选大赏", desc: "段子入选诞说大赏", hiddenTopic: undefined },
  { id: "streak_3", name: "连写三天", desc: "连续 3 天写段子", hiddenTopic: "如果脱口秀说真话" },
  { id: "special", name: "专场演员", desc: "升到专场段位", hiddenTopic: "台下观众比台上好笑" },
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number]["id"];

/** 诞总今日心情 - 按日期种子随机，每天一种 */
export const DAN_MOODS = [
  { id: "drunk", label: "今儿喝了", hint: "点评可能更毒" },
  { id: "sober", label: "今儿没喝", hint: "点评可能更正经" },
  { id: "happy", label: "心情不错", hint: "说不定有彩蛋" },
  { id: "tired", label: "有点累", hint: "话可能不多" },
  { id: "mystery", label: "不好说", hint: "你猜" },
] as const;

/** 观众反应类型 - 台上演出后随机一种 */
export const AUDIENCE_REACTIONS = [
  { id: "applause", label: "掌声", subtitle: "掌声响起，诞总准备点评…", emoji: "👏" },
  { id: "laugh", label: "哄笑", subtitle: "台下笑成一片，诞总在边上记笔记…", emoji: "😂" },
  { id: "encore", label: "再来一个", subtitle: "有人喊再来一个！诞总摆摆手：先评完再说。", emoji: "🙌" },
  { id: "silence", label: "冷场", subtitle: "安静了两秒…然后掌声才起来。诞总：行，有张力。", emoji: "😶" },
  { id: "mixed", label: "嘘声与掌声", subtitle: "有人嘘有人鼓掌，诞总：有争议就对了。", emoji: "🎭" },
] as const;

/** 电台回复前 - 诞总状态随机一句 */
export const RADIO_OPENINGS = [
  "（诞总放下酒杯）",
  "（诞总看了眼信）",
  "（深夜，诞总打开你的信）",
  "（诞总今晚话不多）",
  "（诞总想了想）",
];

/** 按日期得到当日诞总心情（同一天内一致） */
export function getDanMoodToday(): (typeof DAN_MOODS)[number] {
  const today = new Date().toDateString();
  const seed = today.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const i = seed % DAN_MOODS.length;
  return DAN_MOODS[i];
}

/** 随机观众反应（单次会话内一致可用 seed） */
export function getRandomAudienceReaction(): (typeof AUDIENCE_REACTIONS)[number] {
  const i = Math.floor(Math.random() * AUDIENCE_REACTIONS.length);
  return AUDIENCE_REACTIONS[i];
}

/** 随机电台开场 */
export function getRandomRadioOpening(): string {
  const i = Math.floor(Math.random() * RADIO_OPENINGS.length);
  return RADIO_OPENINGS[i];
}

/** 成就检测：根据当前状态返回应解锁的成就 id 列表（不含已解锁） */
export function getAchievementsToUnlock(state: {
  achievements: { id: string }[];
  user: { exp: number; level: string; collectedQuotes: { id: string }[] };
  publishedSegments: unknown[];
  trainingStreak: number;
  completedTrainingCount?: number;
}): string[] {
  const unlocked = new Set(state.achievements.map((a) => a.id));
  const toUnlock: string[] = [];
  if (!unlocked.has("first_script") && (state.completedTrainingCount ?? 0) >= 1)
    toUnlock.push("first_script");
  if (!unlocked.has("quote_3") && (state.user.collectedQuotes?.length ?? 0) >= 3)
    toUnlock.push("quote_3");
  if (!unlocked.has("openmic") && state.user.level === "openmic") toUnlock.push("openmic");
  if (!unlocked.has("showcase") && (state.publishedSegments?.length ?? 0) > 0)
    toUnlock.push("showcase");
  if (!unlocked.has("streak_3") && state.trainingStreak >= 3) toUnlock.push("streak_3");
  if (!unlocked.has("special") && state.user.level === "special") toUnlock.push("special");
  return toUnlock;
}
