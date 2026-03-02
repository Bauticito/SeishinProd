import type { PropsWithChildren, ReactNode } from "react";

type StepProps = PropsWithChildren<{
  title: string;
  description: string;
  index: number;
  total: number;
  rightSlot?: ReactNode;
}>;

export function Step({ title, description, index, total, rightSlot, children }: StepProps) {
  return (
    <section className="glass rounded-[2rem] p-6 md:p-8 border border-[var(--border-color-light)]">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E31E24]">
            Paso {index + 1} de {total}
          </p>
          <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{title}</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
        </div>
        {rightSlot}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}
