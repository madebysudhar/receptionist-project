export const dynamic = "force-dynamic";

import Link from "next/link";
import StatBar from "@/components/StatBar";
import CallRow from "@/components/CallRow";
import { query } from "@/lib/db";


export default async function CallsPage() {

  // Get all calls from Postgres
  const { rows: calls } = await query("SELECT * FROM calls ORDER BY id DESC");

  const totalCalls = calls.length;

  const booked = calls.filter((c: any) =>
    ["appointment booked", "booked"].includes((c.status || "").toLowerCase())
  ).length;

  const rescheduled = calls.filter(
    (c: any) => (c.status || "").toLowerCase() === "rescheduled"
  ).length;

  const cancelled = calls.filter(
    (c: any) => (c.status || "").toLowerCase() === "cancelled"
  ).length;

  const weekly = {
    callsHandled: totalCalls,
    stats: [
      { label: "Appointments booked", value: booked },
      { label: "Rescheduled", value: rescheduled },
      { label: "Cancelled", value: cancelled },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="py-6">
        <Link href="/dashboard" className="link">
          ← Back to dashboard
        </Link>
      </div>

      <div className="sub uppercase">Call History</div>
      <h1 className="h1 mt-1">All Calls</h1>

      <div className="mt-6">
        <StatBar
          title={`${weekly.callsHandled} calls handled this week`}
          stats={weekly.stats}
        />
      </div>

      <div className="mt-6">
        {calls.length > 0 ? (
          calls.map((c: any) => <CallRow key={c.id} c={c} />)
        ) : (
          <div className="text-gray-500 mt-6">No calls found.</div>
        )}
      </div>

      <div className="sub mt-6 text-gray-400">
        Showing all calls from latest entries
      </div>
    </div>
  );
}
