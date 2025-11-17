// src/lib/sheets.ts
// ------------------------------------------------------------
// ✅ Fetch data directly from Google Sheets API (no script needed)
// ------------------------------------------------------------

const SHEET_ID = "1AwaDbDMEkop0lYPemzTLQpY4f_QOFmRxk8n6OhsVVXs";
const API_KEY = "AIzaSyDvwnR_O602V0EzPBLZXHjZJs-cyUjB_yw";

// Base URL for Google Sheets API
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

/**
 * Generic sheet fetcher
 * Converts tab rows → array of objects using header row
 */
async function fetchSheet(tab: string) {
  try {
    const range = `${encodeURIComponent(tab)}!A:Z`; // covers all columns A–Z
    const res = await fetch(`${BASE_URL}/${range}?key=${API_KEY}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`❌ Failed to load ${tab}: ${res.statusText}`);
    }

    const json = await res.json();

    // Extract header and rows
    const [header, ...rows] = json.values || [];
    if (!header || !rows.length) return [];

    // Map rows to objects
    const data = rows.map((row: string[]) => {
      const obj: Record<string, string> = {};
      header.forEach((key: string, i: number) => {
        obj[key.trim()] = row[i] ?? "";
      });
      return obj;
    });

    console.log(`✅ ${tab} fetched (${data.length} rows)`);
    return data;
  } catch (err) {
    console.error(`🔥 Error fetching ${tab}:`, err);
    return [];
  }
}

// ---------- Individual fetchers ----------
export async function fetchClinics() {
  return fetchSheet("Clinics");
}

export async function fetchAppointments() {
  return fetchSheet("Appointments");
}

export async function fetchCalls() {
  return fetchSheet("Calls");
}
