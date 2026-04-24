"use client";

import { useState } from "react";
import { SwapOutlined, FolderAddOutlined, DownOutlined, FileTextOutlined } from "@ant-design/icons";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Icon from "@/components/ds/Icon";
import { Card, PageHeader, SearchBar, Pagination, Dropdown, DropdownTriggerButton, Modal, FormInput, Text } from "@/components/ds";

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

  const columns: ColumnsType<typeof filesData[number]> = [
    {
      key: "name",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
          Name <Icon as={SwapOutlined} tone="secondary" />
        </Flex>
      ),
      render: (_, file) => (
        <Flex align="center" gap={8}>
          <Icon as={FileTextOutlined} tone="secondary" />
          <span>{file.name}</span>
        </Flex>
      ),
    },
    {
      key: "uploader",
      title: "Uploader",
      render: (_, file) => <Text variant="body/md" as="span" color="secondary">{file.uploader || "\u2014"}</Text>,
    },
    {
      key: "uploadDate",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
          Upload date <Icon as={SwapOutlined} tone="secondary" />
        </Flex>
      ),
      render: (_, file) => <Text variant="body/md" as="span" color="secondary">{file.uploadDate}</Text>,
    },
    {
      key: "fileSize",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
          File size <Icon as={SwapOutlined} tone="secondary" />
        </Flex>
      ),
      render: (_, file) => <Text variant="body/md" as="span" color="secondary">{file.fileSize}</Text>,
    },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, file) => (
        <Dropdown
          align="right"
          trigger={<DropdownTriggerButton />}
          items={dropdownItems}
          onSelect={(val) => handleAction(val, file)}
        />
      ),
    },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Files /">
        <Button>
          <Icon as={FolderAddOutlined} />
          New folder
        </Button>
        <Button>Show deleted files</Button>
        <Button>
          Upload
          <Icon as={DownOutlined} />
        </Button>
      </PageHeader>

      <SearchBar placeholder="Search for file name" />

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={paged}
          rowKey="id"
          pagination={false}
        />
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
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, fontSize: 14, borderRadius: 8, backgroundColor: '#1f2937', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, color: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
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
            <Button onClick={() => setRenameModal({ open: false, fileId: "", fileName: "" })}>
              Cancel
            </Button>
            <Button type="primary" onClick={() => setRenameModal({ open: false, fileId: "", fileName: "" })}>
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
            <Button onClick={() => setDeleteModal({ open: false, fileId: "", fileName: "" })}>
              Cancel
            </Button>
            <Button danger onClick={() => setDeleteModal({ open: false, fileId: "", fileName: "" })}>
              Delete
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Are you sure you want to delete <strong>{deleteModal.fileName}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
