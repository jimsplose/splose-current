import { prisma } from "@/lib/prisma";
import CalendarView from "./CalendarView";

export const dynamic = "force-dynamic";

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
    return d.toISOString().split("T")[0];
  });

  const weekStartStr = weekDates[0];
  const weekEndStr = weekDates[6];

  const [appointments, practitioners] = await Promise.all([
    prisma.appointment.findMany({
      where: { date: { gte: weekStartStr, lte: weekEndStr } },
      include: { client: true, practitioner: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.practitioner.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Serialize for client component
  const serializedAppointments = appointments.map((a) => ({
    id: a.id,
    date: a.date,
    startTime: a.startTime,
    endTime: a.endTime,
    status: a.status,
    type: a.type,
    location: a.location,
    notes: a.notes,
    clientName: `${a.client.firstName} ${a.client.lastName}`,
    practitionerName: a.practitioner.name,
    practitionerColor: a.practitioner.color,
  }));

  const serializedPractitioners = practitioners.map((p) => ({
    id: p.id,
    name: p.name,
    color: p.color,
  }));

  return (
    <CalendarView
      appointments={serializedAppointments}
      practitioners={serializedPractitioners}
      todayStr={todayStr}
      weekDates={weekDates}
    />
  );
}
