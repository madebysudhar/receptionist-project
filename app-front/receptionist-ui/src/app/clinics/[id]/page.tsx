import Link from "next/link";
import { fetchClinics, fetchAppointments } from "@/lib/sheets";

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
  time?: string;
  patient_name?: string;
  status?: string;
  reason?: string;
  notes?: string;
};

// ---------- Helper ----------
function formatTime24to12(time: string) {
  if (!time) return "";
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

const WEEKDAY_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// ---------- Local timezone helpers ----------
function previousDate(from: Date, targetDow: number) {
  const d = new Date(from);
  const diff = (d.getDay() - targetDow + 7) % 7;
  d.setDate(d.getDate() - (diff === 0 ? 7 : diff));
  return d;
}

function nextDate(from: Date, targetDow: number) {
  const d = new Date(from);
  const diff = (targetDow - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + (diff === 0 ? 7 : diff));
  return d;
}

function formatLocalISO(date: Date) {
  // avoids UTC date shift — keeps local date accurate
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ---------- Page ----------
export default async function ClinicDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // ✅ Unwrap both Promises
  const { id } = await params;
  const query = await searchParams;
  const type = typeof query.type === "string" ? query.type : null;

  // ---------- Fetch data ----------
  const [clinicsRaw, apptsRaw] = await Promise.all([
    fetchClinics(),
    fetchAppointments(),
  ]);

  const clinics = Array.isArray(clinicsRaw)
    ? (clinicsRaw as ClinicRow[])
    : [];
  const appointments = Array.isArray(apptsRaw)
    ? (apptsRaw as AppointmentRow[])
    : [];

  // ---------- Find this clinic ----------
  const cleanId = String(id || "").trim().toLowerCase();
  const clinic = clinics.find(
    (c) => String(c.id).trim().toLowerCase() === cleanId
  );

  if (!clinic) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 text-center text-slate-500">
        <p className="text-lg mb-4">Clinic not found</p>
        <Link href="/dashboard" className="text-teal-700 font-medium">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  // ---------- Determine correct target date ----------
  const today = new Date();
  const dow = WEEKDAY_MAP[String(clinic.weekday).toLowerCase()];
  const prev = previousDate(today, dow);
  const next = nextDate(today, dow);

  let targetDate: Date;
  if (type === "upcoming") targetDate = next;
  else if (type === "completed") targetDate = prev;
  else targetDate = prev; // default fallback

  const targetDateISO = formatLocalISO(targetDate);

  // ---------- Filter appointments ----------
  const clinicAppointments = appointments.filter(
    (a) =>
      String(a.clinic_id).trim().toLowerCase() === cleanId &&
      (a.date ?? "").startsWith(targetDateISO)
  );

  // ---------- Debug log ----------
  console.log("🔎 Clinic Detail Debug --------------------");
  console.log("Clinic ID:", cleanId);
  console.log("Clinic Weekday:", clinic.weekday);
  console.log("Clicked Type:", type);
  console.log("Target Date ISO:", targetDateISO);
  console.log("Appointments fetched:", appointments.length);
  console.log(
    "Appointments for this clinic:",
    appointments
      .filter((a) => String(a.clinic_id).trim().toLowerCase() === cleanId)
      .map((a) => ({ date: a.date, status: a.status }))
  );
  console.log("------------------------------------------");

  // ---------- Count follow-ups ----------
  const followupCount = clinicAppointments.filter((a) =>
    /^follow\s*up/i.test(a.status ?? "")
  ).length;

  // ---------- Build Patient List ----------
  const patientList = clinicAppointments.map((a, i) => ({
    id: i,
    time: formatTime24to12(a.time || "00:00"),
    name: a.patient_name || "Unnamed Patient",
    subtitle: a.reason || a.notes || "",
    ribbons: [
      a.status?.match(/no\s*show/i) ? "No show" : "",
      a.status?.match(/follow/i) ? "Follow-up needed" : "",
    ].filter(Boolean),
    status:
      /^attend/i.test(a.status ?? "")
        ? "Attended"
        : /^confirm/i.test(a.status ?? "")
        ? "Confirmed"
        : /^no\s*show/i.test(a.status ?? "")
        ? "No-Show"
        : "Pending",
  }));

  // ---------- Render ----------
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="py-6">
        <Link
          href="/dashboard"
          className="text-slate-500 hover:text-slate-700 text-sm"
        >
          ← Back to dashboard
        </Link>
      </div>

      <div className="text-xs uppercase text-slate-500 font-semibold">
        {type === "upcoming" ? "Upcoming Clinic" : "Completed Clinic"}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span>📍</span>
        <h1 className="text-xl font-semibold text-slate-800">
          {clinic.name}
        </h1>
      </div>

      <div className="text-slate-500 text-sm mt-1">
        {clinic.weekday} • {formatTime24to12(clinic.start_time)}–
        {formatTime24to12(clinic.end_time)}
      </div>

      {followupCount > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-100 p-4 rounded-lg">
          <span className="font-medium text-amber-800">
            {followupCount} patients need follow-up
          </span>
        </div>
      )}

      <div className="mt-8">
        <div className="text-xs uppercase text-slate-500 font-semibold">
          Patients List
        </div>

        <div className="mt-4 space-y-5">
          {patientList.map((p) => (
            <div
              key={p.id}
              className="flex items-start justify-between border-b border-slate-100 pb-3"
            >
              <div>
                <div className="text-sm text-slate-500">{p.time}</div>
                <div className="text-slate-800 font-medium">{p.name}</div>
                <div className="text-slate-500 text-sm">{p.subtitle}</div>
                <div className="flex gap-3 mt-1 text-xs text-slate-500">
                  {p.ribbons.map((r, i) => (
                    <span key={i}>{r}</span>
                  ))}
                </div>
              </div>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  p.status === "Confirmed"
                    ? "bg-emerald-50 text-emerald-700"
                    : p.status === "Completed"
                    ? "bg-teal-50 text-teal-700"
                    : p.status === "No-Show"
                    ? "bg-rose-50 text-rose-600"
                    : "bg-slate-50 text-slate-500"
                }`}
              >
                {p.status}
              </span>
            </div>
          ))}

          {patientList.length === 0 && (
            <div className="text-sm text-slate-500 italic">
              No appointments found for this clinic date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
