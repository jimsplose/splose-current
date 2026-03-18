import { Search, MoreHorizontal, ArrowUpDown, FolderPlus, ChevronDown, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

const filesData = [
  {
    id: "1",
    name: "COND FORM A (1).pdf",
    uploader: "",
    uploadDate: "12:28 pm, 11 Mar 2026",
    fileSize: "36.5 KB",
  },
  {
    id: "2",
    name: "COND FORM A (1).pdf",
    uploader: "",
    uploadDate: "12:28 pm, 11 Mar 2026",
    fileSize: "36.5 KB",
  },
];

export default async function ClientFilesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void id;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">Files /</h1>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            <FolderPlus className="h-4 w-4" />
            New folder
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Show deleted files
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Upload
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for file name"
          className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <span className="inline-flex items-center gap-1">
                  Name <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Uploader</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <span className="inline-flex items-center gap-1">
                  Upload date <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <span className="inline-flex items-center gap-1">
                  File size <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
                </span>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filesData.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-text-secondary" />
                    <span className="text-text">{file.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{file.uploader || "—"}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{file.uploadDate}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{file.fileSize}</td>
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
          <span>1-{filesData.length} of {filesData.length} items</span>
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
