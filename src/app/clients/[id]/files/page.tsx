"use client";

import { useState } from "react";
import { ArrowUpDown, FolderPlus, ChevronDown, FileText } from "lucide-react";
import { Button, Card, DataTable, PageHeader, SearchBar, TableHead, Th, TableBody, Tr, Td, Pagination, Dropdown, DropdownTriggerButton, Modal, FormInput } from "@/components/ds";

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

export default function ClientFilesPage() {
  const [renameModal, setRenameModal] = useState<{ open: boolean; fileId: string; fileName: string }>({
    open: false,
    fileId: "",
    fileName: "",
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; fileId: string; fileName: string }>({
    open: false,
    fileId: "",
    fileName: "",
  });
  const [downloadToast, setDownloadToast] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  function handleAction(value: string, file: (typeof filesData)[number]) {
    if (value === "download") {
      setDownloadToast(true);
      setTimeout(() => setDownloadToast(false), 2000);
    } else if (value === "rename") {
      setRenameValue(file.name);
      setRenameModal({ open: true, fileId: file.id, fileName: file.name });
    } else if (value === "delete") {
      setDeleteModal({ open: true, fileId: file.id, fileName: file.name });
    }
  }

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
              <Tr key={file.id}>
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
                    onSelect={(val) => handleAction(val, file)}
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination totalItems={filesData.length} itemsPerPage={10} />
      </Card>

      {/* Download toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-gray-800 px-4 py-3 text-body-md text-white shadow-lg">
          Downloading...
        </div>
      )}

      {/* Rename modal */}
      <Modal
        open={renameModal.open}
        onClose={() => setRenameModal({ open: false, fileId: "", fileName: "" })}
        title="Rename file"
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenameModal({ open: false, fileId: "", fileName: "" })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setRenameModal({ open: false, fileId: "", fileName: "" })}>
              Rename
            </Button>
          </>
        }
      >
        <FormInput label="File name" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, fileId: "", fileName: "" })}
        title="Delete file"
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, fileId: "", fileName: "" })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setDeleteModal({ open: false, fileId: "", fileName: "" })}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-body-md text-text-secondary">
          Are you sure you want to delete <strong className="text-text">{deleteModal.fileName}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
