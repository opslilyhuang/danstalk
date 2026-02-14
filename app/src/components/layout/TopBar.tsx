import { Link } from "react-router-dom";
import { useGameStore } from "../../store/gameStore";
import { IconBag, IconCoin } from "../icons/NavIcons";

const LEVEL_NAMES: Record<string, string> = {
  rookie: "素人",
  openmic: "开放麦老炮",
  special: "专场演员",
  poison: "行业毒瘤",
};

function getExpProgress(exp: number): { label: string; percent: number } {
  const e = exp ?? 0;
  if (e >= 300) return { label: LEVEL_NAMES.poison, percent: 100 };
  if (e >= 150) return { label: LEVEL_NAMES.special, percent: ((e - 150) / (300 - 150)) * 100 };
  if (e >= 50) return { label: LEVEL_NAMES.openmic, percent: ((e - 50) / (150 - 50)) * 100 };
  return { label: LEVEL_NAMES.rookie, percent: (e / 50) * 100 };
}

export default function TopBar() {
  const coins = useGameStore((s) => s.user.coins ?? 0);
  const exp = useGameStore((s) => s.user.exp ?? 0);
  const { label, percent } = getExpProgress(exp);

  return (
    <header
      className="h-12 px-4 flex items-center justify-between"
      style={{
        borderBottom: "1px solid rgba(167, 139, 250, 0.12)",
        background: "rgba(13, 11, 20, 0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Link to="/" className="font-title text-lg text-[var(--mode-a-text)] opacity-90 hover:opacity-100 transition-opacity">
        诞说无妨
      </Link>
      <div className="flex items-center gap-4">
        <Link
          to="/backpack"
          className="p-1.5 rounded-lg text-[var(--mode-a-text-muted)] hover:text-[var(--mode-a-primary)] hover:bg-[var(--mode-a-primary-soft)] transition-colors"
          title="背包"
        >
          <IconBag className="w-5 h-5" />
        </Link>
        <span className="text-xs text-[var(--mode-a-text-muted)] hidden sm:inline flex items-center gap-1.5" title={label}>
          <span>{label}</span>
          <span className="inline-block w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <span
              className="block h-full rounded-full bg-[var(--mode-a-accent)] transition-[width] duration-300"
              style={{ width: `${Math.min(100, percent)}%` }}
            />
          </span>
        </span>
        <span className="flex items-center gap-1 text-sm text-[var(--mode-a-accent)]" title="毒硬币">
          <IconCoin className="w-4 h-4 opacity-90" />
          <span>{coins}</span>
        </span>
      </div>
    </header>
  );
}
