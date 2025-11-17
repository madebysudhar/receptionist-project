import Link from "next/link";

type ClinicCardProps = {
  c: {
    id: string;
    name: string;
    date: string;
    time: string;
    capacity?: number;
    booked?: number;
    attended?: number;
    noShows?: number;
    followupsNeeded?: number;
    note?: string;
  };
  completed?: boolean;
};

export default function ClinicCard({ c, completed }: ClinicCardProps) {
  const booked = c.booked ?? 0;
  const capacity = c.capacity ?? 0;
  const fillPercent = capacity ? Math.round((booked / capacity) * 100) : 0;

  return (
    <Link
      href={`/clinics/${c.id}?type=${completed ? "completed" : "upcoming"}`}
      className="block"
    >
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <h3 className="font-medium">{c.name}</h3>
            </div>
            <div className="sub mt-1">
              {c.date} • {c.time}
            </div>

            {/* ---------- UPCOMING CLINIC ---------- */}
            {!completed && (
              <div className="sub mt-3">
                {booked} booked • {capacity - booked} slot
                {capacity - booked === 1 ? "" : "s"} open
              </div>
            )}

            {/* ---------- COMPLETED CLINIC ---------- */}
            {completed && (
              <div className="sub mt-3">
                {c.attended ?? 0} attended • {c.noShows ?? 0} no-shows
              </div>
            )}

            {/* ---------- FOLLOW-UP INFO ---------- */}
            {completed && (c.followupsNeeded ?? 0) > 0 && (
              <div className="text-xs mt-2 text-amber-600">
                {c.followupsNeeded} need follow-up
              </div>
            )}

            {/* Optional note */}
            {c.note && (
              <div className="text-xs mt-2 text-amber-600">{c.note}</div>
            )}
          </div>

          {/* ---------- STATUS BADGE ---------- */}
          <div>
            {completed ? (
              <span className="badge bg-emerald-50 text-emerald-700">
                ✓ Completed
              </span>
            ) : (
              <span className="badge bg-amber-50 text-amber-700">
                ⏲ Pending
              </span>
            )}
          </div>
        </div>

        {/* ---------- PROGRESS BAR (for upcoming) ---------- */}
        {!completed && capacity > 0 && (
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full">
              <div
                className="h-1.5 bg-teal-700 rounded-full"
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
