import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { IconHome, IconMic, IconTrophy, IconRadio, IconBag } from "../icons/NavIcons";

const nav = [
  { path: "/", label: "首页", Icon: IconHome },
  { path: "/training", label: "开放麦", Icon: IconMic },
  { path: "/showcase", label: "诞说大赏", Icon: IconTrophy },
  { path: "/radio", label: "深夜电台", Icon: IconRadio },
  { path: "/backpack", label: "背包", Icon: IconBag },
];

export default function Dock() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-center px-4 pb-2"
      style={{
        background: "linear-gradient(to top, rgba(13,11,20,0.92) 0%, rgba(13,11,20,0.4) 70%, transparent)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-2xl"
        style={{
          background: "rgba(21, 18, 31, 0.7)",
          border: "1px solid rgba(167, 139, 250, 0.15)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        {nav.map(({ path, label, Icon }) => {
          const active = location.pathname === path;
          const isRadio = path === "/radio";
          const isTraining = path === "/training";
          const isShowcase = path === "/showcase";
          const isBackpack = path === "/backpack";
          const activeColor = active
            ? isRadio
              ? "var(--mode-b-primary)"
              : isTraining
                ? "var(--mode-a-primary)"
                : isShowcase
                  ? "var(--mode-a-accent)"
                  : isBackpack
                    ? "#b91c1c"
                    : "var(--mode-a-text)"
            : "var(--mode-a-text-muted)";
          return (
            <Link key={path} to={path}>
              <motion.span
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl min-w-[56px]"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  color: activeColor,
                  background: active ? "rgba(167, 139, 250, 0.12)" : "transparent",
                }}
              >
                <Icon className="w-6 h-6" style={{ color: activeColor }} />
                <span className="text-[10px] font-medium tracking-wide opacity-90">{label}</span>
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
