import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AppointmentSidePanel from "./AppointmentSidePanel";

export const dynamic = "force-dynamic";

export default async function ClientAppointmentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      appointments: {
        include: { practitioner: true },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!client) notFound();

  const appointments = client.appointments.map((appt) => ({
    id: appt.id,
    date: appt.date,
    startTime: appt.startTime,
    endTime: appt.endTime,
    type: appt.type,
    status: appt.status,
    practitioner: { id: appt.practitioner.id, name: appt.practitioner.name },
  }));

  return (
    <AppointmentSidePanel
      appointments={appointments}
      client={{
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
      }}
    />
  );
}
