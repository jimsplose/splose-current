import { prisma } from "@/lib/prisma";
import ClientsPageClient from "./ClientsPageClient";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    where: { active: true },
    include: {
      _count: {
        select: { appointments: true, invoices: true },
      },
    },
    orderBy: { lastName: "asc" },
  });

  return (
    <ClientsPageClient
      clients={clients.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        dateOfBirth: c.dateOfBirth,
        phone: c.phone,
        email: c.email,
        ndisNumber: c.ndisNumber,
        medicare: c.medicare,
      }))}
    />
  );
}
