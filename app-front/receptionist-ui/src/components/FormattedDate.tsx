"use client";

import { format } from "date-fns";

export default function FormattedDate({
  when,
  duration,
}: {
  when?: string;
  duration?: number;
}) {
  if (!when) return null;

  // 🕒 Format date and duration only on the client
  const formatted = format(new Date(when), "MMM d • h:mm a");

  const dur =
    typeof duration === "number" && duration > 0
      ? ` - ${Math.floor(duration / 60)}m ${duration % 60}s`
      : "";

  return (
    <div className="text-slate-500 text-sm">
      {formatted}
      {dur}
    </div>
  );
}
