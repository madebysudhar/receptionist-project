import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // MOCK ONLY — replace later with real auth
  if (username === "admin" && password === "password123") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("auth", "1", { httpOnly: true, path: "/" });
    res.headers.set("Location", "/dashboard");
    return res;
  }
  return new NextResponse(JSON.stringify({ ok:false, error:"Invalid" }), { status: 401 });
}
