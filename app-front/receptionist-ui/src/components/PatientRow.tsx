export default function PatientRow({
    time,name,subtitle,ribbons,status
  }:{time:string;name:string;subtitle:string;ribbons?:string[];status?:string}) {
    return (
      <div className="py-6 border-b border-gray-100 flex items-start justify-between">
        <div>
          <div className="sub">{time}</div>
          <div className="mt-1 text-lg font-medium">{name}</div>
          <div className="sub">{subtitle}</div>
          {ribbons &&
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              {ribbons.map((r,i)=>(<span key={i} className="hover:underline cursor-pointer">{r}</span>))}
            </div>
          }
        </div>
        <div>
          {status === "Confirmed" && <span className="badge bg-emerald-50 text-emerald-700">🗓 Confirmed</span>}
          {status === "Completed" && <span className="badge bg-emerald-50 text-emerald-700">✓ Completed</span>}
          {status === "No-Show" && <span className="badge bg-rose-50 text-rose-600">🚫 No-Show</span>}
        </div>
      </div>
    );
  }
  