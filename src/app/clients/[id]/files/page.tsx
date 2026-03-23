import { ArrowUpDown, FolderPlus, ChevronDown, FileText } from "lucide-react";
import { Button, Card, DataTable, PageHeader, SearchBar, TableHead, Th, TableBody, Td, Pagination, Dropdown, DropdownTriggerButton } from "@/components/ds";

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

const dropdownItems = [
  { label: "Download", value: "download" },
  { label: "Rename", value: "rename" },
  { label: "", value: "divider-1", divider: true },
  { label: "Delete", value: "delete", danger: true },
];

export default async function ClientFilesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  void id;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <PageHeader title="Files /">
        <Button>
          <FolderPlus className="h-4 w-4" />
          New folder
        </Button>
        <Button>Show deleted files</Button>
        <Button>
          Upload
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PageHeader>

      <SearchBar placeholder="Search for file name" />

      <Card padding="none" className="overflow-x-auto">
        <DataTable>
          <TableHead>
            <Th>
              <span className="inline-flex items-center gap-1">
                Name <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
              </span>
            </Th>
            <Th>Uploader</Th>
            <Th>
              <span className="inline-flex items-center gap-1">
                Upload date <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
              </span>
            </Th>
            <Th>
              <span className="inline-flex items-center gap-1">
                File size <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
              </span>
            </Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {filesData.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <Td>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-text-secondary" />
                    <span className="text-text">{file.name}</span>
                  </div>
                </Td>
                <Td className="text-text-secondary">{file.uploader || "—"}</Td>
                <Td className="text-text-secondary">{file.uploadDate}</Td>
                <Td className="text-text-secondary">{file.fileSize}</Td>
                <Td align="right">
                  <Dropdown
                    align="right"
                    trigger={<DropdownTriggerButton />}
                    items={dropdownItems}
                    onSelect={() => {}}
                  />
                </Td>
              </tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination totalItems={filesData.length} itemsPerPage={10} />
      </Card>
    </div>
  );
}
