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
  const serializedAppointments = appointments.map((a: Record<string, unknown> & { client: Record<string, unknown>; practitioner: Record<string, unknown> }) => ({
    id: a.id as string,
    date: a.date as string,
    startTime: a.startTime as string,
    endTime: a.endTime as string,
    status: a.status as string,
    type: a.type as string,
    location: a.location as string | null,
    notes: a.notes as string | null,
    clientName: `${a.client.firstName} ${a.client.lastName}`,
    practitionerName: a.practitioner.name as string,
    practitionerColor: a.practitioner.color as string,
  }));

  const serializedPractitioners = practitioners.map((p: Record<string, unknown>) => ({
    id: p.id as string,
    name: p.name as string,
    color: p.color as string,
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
