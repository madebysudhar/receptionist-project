// Reusable types for your app

export type Call = {
  id: string;
  when: string;              // ISO string from sheet (or text)
  name: string;
  direction: "Inbound" | "Outbound";
  reason: string;
  status: "Appointment Booked" | "Rescheduled" | "Cancelled";

  // numbers / optional fields
  duration_sec?: number;
  age?: number;

  // appointment info (optional on some rows)
  appt_date?: string;        // ISO date like "2025-10-22T18:30:00.000Z"
  appt_time?: string;        // "1899-12-30T..." or plain "3:00 PM"

  // admin info
  clinic_id?: "london" | "princess";
  insurance?: string;
  email?: string;
  phone?: string;
  recording_url?: string;
  note?: string;
};

// (You can add Clinic/Appointment later as we hook up the dashboard)
