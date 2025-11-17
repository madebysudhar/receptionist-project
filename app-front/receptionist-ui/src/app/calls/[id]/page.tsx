export const dynamic = "force-dynamic";
import Link from "next/link";
import { format } from "date-fns";
import FormattedDate from "@/components/FormattedDate";
import { query } from "@/lib/db";


export default async function CallDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { rows } = await query(
    "SELECT * FROM calls WHERE id = $1 LIMIT 1",
    [id]
  );

  const c = rows[0];

  if (!c) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 text-center text-slate-500">
        <p className="text-lg mb-4">Call not found</p>
        <Link href="/calls" className="text-teal-700 font-medium">
          ← Back to all calls
        </Link>
      </div>
    );
  }

  const durationSec = Number(c.duration_sec ?? 0);
  const duration =
    durationSec > 0
      ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`
      : "";

  const formattedTime = c.when
    ? format(new Date(c.when), "MMM d • h:mm a")
    : "";

  const combinedTime = `${formattedTime}${duration ? " - " + duration : ""}`;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="py-6">
        <Link href="/calls" className="text-slate-500 hover:text-slate-700 text-sm">
          ← Back to all calls
        </Link>
      </div>

      <FormattedDate when={c.when} duration={durationSec} />

      <div className="flex items-center gap-3 mt-1">
        <h1 className="text-xl font-semibold text-slate-800">{c.name}</h1>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-50 text-gray-600">
          {c.status}
        </span>
      </div>

      {c.age && <div className="text-gray-400 mt-1">{`${c.age} years old`}</div>}

      <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-lg mt-6">
        <div className="font-medium text-emerald-800">{c.status}</div>
        <div className="text-sm text-emerald-700">
          {c.direction} • {duration}
        </div>
      </div>

      {/* Details */}
      <div className="mt-6">
        <div className="text-xs uppercase text-slate-500 font-semibold">
          Call Details
        </div>
        <p className="mt-2 text-slate-700">{c.note || "—"}</p>
      </div>

      {/* Appointment grid */}
      <div className="grid grid-cols-2 gap-8 mt-8 text-sm">
        <div>
          <div className="text-xs uppercase text-slate-500 font-semibold">
            Appointment
          </div>
          <div className="mt-2 text-slate-700">
            {c.appt_date
              ? format(new Date(c.appt_date), "MMM d, yyyy")
              : "—"}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase text-slate-500 font-semibold">
            Reason
          </div>
          <div className="mt-2 text-slate-700">{c.reason || "—"}</div>
        </div>

        <div>
          <div className="text-xs uppercase text-slate-500 font-semibold">
            Insurance
          </div>
          <div className="mt-2 text-slate-700">{c.insurance || "—"}</div>
        </div>

        <div>
          <div className="text-xs uppercase text-slate-500 font-semibold">
            Email ID
          </div>
          <div className="mt-2 text-slate-700">{c.email || "—"}</div>
        </div>

        <div>
          <div className="text-xs uppercase text-slate-500 font-semibold">
            Phone Number
          </div>
          <div className="mt-2 text-slate-700">{c.phone || "—"}</div>
        </div>
      </div>

      {c.recording_url && (
        <div className="mt-8">
          <a
            className="text-teal-700 hover:text-teal-900 font-medium"
            href={c.recording_url}
            target="_blank"
          >
            ▶ Listen to call recording
          </a>
        </div>
      )}
    </div>
  );
}
