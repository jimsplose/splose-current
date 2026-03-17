import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8am to 6pm

export default async function CalendarPage() {
  const today = new Date().toISOString().split("T")[0];
  const appointments = await prisma.appointment.findMany({
    where: { date: today },
    include: { client: true, practitioner: true },
    orderBy: { startTime: "asc" },
  });

  const practitioners = await prisma.practitioner.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <div className="p-6">
        {/* Calendar toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button className="rounded-lg p-2 hover:bg-surface">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="rounded-lg p-2 hover:bg-surface">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-lg font-semibold">
              {new Date().toLocaleDateString("en-AU", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-border bg-surface">
              <button className="rounded-l-lg bg-primary px-3 py-1.5 text-sm font-medium text-white">
                Day
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-background">
                Week
              </button>
              <button className="rounded-r-lg px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-background">
                Month
              </button>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              <Plus className="h-4 w-4" />
              New Appointment
            </button>
          </div>
        </div>

        {/* Day view with practitioner columns */}
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {/* Practitioner headers */}
          <div className="flex border-b border-border">
            <div className="w-20 shrink-0 border-r border-border p-3" />
            {practitioners.map((p) => (
              <div
                key={p.id}
                className="flex flex-1 items-center gap-2 border-r border-border p-3 last:border-r-0"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-sm font-medium">{p.name}</span>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="relative">
            {HOURS.map((hour) => (
              <div key={hour} className="flex border-b border-border last:border-b-0">
                <div className="flex w-20 shrink-0 items-start justify-end border-r border-border p-2">
                  <span className="text-xs text-text-secondary">
                    {hour === 12 ? "12:00 PM" : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                  </span>
                </div>
                {practitioners.map((p) => {
                  const hourAppts = appointments.filter(
                    (a) =>
                      a.practitionerId === p.id &&
                      parseInt(a.startTime.split(":")[0]) === hour
                  );
                  return (
                    <div
                      key={p.id}
                      className="relative flex-1 border-r border-border p-1 last:border-r-0"
                      style={{ minHeight: "4rem" }}
                    >
                      {hourAppts.map((appt) => (
                        <div
                          key={appt.id}
                          className="mb-1 cursor-pointer rounded-md p-2 text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: p.color }}
                        >
                          <p className="text-xs font-medium">
                            {appt.client.firstName} {appt.client.lastName}
                          </p>
                          <p className="text-xs opacity-80">
                            {appt.startTime} - {appt.endTime}
                          </p>
                          <div className="mt-1">
                            <StatusBadge status={appt.status} />
                          </div>
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
    </>
  );
}
