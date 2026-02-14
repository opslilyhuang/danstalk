// 诞说无妨 - 全局类型

export type UserLevel = "rookie" | "openmic" | "special" | "poison";

export interface Quote {
  id: string;
  text: string;
  sourceLetterId?: string;
  collectedAt: number;
}

export interface Letter {
  id: string;
  content: string;
  status: "pending" | "read" | "replied";
  reply?: string;
  /** 用户花 1 币「多说一点」后的追加内容，每封信最多一次 */
  extendedReply?: string;
  audioUrl?: string;
  createdAt: number;
}

/** 诞说大赏 - 用户公开的优质段子 */
export interface PublishedSegment {
  id: string;
  script: string;
  topic: string;
  danCommentSnippet: string;
  createdAt: number;
}

export interface GameState {
  user: {
    level: UserLevel;
    exp: number;
    coins: number;
    badges: string[];
    collectedQuotes: Quote[];
    unlockedTopics: string[];
  };
  letters: Letter[];
  publishedSegments: PublishedSegment[];
  /** 成就解锁记录 */
  achievements: AchievementRecord[];
  /** 已解锁的隐藏话题 */
  unlockedHiddenTopics: string[];
  /** 上次完成训练营的日期 YYYY-MM-DD，用于连续写段子 */
  lastTrainingDay: string;
  /** 连续写段子天数 */
  trainingStreak: number;
  /** 累计完成训练营次数（领奖励次数） */
  completedTrainingCount: number;
  currentMode: "training" | "radio";
}

/** 段位经验阈值：素人0 开放麦50 专场150 毒瘤300 */
export const LEVEL_EXP = [0, 50, 150, 300] as const;

/** 成就 */
export interface AchievementRecord {
  id: string;
  unlockedAt: number;
}

export interface GameStore extends GameState {
  addLetter: (content: string) => string;
  setLetterReply: (id: string, reply: string) => void;
  setLetterExtendedReply: (id: string, text: string) => void;
  setLetterStatus: (id: string, status: Letter["status"]) => void;
  addCoins: (n: number) => void;
  spendCoins: (n: number) => boolean;
  collectQuote: (quote: Quote) => void;
  removeQuote: (id: string) => void;
  removeLetter: (id: string) => void;
  unlockTopic: (topic: string) => void;
  addExp: (n: number) => void;
  setCurrentMode: (mode: "training" | "radio") => void;
  publishSegment: (segment: Omit<PublishedSegment, "id" | "createdAt">) => void;
  /** 完成一次训练营（领奖励时调用），更新连续天数并检查成就 */
  recordTrainingComplete: () => void;
  unlockAchievement: (id: string) => boolean;
  unlockHiddenTopic: (topic: string) => void;
  toast: string | null;
  setToast: (message: string | null) => void;
}
