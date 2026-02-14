import { HIDDEN_TOPICS } from "./exploration";

// 开放麦训练营 - 今日话题与角度选项
// #33 核心游戏循环 - 选题→角度→创作→演出→点评→奖励

export const TOPICS = [
  "地铁奇葩事",
  "上班摸鱼的一百种理由",
  "和爸妈的代沟",
  "第一次租房踩的坑",
  "当代年轻人的睡眠",
  "外卖员给我上了一课",
  "养宠物后的变化",
  "相亲现场实录",
] as const;

/** 未解锁的隐藏话题数量（用于首页「??? 待解锁」） */
export function getLockedHiddenTopicCount(unlockedHiddenTopics: string[]): number {
  return HIDDEN_TOPICS.filter((t) => !unlockedHiddenTopics.includes(t)).length;
}

export const ANGLE_OPTIONS = [
  { id: "normal", label: "正常观察", desc: "如实记录，像写日记" },
  { id: "absurd", label: "荒诞解读", desc: "往离谱了想，越荒诞越好" },
  { id: "edge", label: "攻击性角度", desc: "带点冒犯，但要聪明" },
] as const;

/** 高级话题：需花 3 币解锁（永久） */
export const ADVANCED_TOPICS = ["相亲现场实录", "和爸妈的代沟"] as const;
export const ADVANCED_TOPIC_COST = 3;

export function isAdvancedTopic(topic: string): boolean {
  return (ADVANCED_TOPICS as readonly string[]).includes(topic);
}

/** 当前可选话题池（含已解锁的隐藏话题） */
export function getTopicPool(unlockedHiddenTopics: string[]): string[] {
  const hidden = (HIDDEN_TOPICS as readonly string[]).filter((t) =>
    unlockedHiddenTopics.includes(t)
  );
  return [...TOPICS, ...hidden];
}

/** 随机取一个今日话题（从当前话题池，可能抽到高级或隐藏） */
export function getTodayTopic(unlockedHiddenTopics: string[] = []): string {
  const pool = getTopicPool(unlockedHiddenTopics);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** 只从免费话题里随机一个，不花币也能写、赚币（不含高级，含已解锁隐藏） */
export function getRandomFreeTopic(unlockedHiddenTopics: string[] = []): string {
  const pool = getTopicPool(unlockedHiddenTopics).filter(
    (t) => !(ADVANCED_TOPICS as readonly string[]).includes(t)
  );
  return pool[Math.floor(Math.random() * pool.length)];
}
