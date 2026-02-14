// #60 以用户为中心的设计 - 状态结构围绕用户与信件
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameStore, Letter, PublishedSegment, Quote, UserLevel } from "../types";
import { ACHIEVEMENTS } from "../config/exploration";

const initialUser = {
  level: "rookie" as UserLevel,
  exp: 0,
  coins: 0,
  badges: [] as string[],
  collectedQuotes: [] as Quote[],
  unlockedTopics: [] as string[],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      user: initialUser,
      letters: [],
      publishedSegments: [],
      achievements: [],
      unlockedHiddenTopics: [],
      lastTrainingDay: "",
      trainingStreak: 0,
      completedTrainingCount: 0,
      currentMode: "radio",

      addLetter: (content: string) => {
        const letter: Letter = {
          id: crypto.randomUUID(),
          content,
          status: "pending",
          createdAt: Date.now(),
        };
        set((s) => ({ letters: [letter, ...s.letters] }));
        return letter.id;
      },

      setLetterReply: (id: string, reply: string) => {
        set((s) => ({
          letters: s.letters.map((l) =>
            l.id === id ? { ...l, status: "replied" as const, reply } : l
          ),
        }));
      },

      setLetterExtendedReply: (id: string, text: string) => {
        set((s) => ({
          letters: s.letters.map((l) =>
            l.id === id ? { ...l, extendedReply: text } : l
          ),
        }));
      },

      setLetterStatus: (id: string, status: Letter["status"]) => {
        set((s) => ({
          letters: s.letters.map((l) =>
            l.id === id ? { ...l, status } : l
          ),
        }));
      },

      addCoins: (n: number) => {
        set((s) => ({ user: { ...s.user, coins: s.user.coins + n } }));
      },

      spendCoins: (n: number) => {
        let ok = false;
        set((s) => {
          if (s.user.coins < n) return s;
          ok = true;
          return { user: { ...s.user, coins: s.user.coins - n } };
        });
        return ok;
      },

      unlockTopic: (topic: string) => {
        set((s) => ({
          user: {
            ...s.user,
            unlockedTopics: (s.user.unlockedTopics ?? []).includes(topic)
              ? (s.user.unlockedTopics ?? [])
              : [...(s.user.unlockedTopics ?? []), topic],
          },
        }));
      },

      addExp: (n: number) => {
        set((s) => {
          const nextExp = (s.user.exp ?? 0) + n;
          let level = s.user.level;
          if (nextExp >= 300) level = "poison";
          else if (nextExp >= 150) level = "special";
          else if (nextExp >= 50) level = "openmic";
          return {
            user: { ...s.user, exp: nextExp, level },
          };
        });
      },

      collectQuote: (quote: Quote) => {
        set((s) => ({
          user: {
            ...s.user,
            collectedQuotes: [...s.user.collectedQuotes, quote],
          },
        }));
      },

      removeQuote: (id: string) => {
        set((s) => ({
          user: {
            ...s.user,
            collectedQuotes: s.user.collectedQuotes.filter((q) => q.id !== id),
          },
        }));
      },

      removeLetter: (id: string) => {
        set((s) => ({ letters: s.letters.filter((l) => l.id !== id) }));
      },

      setCurrentMode: (mode: "training" | "radio") => {
        set({ currentMode: mode });
      },

      publishSegment: (segment: Omit<PublishedSegment, "id" | "createdAt">) => {
        const item: PublishedSegment = {
          ...segment,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        set((s) => ({ publishedSegments: [item, ...s.publishedSegments] }));
      },

      recordTrainingComplete: () => {
        const today = new Date().toISOString().slice(0, 10);
        set((s) => {
          const last = s.lastTrainingDay || "";
          let streak = s.trainingStreak;
          const count = (s.completedTrainingCount ?? 0) + 1;
          if (last === today) {
            return { completedTrainingCount: count };
          }
          const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
          if (last === yesterday) streak += 1;
          else streak = 1;
          return {
            lastTrainingDay: today,
            trainingStreak: streak,
            completedTrainingCount: count,
          };
        });
      },

      unlockAchievement: (id: string) => {
        let isNew = false;
        set((s) => {
          if (s.achievements.some((a) => a.id === id)) return s;
          isNew = true;
          const def = ACHIEVEMENTS.find((a) => a.id === id);
          const next: {
            achievements: AchievementRecord[];
            unlockedHiddenTopics?: string[];
          } = {
            achievements: [...s.achievements, { id, unlockedAt: Date.now() }],
          };
          if (def?.hiddenTopic) {
            next.unlockedHiddenTopics = [
              ...s.unlockedHiddenTopics,
              def.hiddenTopic,
            ];
          }
          return { ...s, ...next };
        });
        return isNew;
      },

      unlockHiddenTopic: (topic: string) => {
        set((s) => ({
          unlockedHiddenTopics: s.unlockedHiddenTopics.includes(topic)
            ? s.unlockedHiddenTopics
            : [...s.unlockedHiddenTopics, topic],
        }));
      },

      toast: null as string | null,
      setToast: (message: string | null) => {
        set({ toast: message });
      },
    }),
    {
      name: "dans-world-storage",
      partialize: (s) => ({
        user: s.user,
        letters: s.letters,
        publishedSegments: s.publishedSegments,
        achievements: s.achievements,
        unlockedHiddenTopics: s.unlockedHiddenTopics,
        lastTrainingDay: s.lastTrainingDay,
        trainingStreak: s.trainingStreak,
        completedTrainingCount: s.completedTrainingCount,
        currentMode: s.currentMode,
      }),
      migrate: (state: unknown) => {
        const s = state as {
          user?: { exp?: number; unlockedTopics?: string[] };
          letters?: unknown;
          currentMode?: string;
          achievements?: unknown[];
          unlockedHiddenTopics?: string[];
          lastTrainingDay?: string;
          trainingStreak?: number;
        };
        const needMigrate =
          s?.user && (s.user.exp === undefined || s.user.unlockedTopics === undefined);
        const needExploration =
          s?.achievements === undefined ||
          s?.unlockedHiddenTopics === undefined ||
          s?.lastTrainingDay === undefined ||
          s?.trainingStreak === undefined ||
          (s as { completedTrainingCount?: number }).completedTrainingCount === undefined;
        if (needMigrate || needExploration) {
          return {
            ...s,
            user: s?.user
              ? {
                  ...s.user,
                  exp: s.user.exp ?? 0,
                  unlockedTopics: s.user.unlockedTopics ?? [],
                }
              : undefined,
            achievements: s?.achievements ?? [],
            unlockedHiddenTopics: s?.unlockedHiddenTopics ?? [],
            lastTrainingDay: s?.lastTrainingDay ?? "",
            trainingStreak: s?.trainingStreak ?? 0,
            completedTrainingCount: (s as { completedTrainingCount?: number }).completedTrainingCount ?? 0,
          };
        }
        return s;
      },
      version: 2,
    }
  )
);
