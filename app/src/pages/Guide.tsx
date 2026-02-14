// 诞总让你先看这个 - 新手指南
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function Guide() {
  return (
    <div className="flex-1 w-full max-w-xl mx-auto px-4 py-8 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-title text-xl text-[var(--mode-a-text)]">诞总让你先看这个</h1>
        <Link
          to="/"
          className="text-sm text-[var(--mode-a-text-muted)] hover:text-[var(--mode-a-accent)] transition-colors"
        >
          回首页
        </Link>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.blockquote
          variants={item}
          className="pl-4 border-l-2 border-[var(--mode-a-accent)]/60 text-[var(--mode-a-text-muted)] text-sm italic"
        >
          别紧张，诞总不会真喝酒上台。但会不会毒舌，不好说。
        </motion.blockquote>

        <motion.section variants={item}>
          <h2 className="text-[var(--mode-a-primary)] font-medium text-base mb-2">
            你谁啊，我为什么要听你的？
          </h2>
          <p className="text-[var(--mode-a-text)] text-sm leading-relaxed">
            这是「诞说无妨」——一个让你写段子、听点评、攒毒硬币、还能半夜给诞总写信的地方。
            没有真舞台，没有真观众，但有真的诞总（AI 版）在边上喝酒点评。
          </p>
          <p className="text-[var(--mode-a-accent)] text-sm font-medium mt-2">
            一句话：选一扇门进去，写就完了。
          </p>
        </motion.section>

        <motion.section variants={item}>
          <h2 className="text-[var(--mode-a-primary)] font-medium text-base mb-3">
            两扇门 + 随便聊聊
          </h2>
          <p className="text-[var(--mode-a-text-muted)] text-sm mb-4">
            进门之前先想好：练段子、聊人生，还是到点找诞总唠嗑。
          </p>

          <div className="space-y-4">
            <div
              className="rounded-xl p-4 border"
              style={{
                borderColor: "rgba(167, 139, 250, 0.4)",
                background: "var(--mode-a-primary-soft)",
              }}
            >
              <h3 className="text-[var(--mode-a-text)] font-medium text-sm mb-2">门一：开放麦训练营</h3>
              <p className="text-[var(--mode-a-text-muted)] text-xs mb-2">
                <span className="text-[var(--mode-a-text)]">干啥的：</span>
                选题 → 选角度 → 写段子 → 上台（假装）→ 诞总点评 → 领毒硬币和经验。
              </p>
              <p className="text-[var(--mode-a-text-muted)] text-xs mb-2">
                <span className="text-[var(--mode-a-text)]">为啥要来：</span>
                写够字数就有毒硬币拿；诞总评得狠，但能帮你找笑点、找问题；写多了还能解锁隐藏话题、成就，甚至「诞说大赏」。
              </p>
              <p className="text-[var(--mode-a-text-muted)] text-xs">
                <span className="text-[var(--mode-a-accent)]">小贴士：</span>
                段子最多 1200 字；不想花币选「换一题」抽免费题；高级话题 3 币解锁永久；同题「再写一次」诞总会接着上轮点评说；诞总说「这段不错」时可选公开到诞说大赏。
              </p>
            </div>

            <div
              className="rounded-xl p-4 border"
              style={{
                borderColor: "rgba(245, 158, 11, 0.4)",
                background: "rgba(245, 158, 11, 0.08)",
              }}
            >
              <h3 className="text-[var(--mode-a-text)] font-medium text-sm mb-2">门二：深夜电台</h3>
              <p className="text-[var(--mode-a-text-muted)] text-xs mb-2">
                <span className="text-[var(--mode-a-text)]">干啥的：</span>
                写信 → 投进电台 → 等诞总回（可能直接回，也可能要 2 币插队）→ 能收藏回复、花 1 币「多说一点」。
              </p>
              <p className="text-[var(--mode-a-text-muted)] text-xs">
                <span className="text-[var(--mode-a-accent)]">小贴士：</span>
                每封信「多说一点」只能点一次，想清楚再花那 1 币。
              </p>
            </div>

            <div
              className="rounded-xl p-4 border"
              style={{
                borderColor: "rgba(110, 231, 183, 0.4)",
                background: "var(--mode-a-accent-soft)",
              }}
            >
              <h3 className="text-[var(--mode-a-text)] font-medium text-sm mb-2">和诞总聊聊</h3>
              <p className="text-[var(--mode-a-text-muted)] text-xs mb-2">
                <span className="text-[var(--mode-a-text)]">干啥的：</span>
                每晚 <strong className="text-[var(--mode-a-accent)]">20:00—24:00</strong>（中国时间）开放，和诞总多轮随便聊，不写信、不写段子，纯唠嗑。
              </p>
              <p className="text-[var(--mode-a-text-muted)] text-xs">
                <span className="text-[var(--mode-a-accent)]">小贴士：</span>
                每次开放时段内，从你发第一条消息起算约 5 分钟；时间到了可花 3 币多聊 2 分钟。首页会显示「和诞总聊聊」或「每晚 20:00 开放」。
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section variants={item}>
          <h2 className="text-[var(--mode-a-primary)] font-medium text-base mb-2">毒硬币能干啥？</h2>
          <ul className="text-[var(--mode-a-text-muted)] text-sm space-y-1 list-disc list-inside">
            <li>解锁<strong className="text-[var(--mode-a-text)]">高级话题</strong>（3 币一个，永久）</li>
            <li><strong className="text-[var(--mode-a-text)]">插队</strong>等回复（电台 2 币）</li>
            <li>让诞总<strong className="text-[var(--mode-a-text)]">多说一点</strong>（电台 1 币/封）</li>
            <li>听<strong className="text-[var(--mode-a-text)]">另外两人点评</strong>（2 币）、<strong className="text-[var(--mode-a-text)]">三人讨论</strong>（5 币）</li>
            <li><strong className="text-[var(--mode-a-text)]">随便聊聊</strong>多聊 2 分钟（3 币/次）</li>
          </ul>
          <p className="text-[var(--mode-a-text-muted)] text-xs mt-2 italic">多写段子拿币，别抠，该花就花。</p>
        </motion.section>

        <motion.section variants={item}>
          <h2 className="text-[var(--mode-a-primary)] font-medium text-base mb-2">段位是啥？</h2>
          <p className="text-[var(--mode-a-text)] text-sm mb-2">
            素人 → 开放麦老炮 → 专场演员 → 行业毒瘤
          </p>
          <p className="text-[var(--mode-a-text-muted)] text-xs">
            升级解锁成就，有的成就还会解锁<strong className="text-[var(--mode-a-accent)]">隐藏话题</strong>——诞总私藏的那种，不剧透。
          </p>
        </motion.section>

        <motion.section variants={item}>
          <h2 className="text-[var(--mode-a-primary)] font-medium text-base mb-2">背包里都有啥？</h2>
          <ul className="text-[var(--mode-a-text-muted)] text-sm space-y-1 list-disc list-inside">
            <li><strong className="text-[var(--mode-a-text)]">成就</strong>：解锁进度、哪些能解锁隐藏话题</li>
            <li><strong className="text-[var(--mode-a-text)]">收藏的金句</strong>：电台或点评里收藏的</li>
            <li><strong className="text-[var(--mode-a-text)]">往期电台</strong>：信和回复，可删可留</li>
          </ul>
        </motion.section>

        <motion.section variants={item}>
          <h2 className="text-[var(--mode-a-primary)] font-medium text-base mb-2">诞说大赏是啥？</h2>
          <p className="text-[var(--mode-a-text-muted)] text-sm leading-relaxed">
            诞总觉得「特别不错」的段子，经你同意后会出现在这里。卡片式展示，带话题、段子和诞总点评——只有被诞总夸到位的才有机会进，算个小荣誉墙。
          </p>
        </motion.section>

        <motion.section variants={item}>
          <h2 className="text-[var(--mode-a-primary)] font-medium text-base mb-2">还有啥好玩的？</h2>
          <ul className="text-[var(--mode-a-text-muted)] text-sm space-y-1.5">
            <li><strong className="text-[var(--mode-a-text)]">随便聊聊</strong>：每晚 20:00（中国时间）开放，多轮唠嗑约 5 分钟，可花币延长</li>
            <li><strong className="text-[var(--mode-a-text)]">诞总今日心情</strong>：首页每天不一样，纯看命</li>
            <li><strong className="text-[var(--mode-a-text)]">台上观众反应</strong>：可能哄笑、冷场、再来一个，每次随机</li>
            <li><strong className="text-[var(--mode-a-text)]">电台开场白</strong>：回信前随机一句诞总状态</li>
            <li><strong className="text-[var(--mode-a-text)]">连续写三天</strong>：首页冒出「诞总请你喝酒」彩蛋</li>
          </ul>
        </motion.section>

        <motion.section
          variants={item}
          className="rounded-xl p-4 border-2"
          style={{
            borderColor: "var(--mode-a-accent)",
            background: "var(--mode-a-accent-soft)",
          }}
        >
          <h2 className="text-[var(--mode-a-accent)] font-medium text-base mb-3">总结：进来之后干啥？</h2>
          <ol className="text-[var(--mode-a-text)] text-sm space-y-2 list-decimal list-inside">
            <li><strong>想练段子</strong> → 进开放麦，选题、写（最多 1200 字）、上台、听点评、同题可「再写一次」接着改；领奖励</li>
            <li><strong>想唠嗑</strong> → 进深夜电台，写信、等回复，想多听就花 1 币「多说一点」</li>
            <li><strong>想随便聊</strong> → 每晚 20:00（中国时间）首页点「和诞总聊聊」，多轮聊约 5 分钟，可花 3 币延长 2 分钟</li>
            <li><strong>想攒东西</strong> → 多写拿币、收藏金句、解锁成就和隐藏话题</li>
          </ol>
          <p className="text-[var(--mode-a-text-muted)] text-xs mt-3">
            别指望诞总嘴下留情，但写多了、玩多了，你会发现这地方挺上头的。门在那儿，自己进。
          </p>
        </motion.section>

        <motion.p
          variants={item}
          className="text-center text-[var(--mode-a-text-muted)] text-xs italic pt-4"
        >
          —— 诞说无妨 · 写就完了
        </motion.p>
      </motion.div>
    </div>
  );
}
