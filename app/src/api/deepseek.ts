// DeepSeek API 流式调用 - 用于电台回复与训练营点评

const BASE = import.meta.env.VITE_DEEPSEEK_BASE_URL ?? "https://api.deepseek.com/v1";
const MODEL_RADIO = import.meta.env.VITE_DEEPSEEK_MODEL_RADIO ?? "deepseek-chat";

function getApiKey(): string {
  const key = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!key || key.startsWith("sk-你的")) {
    throw new Error("请配置 VITE_DEEPSEEK_API_KEY（复制 .env.example 为 .env 并填入）");
  }
  return key;
}

export interface StreamCallbacks {
  onChunk?: (text: string) => void;
  onDone?: (fullText: string) => void;
  onError?: (err: Error) => void;
}

export async function streamRadioReply(
  userContent: string,
  callbacks: StreamCallbacks
): Promise<void> {
  const [systemPrompt, { getRadioVariation, getRadioOpener, getRadioCloser }] = await Promise.all([
    import("../config/prompts").then((m) => m.DAN_RADIO_PROMPT),
    import("../config/promptVariations").then((m) => m),
  ]);
  const apiKey = getApiKey();
  const variation = getRadioVariation();
  const openerHint = getRadioOpener();
  const closerHint = getRadioCloser();

  const body = {
    model: MODEL_RADIO,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `以下是一封听众来信，请用李诞深夜电台的口吻回复（控制在150字以内，留白）。\n【要求】${variation}\n【开场可参考风格】${openerHint}\n【结尾可参考风格】${closerHint}\n\n来信内容：\n${userContent}`,
      },
    ],
    stream: true,
  };

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = new Error(`DeepSeek API ${res.status}: ${await res.text()}`);
    callbacks.onError?.(err);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    callbacks.onError?.(new Error("No response body"));
    return;
  }

  const decoder = new TextDecoder();
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
      for (const line of lines) {
        if (line === "data: [DONE]") continue;
        try {
          const json = JSON.parse(line.slice(6)) as { choices?: { 0?: { delta?: { content?: string } } } };
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            callbacks.onChunk?.(content);
          }
        } catch {
          // ignore parse errors for partial chunks
        }
      }
    }
    callbacks.onDone?.(fullText);
  } catch (e) {
    callbacks.onError?.(e instanceof Error ? e : new Error(String(e)));
  }
}

/** 随便聊聊 - 多轮对话，流式回复 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function streamChatReply(
  messages: ChatMessage[],
  callbacks: StreamCallbacks
): Promise<void> {
  const systemPrompt = (await import("../config/prompts")).DAN_CHAT_PROMPT;
  const apiKey = getApiKey();

  const apiMessages: { role: string; content: string }[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL_RADIO,
      messages: apiMessages,
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = new Error(`DeepSeek API ${res.status}: ${await res.text()}`);
    callbacks.onError?.(err);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    callbacks.onError?.(new Error("No response body"));
    return;
  }

  const decoder = new TextDecoder();
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
      for (const line of lines) {
        if (line === "data: [DONE]") continue;
        try {
          const json = JSON.parse(line.slice(6)) as { choices?: { 0?: { delta?: { content?: string } } } };
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            callbacks.onChunk?.(content);
          }
        } catch {
          /* partial chunk */
        }
      }
    }
    callbacks.onDone?.(fullText);
  } catch (e) {
    callbacks.onError?.(e instanceof Error ? e : new Error(String(e)));
  }
}

/** 深夜电台 - 花 1 币「多说一点」：在已有回复基础上再补充一段（每封信仅可点一次） */
export async function streamRadioReplyMore(
  userContent: string,
  previousReply: string,
  callbacks: StreamCallbacks
): Promise<void> {
  const systemPrompt = (await import("../config/prompts")).DAN_RADIO_PROMPT;
  const apiKey = getApiKey();

  const body = {
    model: MODEL_RADIO,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `你刚才在深夜电台里回复了这位听众，他/她想听你再多说一点。请在同一风格下再补充一段（可展开、举例或换角度），控制在 100 字以内，不要重复之前说的。\n\n你之前的回复：\n${previousReply}\n\n来信内容：\n${userContent}`,
      },
    ],
    stream: true,
  };

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = new Error(`DeepSeek API ${res.status}: ${await res.text()}`);
    callbacks.onError?.(err);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    callbacks.onError?.(new Error("No response body"));
    return;
  }

  const decoder = new TextDecoder();
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
      for (const line of lines) {
        if (line === "data: [DONE]") continue;
        try {
          const json = JSON.parse(line.slice(6)) as { choices?: { 0?: { delta?: { content?: string } } } };
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            callbacks.onChunk?.(content);
          }
        } catch {
          /* ignore */
        }
      }
    }
    callbacks.onDone?.(fullText);
  } catch (e) {
    callbacks.onError?.(e instanceof Error ? e : new Error(String(e)));
  }
}

