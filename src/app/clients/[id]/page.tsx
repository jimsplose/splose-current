import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientDetailClient from "./ClientDetailClient";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) notFound();

  return <ClientDetailClient client={client} />;
}
