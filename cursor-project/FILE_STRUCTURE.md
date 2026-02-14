# 诞说无妨 - 建议文件结构树

供 Cursor 开发时参考，按开发顺序逐步创建。

```
dans-world/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .env                    # 从 .env.example 复制并填入 key
├── .env.example
├── .gitignore
├── public/
│   ├── assets/
│   │   └── dan-avatar.png      # 占位：像素风头像
│   ├── audio/
│   │   ├── applause.mp3
│   │   ├── boo.mp3
│   │   ├── paper-tear.mp3
│   │   └── wine-pour.mp3
│   └── fonts/
│       └── ZCOOLKuaiLe-Regular.ttf
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css              # Tailwind + 全局变量（颜色/字体）
│   ├── config/
│   │   ├── prompts.ts         # DAN_TRAINING_PROMPT / DAN_RADIO_PROMPT
│   │   └── constants.ts       # 颜色、段位等常量
│   ├── store/
│   │   └── gameStore.ts       # Zustand: GameState
│   ├── api/
│   │   └── deepseek.ts        # 流式调用 DeepSeek
│   ├── types/
│   │   └── index.ts           # GameState, Quote, Letter 等
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopBar.tsx
│   │   │   ├── Dock.tsx
│   │   │   └── Layout.tsx
│   │   ├── home/
│   │   │   └── HomePage.tsx    # 双门 + 像素头像
│   │   ├── radio/             # Mode B
│   │   │   ├── RadioSet.tsx
│   │   │   ├── LetterWriter.tsx
│   │   │   ├── EnvelopeAnimation.tsx
│   │   │   ├── AudioVisualizer.tsx
│   │   │   ├── QuoteCard.tsx
│   │   │   └── ArchiveShelf.tsx
│   │   └── training/          # Mode A（后期）
│   │       ├── SceneCard3D.tsx
│   │       ├── AngleSelector.tsx
│   │       ├── WritingDesk.tsx
│   │       ├── Stage.tsx
│   │       ├── CommentBarrage.tsx
│   │       └── ProgressBadge.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Radio.tsx          # /radio
│   │   └── Training.tsx       # /training
│   └── hooks/
│       ├── useDeepSeek.ts
│       └── useTypewriter.ts   # 电台回复逐字效果
└── cursor-project/           # 本开发包（可保留作文档）
    ├── README.md
    ├── prompts.ts
    ├── .env.example
    └── FILE_STRUCTURE.md
```

## 开发顺序对应目录

1. **初始化**：根配置 + `src/main.tsx` + `App.tsx` + 路由 + `index.css`
2. **Mode B**：`store/gameStore.ts` → `api/deepseek.ts` → `pages/Radio.tsx` + `components/radio/*`
3. **Mode A**：`pages/Training.tsx` + `components/training/*`
4. **全局**：`components/layout/*` + `pages/Home.tsx` + 双模式联动
5. **打磨**：动画、音效、PWA（可选）
