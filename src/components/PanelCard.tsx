import type { ReactNode } from "react";

type PanelTone = "sky" | "mint" | "pink" | "lavender" | "lemon" | "peach";

type PanelCardProps = {
  tone: PanelTone;
  title: string;
  className?: string;
  children: ReactNode;
};

export function PanelCard({
  tone,
  title,
  className = "",
  children,
}: PanelCardProps) {
  return (
    <section
      className={`panel-card panel-card-${tone} relative mb-5 overflow-visible p-4 ${className}`}
      data-tone={tone}
    >
      <div className="panel-heading">
        <span className="panel-heading-mark" aria-hidden="true" />
        <h2 className="panel-title font-[family-name:var(--font-fredoka)] text-[1.05rem] font-semibold text-[#3d4a5c]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
