type Stat = { label: string; value: number };

export default function StatBar({
  title,
  stats,
  cta,
}: {
  title: string;
  stats: Stat[];
  cta?: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-teal-800">
          <span className="text-xl">📞</span>
          <p className="font-medium">{title}</p>
        </div>
        {cta}
      </div>

      {/* Evenly spaced stat blocks */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 mt-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center px-4 text-center"
          >
            <div className="text-2xl font-semibold text-slate-800">
              {s.value}
            </div>
            <div className="sub text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
