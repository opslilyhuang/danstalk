# 诞说无妨 - 产品需求文档

## 项目概述
双模式游戏化应用，模拟与李诞（脱口秀演员）的互动体验：
- **Mode A: 开放麦训练营** - 游戏化脱口秀创作训练
- **Mode B: 深夜电台** - 情感疗愈与人生解惑

## 技术栈
- React 18 + TypeScript + Vite
- Tailwind CSS + Framer Motion（所有动画）
- Zustand（状态管理）
- DeepSeek API（AI 对话）
- LocalStorage（MVP 数据存储）

## 核心设计系统

### 颜色规范
**Mode A (训练营 - 赛博朋克)**:
- 背景: #0F0F1A (深紫黑)
- 主色: #8B5CF6 (霓虹紫)
- accent: #39FF14 (荧光绿)
- 文字: #FFFFFF / #A1A1AA

**Mode B (电台 - 复古暖色)**:
- 背景: #1A0F0F (深红棕)
- 主色: #F59E0B (琥珀)
- accent: #7F1D1D (深红)
- 文字: #FFF8DC (暖白) / #D4C5B0

### 字体
- 标题: ZCOOL KuaiLe (快乐体)
- 正文: Noto Sans SC
- 手写体: 用于 Mode B 信件 (Caveat 或泽码手写体)

### 动画规范
- 所有交互: hover scale 1.05, tap scale 0.95 (spring 弹性)
- 页面切换: AnimatePresence，翻书效果
- 加载: 不使用 spinner，用"诞总正在喝酒..." + 酒液晃动动画

## Mode A: 开放麦训练营 (路径 /training)

### 核心循环 (3分钟一局)
1. **选题阶段**: 3D 卡片展示今日话题（如"地铁奇葩事"）
2. **角度选择**: 3选1 卡片（避免空白页焦虑）
   - 选项示例: [正常观察][荒诞解读][攻击性角度]
3. **创作阶段**: 分屏左侧编辑器(AI辅助) + 右侧像素风观众席
4. **演出阶段**: 舞台场景，播放掌声/嘘声(Lottie)
5. **点评阶段**: 弹幕式文字飞过屏幕，诞总毒舌点评
6. **奖励**: 获得毒硬币，段位进度条增加

### 游戏机制
- **段位系统**: 素人 → 开放麦老炮 → 专场演员 → 行业毒瘤
- **货币**: 毒硬币，用于解锁高级话题或在 Mode B 插队
- **失败乐趣**: "冷场"触发"救场现挂"训练，不扣分反而解锁特殊技能
- **心流调节**: AI 根据表现动态调整下一题难度

### UI 组件清单
- SceneCard3D: 3D 翻转的话题卡片 (Three.js/CSS 3D)
- AngleSelector: 三选一卡片组，支持滑动选择
- WritingDesk: 分屏编辑器 + 实时观众反应
- Stage: 开放麦舞台，聚光灯效果
- CommentBarrage: 弹幕式点评文字
- ProgressBadge: 段位徽章 + 进度环

## Mode B: 深夜电台 (路径 /radio)

### 核心机制 (异步直播模拟)
1. **写信**: 羊皮纸全屏输入，300字限制，手写体光标
2. **投信**: 信封飞入邮筒动画，进入"信池"
3. **等待**: 显示"信已投入，等待诞总拆阅..."（随机时间 1-24h 或立即演示）
4. **拆信**: 收音机屏幕亮起，蜡封撕开动画，信纸展开
5. **聆听**: 波形图随语音跳动，文字逐字打印(Typewriter)
6. **收藏**: 金句高亮，hover 收藏飞入背包

### 关键体验细节
- **被选中的仪式感**: 只有 20% 概率立即回复（斯金纳箱原理）
- **氛围营造**: 背景酒吧环境音可视化、红酒杯半透明悬浮
- **人格化**: 回复严格遵循李诞语气（见 prompts.ts）

### UI 组件清单
- RadioSet: 复古收音机 3D/CSS 模型，带屏幕和旋钮
- LetterWriter: 羊皮纸背景，手写输入体验
- EnvelopeAnimation: 投递和拆封的 Lottie 动画
- AudioVisualizer: 根据语音生成的波形图
- QuoteCard: 可收藏的金句卡片，带玻璃拟态效果
- ArchiveShelf: 往期电台磁带/黑胶列表

## 全局系统

### 导航结构
- 首页 (/): 中央李诞像素头像，左右两扇门（紫/黄），悬停晃动
- 底部 Dock: Mac 风格，模式切换高亮带呼吸灯
- 顶部栏: 用户头像 + 毒硬币数量 + 设置（语音开关）

### 数据模型 (Zustand)
```typescript
interface GameState {
  user: {
    level: 'rookie' | 'openmic' | 'special' | 'poison';
    coins: number;
    badges: string[];
    collectedQuotes: Quote[];
  };
  letters: {
    id: string;
    content: string;
    status: 'pending' | 'read' | 'replied';
    reply?: string;
    audioUrl?: string;
    createdAt: Date;
  }[];
  currentMode: 'training' | 'radio';
}
```

### 双模式联动
- Mode B 收集的金句 → 成为 Mode A 的创作素材
- Mode A 赚取的毒硬币 → 在 Mode B 用于"插队投信"（加速回复）
- 统一背包系统: 收藏的金句、写过的段子、获得的徽章

## API 集成

### DeepSeek 配置
- Base URL: https://api.deepseek.com/v1
- Model: deepseek-chat (V3) 用于 Mode A, deepseek-reasoner (R1) 用于 Mode B
- 流式输出: 开启，配合 Typewriter 效果

### 语音合成 (Phase 2)
- 预留接口，MVP 阶段使用浏览器 Web Speech API
- 后期替换为 ElevenLabs 或本地 GPT-SoVITS

## 素材清单 (使用占位符)
- [ ] public/assets/dan-avatar.png (像素风头像)
- [ ] public/audio/applause.mp3
- [ ] public/audio/boo.mp3
- [ ] public/audio/paper-tear.mp3
- [ ] public/audio/wine-pour.mp3
- [ ] public/fonts/ZCOOLKuaiLe-Regular.ttf

## 开发顺序
1. 项目初始化 + 全局样式 + 路由
2. Mode B (电台) - 情感体验为核心，验证"诞总感"
3. Mode A (训练营) - 游戏化系统
4. 双模式数据打通 + 背包系统
5. 动画 polish + 音效接入
6. PWA 配置 (可选，支持离线写信)

## 特别注意
- 所有中文文案必须符合李诞口语风格（见 prompts.ts）
- 禁止使用 Ant Design / Material UI，全部手写 Tailwind
- 移动端优先（Mode B 主要场景是手机）
- 每个功能模块注释使用的游戏设计原理编号（如 // #45 最小化阻力）
