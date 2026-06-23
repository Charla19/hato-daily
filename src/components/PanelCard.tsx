import type { ReactNode } from "react";

type PanelTone = "sky" | "mint" | "pink" | "lavender" | "lemon" | "peach";

type PanelCardProps = {
  tone: PanelTone;
  title: string;
  icon?: string;
  insect?: "dragonfly" | "butterfly-green" | "butterfly-orange";
  className?: string;
  children: ReactNode;
};

const toneClass: Record<PanelTone, string> = {
  sky: "bg-[#dff5ff] border-[#b8e4ff]",
  mint: "bg-[#c8f5dc] border-[#9ee8be]",
  pink: "bg-[#ffd6e8] border-[#ffb8d4]",
  lavender: "bg-[#e4d9ff] border-[#cbb8ff]",
  lemon: "bg-[#fff6b8] border-[#ffe066]",
  peach: "bg-[#ffd9c4] border-[#ffc0a0]",
};

const insectSrc = {
  dragonfly: "/assets/insects/dragonfly-pink-transparent.png",
  "butterfly-green": "/assets/insects/butterfly-green-transparent.png",
  "butterfly-orange": "/assets/insects/butterfly-orange-transparent.png",
};

const insectSize: Record<NonNullable<PanelCardProps["insect"]>, string> = {
  dragonfly: "h-[72px] w-[72px]",
  "butterfly-green": "h-16 w-16",
  "butterfly-orange": "h-16 w-16",
};

export function PanelCard({
  tone,
  title,
  icon,
  insect,
  className = "",
  children,
}: PanelCardProps) {
  return (
    <section
      className={`panel-card relative mb-4 overflow-visible rounded-[18px] border-[3px] p-4 shadow-[0_5px_0_rgba(61,74,92,0.08),0_8px_20px_rgba(61,74,92,0.07)] ${toneClass[tone]} ${className}`}
    >
      {insect && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={insectSrc[insect]}
          alt=""
          className={`panel-insect absolute -right-2.5 -top-4 z-10 rotate-12 object-contain drop-shadow-md ${insectSize[insect]}`}
          aria-hidden="true"
        />
      )}
      <h2 className="panel-title mb-3 flex items-center gap-1.5 border-b-[3px] border-dashed border-[rgba(61,74,92,0.12)] pb-2 font-[family-name:var(--font-fredoka)] text-[1.05rem] font-semibold text-[#3d4a5c]">
        {icon && <span className="text-[1.15rem]">{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}
