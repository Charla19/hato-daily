type SeeAllButtonProps = {
  count: number;
  onClick: () => void;
  expanded?: boolean;
  label?: string;
};

export function SeeAllButton({
  count,
  onClick,
  expanded = false,
  label = "See all",
}: SeeAllButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-see-all mt-2 w-full rounded-xl border-2 border-dashed border-[rgba(61,74,92,0.18)] bg-white/50 py-2 text-xs font-bold text-[#3d4a5c] transition-colors hover:bg-white/80"
    >
      {expanded ? "Show less" : `${label} · ${count}`}
    </button>
  );
}
