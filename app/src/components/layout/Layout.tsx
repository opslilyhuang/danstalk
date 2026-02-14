import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Dock from "./Dock";
import TopBar from "./TopBar";
import Toaster from "./Toaster";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isRadio = location.pathname === "/radio";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        color: isRadio ? "var(--mode-b-text)" : "var(--mode-a-text)",
        background: isRadio
          ? "var(--mode-b-bg)"
          : "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(88, 28, 135, 0.15), transparent 50%), radial-gradient(ellipse 100% 100% at 50% 100%, rgba(110, 231, 183, 0.06), transparent 45%), var(--mode-a-bg)",
      }}
    >
      <TopBar />
      <main className="flex-1 flex flex-col pb-20">{children}</main>
      <Dock />
      <Toaster />
    </div>
  );
}
