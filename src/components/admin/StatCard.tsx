export default function StatCard({
  label,
  value,
  valueClassName = "text-[#f0e6d3]",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1a1f2e]">
      {/* Gold accent line at top of card */}
      <div className="h-0.5 w-full bg-[#c9a84c]" />
      <div className="p-5">
        <p className="font-body text-xs uppercase tracking-widest text-[rgba(240,230,211,0.5)]">
          {label}
        </p>
        <p className={`mt-2 font-display text-3xl ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
}
