"use client";

import { useState } from "react";
import { SwapOutlined, FolderAddOutlined, DownOutlined, FileTextOutlined } from "@ant-design/icons";
import { Flex } from "antd";
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filesData.length / pageSize);
  const paged = filesData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
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
    <div className="flex-1 overflow-y-auto p-6">
      <PageHeader title="Files /">
        <Button>
          <FolderAddOutlined style={{ fontSize: 16 }} />
          New folder
        </Button>
        <Button>Show deleted files</Button>
        <Button>
          Upload
          <DownOutlined style={{ fontSize: 16 }} />
        </Button>
      </PageHeader>

      <SearchBar placeholder="Search for file name" />

      <Card padding="none" className="overflow-x-auto">
        <DataTable>
          <TableHead>
            <Th>
              <Flex align="center" gap={4} component="span" className="inline-flex">
                Name <SwapOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
              </Flex>
            </Th>
            <Th>Uploader</Th>
            <Th>
              <Flex align="center" gap={4} component="span" className="inline-flex">
                Upload date <SwapOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
              </Flex>
            </Th>
            <Th>
              <Flex align="center" gap={4} component="span" className="inline-flex">
                File size <SwapOutlined style={{ fontSize: 14, color: 'var(--color-text-secondary)' }} />
              </Flex>
            </Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {paged.map((file) => (
              <Tr key={file.id}>
                <Td>
                  <Flex align="center" gap={8}>
                    <FileTextOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
                    <span>{file.name}</span>
                  </Flex>
                </Td>
                <Td className="text-text-secondary">{file.uploader || "\u2014"}</Td>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filesData.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* Download toast */}
      {downloadToast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, borderRadius: 8, backgroundColor: '#1f2937', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, color: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} className="text-body-md">
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
        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>
          Are you sure you want to delete <strong>{deleteModal.fileName}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
