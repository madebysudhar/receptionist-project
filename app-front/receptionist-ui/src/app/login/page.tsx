"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(){
  const [username,setU]=useState("");
  const [password,setP]=useState("");
  const [err,setErr]=useState("");
  const router=useRouter();

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    setErr("");
    const r=await fetch("/api/login",{method:"POST",body:JSON.stringify({username,password})});
    if(r.ok){ router.push("/dashboard"); } else { setErr("Invalid credentials"); }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <form onSubmit={onSubmit} className="card w-[380px] p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Caringer Dashboard</h1>
        <div>
          <label className="sub">Username</label>
          <input className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600" value={username} onChange={e=>setU(e.target.value)} />
        </div>
        <div>
          <label className="sub">Password</label>
          <input type="password" className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600" value={password} onChange={e=>setP(e.target.value)} />
        </div>
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <button className="w-full bg-teal-700 text-white py-2 rounded-lg hover:opacity-90">Sign in</button>

      </form>
    </div>
  );
}
