// Mode A 开放麦训练营 - 选题→角度→创作→演出→点评→（另外两人/三人讨论/再写一次）→奖励
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  getTodayTopic,
  getRandomFreeTopic,
  ANGLE_OPTIONS,
  isAdvancedTopic,
  ADVANCED_TOPIC_COST,
} from "../config/topics";
import { getAchievementsToUnlock, ACHIEVEMENTS } from "../config/exploration";
import { getCoinsAndExpForScript } from "../config/coins";
import {
  getTwoRandomWithPrompts,
  getRandomSceneHintTwo,
  getRandomSceneHintTrio,
} from "../config/commentators";
import { useGameStore } from "../store/gameStore";

type AngleOption = (typeof ANGLE_OPTIONS)[number];
import {
  streamTrainingFeedback,
  fetchIsRecommendable,
  fetchTrainingHint,
  fetchTwoComments,
  fetchTrioDiscussion,
  type TrainingRound,
} from "../api/deepseek";
import SceneCard from "../components/training/SceneCard";
import AngleSelector from "../components/training/AngleSelector";
import WritingDesk from "../components/training/WritingDesk";
import Stage from "../components/training/Stage";
import CommentBarrage from "../components/training/CommentBarrage";
import type { TwoCommentItem } from "../components/training/CommentBarrage";
import RewardScreen from "../components/training/RewardScreen";

type Step = "topic" | "angle" | "write" | "stage" | "comment" | "reward";


