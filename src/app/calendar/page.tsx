import { prisma } from "@/lib/prisma";
import { ChevronLeft, ChevronRight, Filter, Settings2, LayoutGrid, Search } from "lucide-react";

export const dynamic = "force-dynamic";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8am to 6pm
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function CalendarPage() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Generate week dates
  const dayOfWeek = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const weekStartStr = weekDates[0].toISOString().split("T")[0];
  const weekEndStr = weekDates[6].toISOString().split("T")[0];

  // Fetch ALL appointments for the week
  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: weekStartStr, lte: weekEndStr },
    },
    include: { client: true, practitioner: true },
    orderBy: { startTime: "asc" },
  });

  const practitioners = await prisma.practitioner.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const monthYear = today.toLocaleDateString("en-AU", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      {/* Calendar toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
            Today
          </button>
          <div className="flex items-center gap-1">
            <button className="rounded p-1 hover:bg-gray-100">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="rounded p-1 hover:bg-gray-100">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-lg font-semibold text-text">{monthYear}</h2>
          <div className="flex items-center gap-2 ml-2 text-text-secondary">
            <button className="rounded p-1 hover:bg-gray-100"><Filter className="h-4 w-4" /></button>
            <button className="rounded p-1 hover:bg-gray-100"><Settings2 className="h-4 w-4" /></button>
            <button className="rounded p-1 hover:bg-gray-100"><LayoutGrid className="h-4 w-4" /></button>
            <button className="rounded p-1 hover:bg-gray-100"><Search className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border bg-white px-3 py-1 text-sm text-text">
            Practitioners({practitioners.length})
          </span>
          <span className="text-sm text-text-secondary">Calendar</span>
          <select className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text">
            <option>Week</option>
            <option>Month</option>
            <option>Day</option>
          </select>
        </div>
      </div>

      {/* Week header */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
        <div className="border-r border-border" />
        {weekDates.map((date, i) => {
          const dateStr = date.toISOString().split("T")[0];
          const isToday = dateStr === todayStr;
          return (
            <div
              key={i}
              className={`border-r border-border px-2 py-2 text-center last:border-r-0 ${isToday ? "bg-purple-50" : ""}`}
            >
              <div className="text-xs text-text-secondary">{DAYS[i]}</div>
              <div className={`text-lg font-semibold ${isToday ? "text-primary" : "text-text"}`}>
                {date.getDate()}
              </div>
              {/* Location + practitioner names */}
              <div className="mt-0.5 text-[10px] text-text-secondary truncate">
                Splose Demo Clinic
              </div>
              <div className="flex justify-center gap-1 text-[10px] text-text-secondary truncate">
                {practitioners.map((p) => (
                  <span key={p.id} className="truncate">{p.name.split(" ")[0]} {p.name.split(" ")[1]?.[0]}.</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              <div className="flex items-start justify-end border-b border-r border-border px-2 py-1" style={{ minHeight: "60px" }}>
                <span className="text-[11px] text-text-secondary -mt-1.5">
                  {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </span>
              </div>
              {weekDates.map((date, dayIdx) => {
                const dateStr = date.toISOString().split("T")[0];
                const isToday = dateStr === todayStr;
                const hourAppts = appointments.filter(
                  (a) =>
                    a.date === dateStr &&
                    parseInt(a.startTime.split(":")[0]) === hour
                );
                return (
                  <div
                    key={dayIdx}
                    className={`relative border-b border-r border-border last:border-r-0 ${isToday ? "bg-purple-50/30" : ""}`}
                    style={{ minHeight: "60px" }}
                  >
                    {hourAppts.map((appt) => (
                      <div
                        key={appt.id}
                        className="absolute inset-x-1 top-1 cursor-pointer rounded px-1.5 py-1 text-white shadow-sm"
                        style={{
                          backgroundColor: appt.practitioner.color,
                          opacity: appt.status === "Cancelled" ? 0.5 : 1,
                        }}
                      >
                        <p className="text-xs font-medium truncate">
                          {appt.client.firstName} {appt.client.lastName}
                        </p>
                        <p className="text-[10px] opacity-80">{appt.startTime}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
