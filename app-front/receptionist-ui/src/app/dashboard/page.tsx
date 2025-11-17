import TopBar from "@/components/TopBar";
import StatBar from "@/components/StatBar";
import ClinicCard from "@/components/ClinicCard";
import Link from "next/link";
import { fetchCalls, fetchClinics, fetchAppointments } from "@/lib/sheets";

export const dynamic = "force-dynamic"; // ✅ Always fetch fresh data

// ---------- Types ----------
type ClinicRow = {
  id: string;
  name: string;
  weekday: string;
  start_time: string;
  end_time: string;
  capacity?: number | string;
};

type AppointmentRow = {
  clinic_id: string;
  date: string;
  status: string;
};

// ---------- Utilities ----------
const WEEKDAY_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

// ✅ Converts "14:00" → "2:00 PM"
function formatTime24to12(time: string) {
  if (!time) return "";
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

// ---------- Dashboard ----------
export default async function Dashboard() {
  // ✅ Always fetch fresh data from Google Sheets API
  const [callsRaw, clinicsRaw, apptsRaw] = await Promise.all([
    fetchCalls(),
    fetchClinics(),
    fetchAppointments(),
  ]);

  const clinics: ClinicRow[] = Array.isArray(clinicsRaw) ? clinicsRaw : [];
  const appointments: AppointmentRow[] = Array.isArray(apptsRaw) ? apptsRaw : [];
  const calls: any[] = Array.isArray(callsRaw) ? callsRaw : [];

  // ---------- Metric Cards ----------
  const totalCalls = calls.length;
  const booked = calls.filter((c) => /booked/i.test(c.status ?? "")).length;
  const rescheduled = calls.filter((c) => /resched/i.test(c.status ?? "")).length;
  const cancelled = calls.filter((c) => /cancel/i.test(c.status ?? "")).length;

  const weekly = {
    callsHandled: totalCalls,
    stats: [
      { label: "Appointments booked", value: booked },
      { label: "Rescheduled", value: rescheduled },
      { label: "Cancelled", value: cancelled },
    ],
  };

  // ---------- Build Completed + Upcoming Clinics ----------
  const completedClinics: any[] = [];
  const upcomingClinics: any[] = [];

  for (const cl of clinics) {
    const clinicAppointments = appointments.filter(
      (a) =>
        String(a.clinic_id).trim().toLowerCase() ===
        String(cl.id).trim().toLowerCase()
    );

    if (clinicAppointments.length === 0) continue;

    // ✅ Get the latest date in the sheet for that clinic
    const sortedDates = clinicAppointments
      .map((a) => a.date)
      .filter(Boolean)
      .sort();
    const latestDate = sortedDates[sortedDates.length - 1];
    const cap = Number(cl.capacity ?? 0) || 0;

    // ✅ Count by simplified 3 statuses
    const attended = clinicAppointments.filter(
      (a) => a.date === latestDate && /attend/i.test(a.status ?? "")
    ).length;

    const noShows = clinicAppointments.filter(
      (a) => a.date === latestDate && /no\s*show/i.test(a.status ?? "")
    ).length;

    const followupsNeeded = clinicAppointments.filter(
      (a) => a.date === latestDate && /follow/i.test(a.status ?? "")
    ).length;

    // ✅ Completed Clinic object
    const completed = {
      id: cl.id,
      name: cl.name,
      date: formatDate(new Date(latestDate)),
      time: `${cl.weekday} ${formatTime24to12(cl.start_time)}–${formatTime24to12(cl.end_time)}`,
      capacity: cap,
      attended,
      noShows,
      followupsNeeded,
    };

    // ✅ Upcoming Clinic object
    const upcoming = {
      id: cl.id,
      name: cl.name,
      date: formatDate(new Date(latestDate)), // uses latest available date
      time: `${cl.weekday} ${formatTime24to12(cl.start_time)}–${formatTime24to12(cl.end_time)}`,
      capacity: cap,
      booked: clinicAppointments.filter(
        (a) => /appointment/i.test(a.status ?? "")
      ).length,
    };

    completedClinics.push(completed);
    upcomingClinics.push(upcoming);
  }

  // ---------- UI ----------
  return (
    <div className="max-w-3xl mx-auto px-6">
      <TopBar />

      <StatBar
        title={`${weekly.callsHandled} calls handled this week`}
        stats={weekly.stats}
        cta={<Link className="link" href="/calls">View all calls →</Link>}
      />

      <div className="card p-4 mt-4 bg-amber-50/60 border-amber-100">
        <div className="text-amber-700 text-sm">🗓 Completed Clinic</div>
        <div className="text-xs text-amber-600">
          Review patients below and trigger AI to book follow-up appointments
        </div>
      </div>

      {/* Completed Clinics */}
      <div className="mt-8">
        <div className="sub uppercase">Completed Clinic</div>
        <div className="mt-2">
          {completedClinics.map((c) => (
            <ClinicCard key={`${c.id}-completed`} c={c} completed />
          ))}
        </div>
      </div>

      {/* Upcoming Clinics */}
      <div className="mt-10">
        <div className="sub uppercase">Upcoming Clinic</div>
        <div className="mt-2">
          {upcomingClinics.map((c) => (
            <ClinicCard key={`${c.id}-upcoming`} c={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
