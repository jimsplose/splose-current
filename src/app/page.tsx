import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const [todayAppointments, unsignedNotes] = await Promise.all([
    prisma.appointment.findMany({
      where: { date: new Date().toISOString().split("T")[0] },
      include: { client: true, practitioner: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.clinicalNote.findMany({
      where: { signed: false },
      include: { client: true, practitioner: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return { todayAppointments, unsignedNotes };
}

export default async function Dashboard() {
  const data = await getDashboardData();

  // Serialize data for client component (strip non-serializable fields)
  const todayAppointments = data.todayAppointments.map((a) => ({
    id: a.id,
    startTime: a.startTime,
    type: a.type,
    client: { firstName: a.client.firstName, lastName: a.client.lastName },
    practitioner: { name: a.practitioner.name, color: a.practitioner.color },
  }));

  const unsignedNotes = data.unsignedNotes.map((n) => ({
    id: n.id,
    date: n.date,
    client: { firstName: n.client.firstName, lastName: n.client.lastName },
    practitioner: { name: n.practitioner.name },
  }));

  return (
    <DashboardClient
      todayAppointments={todayAppointments}
      unsignedNotes={unsignedNotes}
    />
  );
}
