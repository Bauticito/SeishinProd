type ProgressBarProps = {
  value: number;
  label: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  const color =
    safeValue < 35
      ? "from-[#E31E24]/60 to-[#E31E24]"
      : safeValue < 65
      ? "from-[#E31E24] to-[#ff3137]"
      : "from-[#E31E24] to-[#ff6060]";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/50 text-xs uppercase tracking-wider font-bold">Cobertura</span>
        <span className="font-black text-white text-sm">{label}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <p className="text-xs text-white/30 text-right">{safeValue} / 100</p>
    </div>
  );
}
