import type { IntelligenceLevel } from "@/lib/types";

type PlanCardProps = {
  level: IntelligenceLevel;
  title: string;
  description: string;
  selected: boolean;
  onSelect: (level: IntelligenceLevel) => void;
};

export function PlanCard({ level, title, description, selected, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(level)}
      className={[
        "w-full rounded-2xl border p-5 text-left transition-all duration-300 group",
        selected
          ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-lg shadow-[var(--accent-primary)]/10"
          : "border-[var(--border-color-light)] glass hover:border-[var(--accent-primary)]/50 hover:shadow-md",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block text-xs font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md mb-2",
          selected ? "bg-[var(--accent-primary)] text-white" : "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]",
        ].join(" ")}
      >
        {level}
      </span>
      <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">{title}</h3>
      <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </button>
  );
}
