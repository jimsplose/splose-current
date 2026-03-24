"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Pagination,
  Badge,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
  Toggle,
  usePagination,
} from "@/components/ds";
import { Sparkles, X } from "lucide-react";
import { useFormModal } from "@/hooks/useFormModal";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
import { formatTimestamp } from "@/lib/format";

const templates = [
  {
    title: "Exercise Physiology Follow-up Report",
    createdAt: "4:39 pm, 16 Oct 2023",
    hasAi: true,
  },
  {
    title: "ST | Note",
    createdAt: "3:35 pm, 5 Jun 2024",
    hasAi: true,
  },
  {
    title: "Standard Consultation. 123",
    createdAt: "11:32 am, 12 Jun 2024",
    hasAi: false,
  },
  {
    title: "Standard Consultation",
    createdAt: "8:21 pm, 5 Mar 2014",
    hasAi: false,
  },
  {
    title: "Initial Consultation",
    createdAt: "8:21 pm, 5 Mar 2014",
    hasAi: false,
  },
];

export default function ProgressNotesPage() {
  const router = useRouter();
  const [templateList, setTemplateList] = useState(templates);
  const [showBanner, setShowBanner] = useState(true);
  const { paged, paginationProps } = usePagination(templateList, { pageKey: "/settings/progress-notes" });

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } =
    useFormModal<{ title: string; hasAi: boolean }>({
      defaults: { title: "", hasAi: false },
      onSave: (values, index) => {
        if (index !== null) {
          setTemplateList((prev) =>
            prev.map((t, i) =>
              i === index ? { title: values.title, createdAt: t.createdAt, hasAi: values.hasAi } : t,
            ),
          );
        } else {
          const now = formatTimestamp();
          setTemplateList((prev) => [...prev, { title: values.title, createdAt: now, hasAi: values.hasAi }]);
        }
      },
    });

  function handleAction(value: string, index: number) {
    if (value === "edit") {
      router.push(`/settings/progress-notes/edit/${index + 1}`);
      return;
    }
  }

  return (
    <div className="p-6">
      <PageHeader title="Progress note templates">
        <Button variant="secondary">Show archived</Button>
        <Button variant="primary" onClick={openCreate}>+ New template</Button>
      </PageHeader>

      {showBanner && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3">
          <Badge variant="purple">New</Badge>
          <p className="flex-1 text-sm text-text">
            Add AI blocks to templates to generate instant drafts, every
            session. Try a template{" "}
            <a href="#" className="font-medium text-primary underline">
              created by splose
            </a>
            .
          </p>
          <Button
            variant="icon"
            size="sm"
            className="shrink-0 hover:bg-purple-100 hover:text-text"
            onClick={() => setShowBanner(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <p className="mb-4 text-sm text-text-secondary">
        Create templates for any appointment type to save time and keep
        documentation consistent. Add tables, auto-fill placeholders,
        interactive fields and AI blocks.
      </p>

      <SearchBar placeholder="Search for title" />

      <DataTable>
        <TableHead>
          <Th>Title</Th>
          <Th>Created at</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {paged.map((t, i) => (
            <Tr key={t.title + i}>
              <Td>
                <div className="flex items-center gap-2">
                  {t.hasAi && (
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  <span className="text-text">{t.title}</span>
                </div>
              </Td>
              <Td>{t.createdAt}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={STANDARD_SETTINGS}
                  onSelect={(value) => handleAction(value, i)}
                />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination {...paginationProps} showPageSize={false} />
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit progress note template" : "New progress note template"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Title" value={form.title} onChange={(e) => setField("title", e.target.value)} />
          <Toggle label="AI-powered" checked={form.hasAi} onChange={(v) => setField("hasAi", v)} />
        </div>
      </Modal>
    </div>
  );
}
