import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { Button, Card, PageHeader, SearchBar, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

export const dynamic = "force-dynamic";

export default async function ClientNotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      clinicalNotes: {
        include: { practitioner: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) notFound();

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <PageHeader title="Progress notes">
        <Button>Scroll view</Button>
        <Button>+ New note</Button>
      </PageHeader>

      <SearchBar placeholder="Search for content and title" />

      <Card padding="none" className="overflow-x-auto">
        <table className="w-full">
          <TableHead>
            <Th>Name</Th>
            <Th>
              <div className="flex items-center gap-1">
                Created by
                <ArrowUpDown className="h-3 w-3 text-text-secondary" />
              </div>
            </Th>
            <Th>Service date</Th>
            <Th>Last update</Th>
            <Th>
              <div className="flex items-center gap-1">
                Created at
                <ArrowUpDown className="h-3 w-3 text-text-secondary" />
              </div>
            </Th>
          </TableHead>
          <TableBody>
            {client.clinicalNotes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-text-secondary">
                  No progress notes
                </td>
              </tr>
            ) : (
              client.clinicalNotes.map((note) => (
                <tr key={note.id} className="cursor-pointer hover:bg-gray-50">
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-secondary">»</span>
                      <span className="text-sm text-text">{note.template}</span>
                      {note.signed ? (
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-caption-sm font-medium text-green-700">
                          Final
                        </span>
                      ) : (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-caption-sm font-medium text-gray-600">
                          Draft
                        </span>
                      )}
                    </div>
                  </Td>
                  <Td className="text-text-secondary">{note.practitioner.name}</Td>
                  <Td className="cursor-pointer text-primary hover:underline">
                    {note.date ? formatDate(note.date) : "—"}
                  </Td>
                  <Td className="text-text-secondary">{formatDateTime(note.createdAt)}</Td>
                  <Td className="text-text-secondary">{formatDateTime(note.createdAt)}</Td>
                </tr>
              ))
            )}
          </TableBody>
        </table>
        <Pagination totalItems={client.clinicalNotes.length} itemsPerPage={10} />
      </Card>
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
