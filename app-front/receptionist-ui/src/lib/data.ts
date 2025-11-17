// ----- Types
export type Clinic = {
    id: string;
    name: string;
    date: string;          // "Oct 16"
    time: string;          // "Wednesday 2–6 PM"
    status: "Completed" | "Pending";
    attended: number;
    cancelled: number;
    noShows: number;
    followupsNeeded?: number;
    capacity?: number;     // for upcoming slots
    booked?: number;
    note?: string;
    patients?: Patient[];
  };
  
  export type Patient = {
    id: string;
    time: string;          // "5:00 PM"
    name: string;
    subtitle: string;      // "Neck pain • BUPA"
    ribbons?: Array<"Need follow-up?"|"No show"|"No follow-up required"|"MRI follow-up scheduled">;
    status?: "Confirmed" | "Completed" | "No-Show";
  };
  
  export type Call = {
    id: string;
    when: string;          // "Oct 16 • 11:05 AM"
    name: string;
    direction: "Inbound" | "Outbound";
    reason: string;        // "MRI review"
    duration: string;      // "2m 18s"
    status: "Appointment Booked" | "Rescheduled" | "Cancelled";
    details?: {
      age?: string;
      note?: string;
      appt?: string;
      insurance?: string;
      phone?: string;
      email?: string;
      recordingUrl?: string;
    };
  };
  
  // ----- Dashboard header stats (this week)
  export const weekly = {
    callsHandled: 20,
    stats: [
      { label: "Appointments booked", value: 18 },
      { label: "Attended", value: 16 },
      { label: "Rescheduled", value: 3 },
      { label: "Cancelled", value: 1 },
      { label: "No Show", value: 2 },
    ],
  };
  
  // ----- Clinics
  export const completedClinics: Clinic[] = [
    {
      id: "london",
      name: "London Clinic",
      date: "Oct 16",
      time: "Wednesday 2–6 PM",
      status: "Completed",
      attended: 6, cancelled: 1, noShows: 2,
      followupsNeeded: 4,
      patients: [
        { id:"p1", time:"5:00 PM", name:"Sophie Brown", subtitle:"Neck pain • BUPA", ribbons:["Need follow-up?","No show","No follow-up required"], status:"Confirmed" },
        { id:"p2", time:"5:00 PM", name:"Sophie Brown", subtitle:"Neck pain • BUPA", ribbons:["Need follow-up?","No show","No follow-up required"], status:"Confirmed" },
        { id:"p3", time:"5:00 PM", name:"Maria Garcia", subtitle:"Lower back pain • BUPA", ribbons:["MRI follow-up scheduled"], status:"Completed" },
        { id:"p4", time:"5:00 PM", name:"Patricia Moore", subtitle:"Follow-up • BUPA", ribbons:["No show"], status:"No-Show" },
      ],
    },
    {
      id: "princess",
      name: "Princess Grace",
      date: "Oct 15",
      time: "Tuesday 5–8 PM",
      status: "Completed",
      attended: 6, cancelled: 1, noShows: 2,
      followupsNeeded: 1,
    },
  ];
  
  export const upcomingClinics: Clinic[] = [
    {
      id:"princess-up",
      name:"Princess Grace",
      date:"Oct 22",
      time:"Tuesday 5–8 PM",
      status:"Pending",
      capacity: 9, booked: 4, attended:6, cancelled:0, noShows:0,
      note:"1 not confirmed yet"
    },
    {
      id:"london-up",
      name:"London Clinic",
      date:"Oct 23",
      time:"Wednesday 2–6 PM",
      status:"Pending",
      capacity: 12, booked: 3, attended:6, cancelled:0, noShows:0,
      note:"1 not confirmed yet"
    }
  ];
  
  // ----- Calls
  export const calls: Call[] = [
    { id:"c1", when:"Oct 16 • 11:05 AM", name:"Emma Knight", direction:"Inbound", reason:"MRI review", duration:"2m 18s", status:"Appointment Booked",
      details:{
        age:"38 years old",
        note:"Patient called to confirm Wednesday 3pm appointment. Asked about parking directions sent via email.",
        appt:"Oct 23 • 3:00 PM",
        insurance:"Self-pay",
        phone:"+447411506193",
        email:"emmaknight@gmail.com",
        recordingUrl:"#"
      }
    },
    { id:"c2", when:"Oct 16 • 9:14 AM", name:"Sarah Henderson", direction:"Inbound", reason:"Lower back pain", duration:"3m 42s", status:"Appointment Booked"},
    { id:"c3", when:"Oct 15 • 4:20 PM", name:"Michael Davis", direction:"Outbound", reason:"Gap Fill • Shoulder pain", duration:"2m 35s", status:"Appointment Booked"},
    { id:"c4", when:"Oct 15 • 2:15 PM", name:"Rachel Green", direction:"Inbound", reason:"Back pain consultation", duration:"4m 10s", status:"Appointment Booked"},
    { id:"c5", when:"Oct 15 • 11:40 AM", name:"David Wilson", direction:"Inbound", reason:"Follow-up", duration:"1m 25s", status:"Rescheduled"},
    { id:"c6", when:"Oct 15 • 9:05 AM", name:"Sophie Martinez", direction:"Inbound", reason:"Call", duration:"2m 50s", status:"Cancelled"},
  ];
  