export default function Training() {
  const navigate = useNavigate();
  const user = useGameStore((s) => s.user);
  const addCoins = useGameStore((s) => s.addCoins);
  const spendCoins = useGameStore((s) => s.spendCoins);
  const addExp = useGameStore((s) => s.addExp);
  const unlockTopic = useGameStore((s) => s.unlockTopic);
  const collectQuote = useGameStore((s) => s.collectQuote);
  const publishSegment = useGameStore((s) => s.publishSegment);
  const setToast = useGameStore((s) => s.setToast);
  const unlockedHiddenTopics = useGameStore((s) => s.unlockedHiddenTopics ?? []);
  const recordTrainingComplete = useGameStore((s) => s.recordTrainingComplete);
  const unlockAchievement = useGameStore((s) => s.unlockAchievement);
  const getState = useGameStore.getState;

  const [step, setStep] = useState<Step>("topic");
  const [recommendable, setRecommendable] = useState<boolean | null>(null);
  const [topic, setTopic] = useState(() => getTodayTopic(getState().unlockedHiddenTopics ?? []));
  const [angle, setAngle] = useState<AngleOption | null>(null);
  const [script, setScript] = useState("");
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [twoComments, setTwoComments] = useState<TwoCommentItem[] | null>(null);
  const [trioText, setTrioText] = useState<string | null>(null);
  const [loadingTwo, setLoadingTwo] = useState(false);
  const [loadingTrio, setLoadingTrio] = useState(false);
  /** 同主题多轮：上一轮(段子,点评)，用于本轮点评衔接 */
  const [roundHistory, setRoundHistory] = useState<TrainingRound[]>([]);

  const isLocked = isAdvancedTopic(topic) && !(user.unlockedTopics ?? []).includes(topic);
  const coins = user.coins ?? 0;

  const handleTopicNext = useCallback(() => setStep("angle"), []);

  const handleUnlockTopic = useCallback(() => {
    if (spendCoins(ADVANCED_TOPIC_COST)) {
      unlockTopic(topic);
    }
  }, [topic, spendCoins, unlockTopic]);

  const handleAngleSelect = useCallback((a: AngleOption) => {
    setAngle(a);
    setStep("write");
  }, []);

  const handleScriptSubmit = useCallback((s: string) => {
    setScript(s);
    setStep("stage");
  }, []);

  const handleStageFinish = useCallback(() => {
    setStep("comment");
    setComment("");
    setTwoComments(null);
    setTrioText(null);
    setCommentLoading(true);
    streamTrainingFeedback(script, topic, angle!.label, {
      onChunk: () => {},
      onDone: (full) => {
        setComment(full);
        setCommentLoading(false);
        fetchIsRecommendable(full).then((ok) => setRecommendable(ok)).catch(() => setRecommendable(false));
      },
      onError: () => {
        setComment("嗯…今儿喝多了，下回再评。写吧，反正也干不了别的。");
        setCommentLoading(false);
        setRecommendable(false);
      },
    }, { roundHistory: roundHistory.length > 0 ? roundHistory : undefined }).catch(() => {
      setComment("信号不好…写吧，反正也干不了别的。");
      setCommentLoading(false);
      setRecommendable(false);
    });
  }, [script, topic, angle, roundHistory]);

  const handleGoReward = useCallback(() => {
    const len = script.trim().length;
    const { coins: c, exp: e } = getCoinsAndExpForScript(len);
    if (c > 0) {
      addCoins(c);
      addExp(e);
    }
    recordTrainingComplete();
    const state = getState();
    const toUnlock = getAchievementsToUnlock(state);
    const newNames: string[] = [];
    toUnlock.forEach((id) => {
      if (unlockAchievement(id)) {
        const def = ACHIEVEMENTS.find((a) => a.id === id);
        if (def) newNames.push(def.name);
      }
    });
    if (newNames.length > 0) {
      setToast(`成就解锁：${newNames.join("、")}`);
    }
    setStep("reward");
  }, [script, addCoins, addExp, recordTrainingComplete, getState, unlockAchievement, setToast]);

  const handleTwoComments = useCallback(async () => {
    if (coins < 2 || loadingTwo) return;
    if (!spendCoins(2)) return;
    setLoadingTwo(true);
    setTwoComments(null);
    try {
      const [a, b] = getTwoRandomWithPrompts();
      const list = await fetchTwoComments(script, topic, a, b, getRandomSceneHintTwo());
      setTwoComments(list);
    } catch {
      setTwoComments([{ name: "?", comment: "信号不好…" }, { name: "?", comment: "改天再聊。" }]);
    } finally {
      setLoadingTwo(false);
    }
  }, [script, topic, coins, loadingTwo, spendCoins]);

  const handleTrioDiscussion = useCallback(async () => {
    if (coins < 5 || loadingTrio) return;
    if (!spendCoins(5)) return;
    setLoadingTrio(true);
    setTrioText(null);
    try {
      const [a, b] = getTwoRandomWithPrompts();
      const text = await fetchTrioDiscussion(script, topic, a, b, getRandomSceneHintTrio());
      setTrioText(text);
    } catch {
      setTrioText("害，今儿喝多了，改天再聊。");
    } finally {
      setLoadingTrio(false);
    }
  }, [script, topic, coins, loadingTrio, spendCoins]);

  const handleRewrite = useCallback(() => {
    if (script.trim() && comment) {
      setRoundHistory((prev) => [...prev, { script, comment }]);
    }
    setScript("");
    setComment("");
    setTwoComments(null);
    setTrioText(null);
    setCommentLoading(false);
    setRecommendable(null);
    setStep("write");
  }, [script, comment]);

  const handleCollectQuote = useCallback(() => {
    if (!comment) return;
    collectQuote({
      id: crypto.randomUUID(),
      text: comment,
      collectedAt: Date.now(),
    });
    const state = getState();
    const toUnlock = getAchievementsToUnlock(state);
    const newNames: string[] = [];
    toUnlock.forEach((id) => {
      if (unlockAchievement(id)) {
        const def = ACHIEVEMENTS.find((a) => a.id === id);
        if (def) newNames.push(def.name);
      }
    });
    if (newNames.length > 0) {
      setToast(`已收藏到背包 · 成就解锁：${newNames.join("、")}`);
    } else {
      setToast("已收藏到背包");
    }
  }, [comment, collectQuote, setToast, getState, unlockAchievement]);

  const handleAgain = useCallback(() => {
    setTopic(getTodayTopic(unlockedHiddenTopics));
    setAngle(null);
    setScript("");
    setComment("");
    setTwoComments(null);
    setTrioText(null);
    setCommentLoading(false);
    setRecommendable(null);
    setRoundHistory([]);
    setStep("topic");
  }, [unlockedHiddenTopics]);

  const handleExit = useCallback(() => navigate("/"), [navigate]);

  const handleRequestHint = useCallback(async () => {
    const text = await fetchTrainingHint(topic, angle!.label);
    return text;
  }, [topic, angle]);

  const handlePublishToShowcase = useCallback(() => {
    publishSegment({
      script,
      topic,
      danCommentSnippet: comment.length > 120 ? comment.slice(0, 120) + "…" : comment,
    });
    setRecommendable(false);
    const state = getState();
    const toUnlock = getAchievementsToUnlock(state);
    const newNames: string[] = [];
    toUnlock.forEach((id) => {
      if (unlockAchievement(id)) {
        const def = ACHIEVEMENTS.find((a) => a.id === id);
        if (def) newNames.push(def.name);
      }
    });
    if (newNames.length > 0) {
      setToast(`已入选诞说大赏 · 成就解锁：${newNames.join("、")}`);
    } else {
      setToast("已入选诞说大赏");
    }
  }, [script, topic, comment, publishSegment, setToast, getState, unlockAchievement]);

  const handleSwapTopic = useCallback(() => {
    setTopic(getRandomFreeTopic(unlockedHiddenTopics));
  }, [unlockedHiddenTopics]);

  return (
    <div className="flex-1 flex flex-col items-center py-6">
      <AnimatePresence mode="wait">
        {step === "topic" && (
          <SceneCard
            key="topic"
            topic={topic}
            isLocked={isLocked}
            coins={coins}
            unlockCost={ADVANCED_TOPIC_COST}
            onUnlock={handleUnlockTopic}
            onNext={handleTopicNext}
            onSwapTopic={handleSwapTopic}
          />
        )}
        {step === "angle" && (
          <AngleSelector
            key="angle"
            options={ANGLE_OPTIONS}
            onSelect={handleAngleSelect}
          />
        )}
        {step === "write" && angle && (
          <WritingDesk
            key="write"
            topic={topic}
            angleLabel={angle.label}
            onSubmit={handleScriptSubmit}
            onRequestHint={handleRequestHint}
          />
        )}
        {step === "stage" && (
          <Stage key="stage" script={script} onFinish={handleStageFinish} />
        )}
        {step === "comment" && (
          <CommentBarrage
            key="comment"
            script={script}
            comment={comment}
            isLoading={commentLoading}
            coins={coins}
            onGoReward={handleGoReward}
            onTwoComments={handleTwoComments}
            onTrioDiscussion={handleTrioDiscussion}
            onRewrite={handleRewrite}
            onCollectQuote={handleCollectQuote}
            twoComments={twoComments}
            trioText={trioText}
            loadingTwo={loadingTwo}
            loadingTrio={loadingTrio}
            showPublishOffer={recommendable === true}
            onPublish={handlePublishToShowcase}
            onSkipPublish={() => setRecommendable(false)}
          />
        )}
        {step === "reward" && (
          <RewardScreen
            key="reward"
            scriptLength={script.trim().length}
            coinsEarned={getCoinsAndExpForScript(script.trim().length).coins}
            onAgain={handleAgain}
            onExit={handleExit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
