"use client";

import { useState } from "react";
import { Flex } from "antd";
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
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
  FormSelect,
  Grid,
} from "@/components/ds";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

const initialTemplates = [
  { id: 1, name: "Full Body — Front", type: "Full body", createdAt: "5 Feb 2026", lastUpdate: "12 Mar 2026" },
  { id: 2, name: "Full Body — Back", type: "Full body", createdAt: "5 Feb 2026", lastUpdate: "12 Mar 2026" },
  { id: 3, name: "Upper Limb — Left", type: "Upper limb", createdAt: "20 Jan 2026", lastUpdate: "5 Feb 2026" },
  { id: 4, name: "Upper Limb — Right", type: "Upper limb", createdAt: "20 Jan 2026", lastUpdate: "5 Feb 2026" },
  { id: 5, name: "Lower Limb — Left", type: "Lower limb", createdAt: "20 Jan 2026", lastUpdate: "5 Feb 2026" },
  { id: 6, name: "Lower Limb — Right", type: "Lower limb", createdAt: "20 Jan 2026", lastUpdate: "5 Feb 2026" },
  { id: 7, name: "Head & Neck", type: "Head & neck", createdAt: "15 Dec 2025", lastUpdate: "20 Jan 2026" },
  { id: 8, name: "Hand — Left", type: "Hand", createdAt: "15 Dec 2025", lastUpdate: "15 Dec 2025" },
  { id: 9, name: "Hand — Right", type: "Hand", createdAt: "15 Dec 2025", lastUpdate: "15 Dec 2025" },
];

const typeOptions = [
  { value: "Full body", label: "Full body" },
  { value: "Upper limb", label: "Upper limb" },
  { value: "Lower limb", label: "Lower limb" },
  { value: "Head & neck", label: "Head & neck" },
  { value: "Hand", label: "Hand" },
  { value: "Foot", label: "Foot" },
  { value: "Spine", label: "Spine" },
];

const chartViewOptions = [
  { value: "Front", label: "Front" },
  { value: "Back", label: "Back" },
  { value: "Side", label: "Side" },
];

const bodyRegions = [
  "Head",
  "Neck",
  "Shoulders",
  "Arms",
  "Chest",
  "Abdomen",
  "Back",
  "Legs",
  "Feet",
] as const;

export default function BodyChartsPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [search, setSearch] = useState("");

  const [chartView, setChartView] = useState("Front");
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return next;
    });
  };

  const { modalOpen, isEditing, form, setField, openCreate: rawOpenCreate, openEdit: rawOpenEdit, closeModal: rawCloseModal, handleSave } = useFormModal<{
    name: string;
    type: string;
  }>({
    defaults: { name: "", type: "Full body" },
    onSave: (values, index) => {
      const now = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
      if (index !== null) {
        setTemplates((prev) => prev.map((t, i) => (i === index ? { ...t, name: values.name, type: values.type, lastUpdate: now } : t)));
      } else {
        setTemplates((prev) => [...prev, { id: Date.now(), name: values.name, type: values.type, createdAt: now, lastUpdate: now }]);
      }
    },
  });

  function openCreate() {
    setChartView("Front");
    setSelectedRegions(new Set());
    rawOpenCreate();
  }

  function openEdit(index: number, values: { name: string; type: string }) {
    setChartView("Front");
    setSelectedRegions(new Set());
    rawOpenEdit(index, values);
  }

  function closeModal() {
    setChartView("Front");
    setSelectedRegions(new Set());
    rawCloseModal();
  }

  const filtered = search
    ? templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    : templates;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index, { name: templates[index].name, type: templates[index].type });
  }

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Body chart templates">
        <Button variant="secondary">Show archived</Button>
        <Button variant="secondary" onClick={openCreate}>+ New template</Button>
      </PageHeader>

      <div style={{ marginBottom: 16 }}>
        <SearchBar placeholder="Search for body chart template" onSearch={setSearch} />
      </div>

      <DataTable>
        <TableHead>
          <Th sortable>Title</Th>
          <Th>Type</Th>
          <Th>Created at</Th>
          <Th>Last update</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {paged.map((t, i) => (
            <Tr key={t.id} hover>
              <Td><span className="text-body-md text-text" style={{ fontWeight: 500 }}>{t.name}</span></Td>
              <Td className="text-text-secondary">{t.type}</Td>
              <Td className="text-text-secondary">{t.createdAt}</Td>
              <Td className="text-text-secondary">{t.lastUpdate}</Td>
              <Td align="right">
                <Dropdown trigger={<DropdownTriggerButton />} items={STANDARD_SETTINGS} onSelect={(v) => handleAction(v, templates.indexOf(t))} align="right" />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} showPageSize={false} />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit body chart template" : "New body chart template"}
        footer={
          <Flex justify="flex-end" gap={8}>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </Flex>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name *" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. Full Body — Front" />
          <FormSelect label="Type" value={form.type} onChange={(value) => setField("type", value)} options={typeOptions} />
          <FormSelect label="Chart view" value={chartView} onChange={setChartView} options={chartViewOptions} />

          {/* Body region selector */}
          <div>
            <p className="text-label-lg" style={{ marginBottom: 8, color: 'var(--color-text-secondary)' }}>Body regions</p>
            <Grid cols={3} gap="sm">
              {bodyRegions.map((region) => (
                <label
                  key={region}
                  style={{
                    display: 'flex', cursor: 'pointer', alignItems: 'center', gap: 8, borderRadius: 8,
                    border: `1px solid ${selectedRegions.has(region) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    padding: '8px 12px', transition: 'all 0.2s',
                    backgroundColor: selectedRegions.has(region) ? 'rgba(var(--color-primary-rgb, 130, 80, 255), 0.05)' : undefined,
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ height: 16, width: 16, accentColor: 'var(--color-primary)' }}
                    checked={selectedRegions.has(region)}
                    onChange={() => toggleRegion(region)}
                  />
                  <span className="text-body-sm text-text">{region}</span>
                </label>
              ))}
            </Grid>
            {selectedRegions.size > 0 && (
              <p className="text-caption-md text-text-secondary" style={{ marginTop: 8 }}>
                {selectedRegions.size} region{selectedRegions.size !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        </Flex>
      </Modal>
    </div>
  );
}
