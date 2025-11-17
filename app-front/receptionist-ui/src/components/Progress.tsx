export default function Progress({ value, max }: { value:number; max:number }) {
    const pct = Math.round((value/max)*100);
    return (
      <div className="mt-2">
        <div className="h-1.5 bg-gray-200 rounded-full">
          <div className="h-1.5 bg-teal-700 rounded-full" style={{ width:`${pct}%` }}/>
        </div>
        <div className="sub mt-1">{value} / {max} slots ({pct}%)</div>
      </div>
    );
  }
  