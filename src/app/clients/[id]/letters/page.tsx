import { Plus, MoreHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

const lettersData = [
  {
    id: "1",
    title: "DVA",
    location: "East Clinics",
    writtenBy: "Hung Yee Wong",
    createdAt: "4:54 pm, 5 Mar 2026",
    lastUpdated: "4:54 pm, 5 Mar 2026",
  },
];

export default async function ClientLettersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void id;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">Letters</h1>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          <Plus className="h-4 w-4" />
          New letter
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Location</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Written by</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Created at</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Last updated</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lettersData.map((letter) => (
              <tr key={letter.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-text">{letter.title}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{letter.location}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{letter.writtenBy}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{letter.createdAt}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{letter.lastUpdated}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-text-secondary hover:text-text">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-1 of 1 items</span>
          <div className="ml-4 flex items-center gap-1">
            <span>&lt;</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">1</button>
            <span>&gt;</span>
          </div>
          <span className="ml-4">10 / page</span>
        </div>
      </div>
    </div>
  );
}
