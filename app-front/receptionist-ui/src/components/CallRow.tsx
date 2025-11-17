// 📘 Import dependencies
import Link from "next/link";
import { format } from "date-fns"; // for formatting time easily
import { Call } from "@/lib/types"; // ✅ make sure this points to your types.ts

export default function CallRow({ c }: { c: Call }) {
  // 💡 Step 1: Format the call time (e.g. "Oct 16 • 11:05 AM")
  // The value in your Google Sheets is ISO format like: 2025-10-16T11:05:00+01:00
  const formattedTime = c.when
    ? format(new Date(c.when), "MMM d • h:mm a")
    : "";

  // 💡 Step 2: Format the speaking duration (in seconds → "2m 18s")
  const duration =
    typeof c.duration_sec === "number" && c.duration_sec > 0
      ? `${Math.floor(c.duration_sec / 60)}m ${c.duration_sec % 60}s`
      : "";

  // 💡 Step 3: Combine both into one line → "Oct 16 • 11:05 AM - 2m 18s"
  const combinedTime = `${formattedTime}${duration ? " - " + duration : ""}`;

  // 💡 Step 4: Map each call status to a color badge
  const statusStyle =
    {
      "Appointment Booked": "bg-emerald-50 text-emerald-700",
      Rescheduled: "bg-sky-50 text-sky-700",
      Cancelled: "bg-rose-50 text-rose-600",
    }[c.status] || "bg-gray-50 text-gray-600";

  // ✅ Step 5: Render the Call Row (layout same as before)
  return (
    <Link
      href={`/calls/${c.id}`}
      className="block transition-colors hover:bg-slate-50 rounded-lg"
    >
      <div className="flex items-center justify-between py-5 px-2 border-b border-slate-100">
        {/* Left Side: Caller info */}
        <div>
          {/* 🕒 When + Duration */}
          <div className="text-sm text-slate-500">{combinedTime}</div>

          {/* 👤 Caller Name */}
          <div className="mt-1 text-slate-800 font-medium text-[15px]">
            {c.name}
          </div>

          {/* 📞 Direction + Reason */}
          <div className="text-sm text-slate-500">
            {c.direction} • {c.reason}
          </div>
        </div>

        {/* Right Side: Status badge */}
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full border border-transparent ${statusStyle}`}
        >
          {c.status}
        </span>
      </div>
    </Link>
  );
}
