export default function TopBar({ right }: { right?: React.ReactNode }) {
    return (
      <div className="flex items-center justify-between py-6">
        <div>
          <p className="text-sm text-gray-400">Welcome,</p>
          <h1 className="text-xl font-semibold">Dr Mangattil Rajesh 👋</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">THURSDAY • 1:00 PM</p>
          <p className="text-sm text-gray-500">Weekly Overview</p>
        </div>
        {right}
      </div>
    );
  }
  