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
          ? "border-[#E31E24] bg-[#E31E24]/10 shadow-lg shadow-[#E31E24]/10"
          : "border-[var(--border-color-light)] glass hover:border-[#E31E24]/50 hover:shadow-md",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block text-xs font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md mb-2",
          selected ? "bg-[#E31E24] text-white" : "bg-[#E31E24]/10 text-[#E31E24]",
        ].join(" ")}
      >
        {level}
      </span>
      <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">{title}</h3>
      <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </button>
  );
}