const MODEL_TRAINING = import.meta.env.VITE_DEEPSEEK_MODEL_TRAINING ?? "deepseek-chat";

/** 诞说大赏 - 判断诞总点评是否属于「特别不错、可公开推荐」 */
/** 放宽判定：只要不是纯批评、有肯定或明显进步认可，就倾向 YES，让用户更容易触发大赏 */
export async function fetchIsRecommendable(danComment: string): Promise<boolean> {
  const apiKey = getApiKey();
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL_TRAINING,
      messages: [
        {
          role: "user",
          content: `以下是对学员段子的点评。请判断：诞总是否对这段子有「肯定」或「值得公开展示」的意思？
肯定包括：明确夸（有饭吃了、能商演、这活儿能接、不错、挺好、有进步、能用了、可以上了、这段能留、开放麦能上、底不错、角度有了、前提够毒 等）；或者「改完能上」「再磨磨就行」等带认可的。
若点评里只有批评、只让再改、没有任何肯定或阶段认可，则算 NO。
若有一句肯定、或「比上次强」「有进步」「这段能留」等，倾向 YES。只回复 YES 或 NO。\n\n点评：\n${danComment}`,
        },
      ],
      stream: false,
    }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = (data.choices?.[0]?.message?.content ?? "").trim().toUpperCase();
  return text.startsWith("YES");
}

/** 训练营 - 求灵感：只给一句话角度，不写段子 */
export async function fetchTrainingHint(
  topic: string,
  angle: string
): Promise<string> {
  const systemPrompt = (await import("../config/prompts")).DAN_TRAINING_PROMPT;
  const apiKey = getApiKey();

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL_TRAINING,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `话题是「${topic}」，角度是「${angle}」。只给一句灵感或前提提示，不要写完整段子，一句话就行。`,
        },
      ],
      stream: false,
    }),
  });

  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = (await res.json()) as { choices?: { 0?: { message?: { content?: string } } } };
  const text = data.choices?.[0]?.message?.content?.trim();
  return text ?? "随便写，写啥都行。";
}

/** 多轮：上一轮学员段子 + 诞总点评，用于衔接本轮点评 */
export interface TrainingRound {
  script: string;
  comment: string;
}

/** 训练营：诞总毒舌点评段子（流式）。支持多轮：传入 roundHistory 时本轮点评要衔接、有情景感。 */
export async function streamTrainingFeedback(
  script: string,
  topic: string,
  angle: string,
  callbacks: StreamCallbacks,
  options?: { roundHistory?: TrainingRound[] }
): Promise<void> {
  const systemPrompt = (await import("../config/prompts")).DAN_TRAINING_PROMPT;
  const apiKey = getApiKey();

  const { getTrainingVariation, getDanOpener, getDanCloser } = await import("../config/promptVariations");
  const variation = getTrainingVariation();
  const openerHint = getDanOpener();
  const closerHint = getDanCloser();

  const hasHistory = options?.roundHistory && options.roundHistory.length > 0;
  let userContent: string;

  if (hasHistory) {
    const historyBlock = options!.roundHistory!
      .map(
        (r, i) =>
          `【第${i + 1}轮】学员段子：\n${r.script}\n\n你当时的点评：\n${r.comment}`
      )
      .join("\n\n---\n\n");
    userContent = `【同主题多轮改进】话题：${topic}，角度：${angle}。

${historyBlock}

【本轮】学员交的段子（在上一轮基础上改过）：\n\n${script}

请结合上一轮（及之前）的点评给出本轮点评：
- 要有衔接、有情景感，像在接着上次说（例如「上次我说你xxx，这次你…」「改了点yyy，但zzz还是…」）；
- 不要重复说同样的点，如果已经改进了要指出来；如果没改到点上要明确指出；
- 只指一个最大问题+给方向+毒鸡汤结尾，不要直接重写；
- 语气仍是李诞，自然延续。
【要求】${variation}
【开场可参考风格】${openerHint}
【结尾可参考风格】${closerHint}`;
  } else {
    userContent = `话题：${topic}，角度：${angle}。学员交的段子：\n\n${script}\n\n请按你的点评原则给出一段点评（只指一个最大问题+给方向+毒鸡汤结尾），不要直接重写。\n【要求】${variation}\n【开场可参考风格】${openerHint}\n【结尾可参考风格】${closerHint}`;
  }

  const body = {
    model: MODEL_TRAINING,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    stream: true,
  };

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = new Error(`DeepSeek API ${res.status}: ${await res.text()}`);
    callbacks.onError?.(err);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    callbacks.onError?.(new Error("No response body"));
    return;
  }

  const decoder = new TextDecoder();
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
      for (const line of lines) {
        if (line === "data: [DONE]") continue;
        try {
          const json = JSON.parse(line.slice(6)) as { choices?: { 0?: { delta?: { content?: string } } } };
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            callbacks.onChunk?.(content);
          }
        } catch {
          /* partial chunk */
        }
      }
    }
    callbacks.onDone?.(fullText);
  } catch (e) {
    callbacks.onError?.(e instanceof Error ? e : new Error(String(e)));
  }
}

/** 开放麦 - 另外两人点评（2 币），带情景感；sceneHint 随机注入避免每次模版一样 */
export async function fetchTwoComments(
  script: string,
  topic: string,
  personA: { name: string; prompt: string },
  personB: { name: string; prompt: string },
  sceneHint?: string
): Promise<{ name: string; comment: string }[]> {
  const apiKey = getApiKey();
  const hintLine = sceneHint ? `\n【本次要求】${sceneHint}` : "";
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL_TRAINING,
      messages: [
        {
          role: "system",
          content: `严格按格式输出：\n【${personA.name}】\n（一两句点评）\n【${personB.name}】\n（一两句点评）`,
        },
        {
          role: "user",
          content: `场景：开放麦台下，${personA.name}和${personB.name}刚听完这段，交头接耳各说了一两句。话题：${topic}。学员段子：\n\n${script}\n\n${personA.name}人设：${personA.prompt}\n${personB.name}人设：${personB.prompt}\n请严格按格式输出两人的点评（每人一两句，像在台下小声说的）：\n【${personA.name}】\n…\n【${personB.name}】\n…${hintLine}`,
        },
      ],
      stream: false,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = (await res.json()) as { choices?: { 0?: { message?: { content?: string } } } };
  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  const aMatch = text.match(new RegExp(`【${personA.name}】\\s*([\\s\\S]*?)(?=【${personB.name}】|$)`, "i"));
  const bMatch = text.match(new RegExp(`【${personB.name}】\\s*([\\s\\S]*?)(?=【|$)`, "i"));
  return [
    { name: personA.name, comment: (aMatch?.[1] ?? "").trim() || "嗯，有点意思。" },
    { name: personB.name, comment: (bMatch?.[1] ?? "").trim() || "再磨磨。" },
  ];
}

/** 开放麦 - 三人讨论（5 币）：李诞+两人围观点评；sceneHint 随机注入避免每次模版一样 */
export async function fetchTrioDiscussion(
  script: string,
  topic: string,
  personA: { name: string; prompt: string },
  personB: { name: string; prompt: string },
  sceneHint?: string
): Promise<string> {
  const apiKey = getApiKey();
  const danPrompt = (await import("../config/prompts")).DAN_TRAINING_PROMPT;
  const hintLine = sceneHint ? `\n【本次要求】${sceneHint}` : "";
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL_TRAINING,
      messages: [
        {
          role: "system",
          content: `你写一段三人围观点评的对话。场景：李诞、${personA.name}、${personB.name}在台下刚听完学员的段子，像在聊刚才那哥们儿写得咋样，有赞同有抬杠有接梗。格式必须每行一个人名+冒号+内容，例如：\n李诞：…\n${personA.name}：…\n${personB.name}：…\n轮流发言至少 3 轮，有来有回，不要各说各的。李诞人设：${danPrompt.slice(0, 220)}… ${personA.name}：${personA.prompt} ${personB.name}：${personB.prompt}`,
        },
        {
          role: "user",
          content: `话题：${topic}。学员段子：\n\n${script}\n\n请输出三人围观点评的对话（300字内），要像真在讨论，有反应、有接话。${hintLine}`,
        },
      ],
      stream: false,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = (await res.json()) as { choices?: { 0?: { message?: { content?: string } } } };
  return data.choices?.[0]?.message?.content?.trim() ?? "害，今儿喝多了，改天再聊。";
}
