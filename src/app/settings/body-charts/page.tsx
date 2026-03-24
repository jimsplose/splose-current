"use client";

import { useState } from "react";
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

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index, { name: templates[index].name, type: templates[index].type });
  }

  return (
    <div className="p-6">
      <PageHeader title="Body chart templates">
        <Button variant="secondary">Show archived</Button>
        <Button variant="primary" onClick={openCreate}>+ New template</Button>
      </PageHeader>

      <div className="mb-4">
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
          {filtered.map((t, i) => (
            <Tr key={t.id} hover>
              <Td><span className="text-body-md font-medium text-text">{t.name}</span></Td>
              <Td className="text-text-secondary">{t.type}</Td>
              <Td className="text-text-secondary">{t.createdAt}</Td>
              <Td className="text-text-secondary">{t.lastUpdate}</Td>
              <Td align="right">
                <Dropdown trigger={<DropdownTriggerButton />} items={STANDARD_SETTINGS} onSelect={(v) => handleAction(v, i)} align="right" />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={filtered.length} itemsPerPage={10} showPageSize={false} />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit body chart template" : "New body chart template"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. Full Body — Front" />
          <FormSelect label="Type" value={form.type} onChange={(e) => setField("type", e.target.value)} options={typeOptions} />
          <FormSelect label="Chart view" value={chartView} onChange={(e) => setChartView(e.target.value)} options={chartViewOptions} />

          {/* Body region selector */}
          <div>
            <p className="mb-2 text-label-lg text-text-secondary">Body regions</p>
            <div className="grid grid-cols-3 gap-2">
              {bodyRegions.map((region) => (
                <label
                  key={region}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 transition-colors hover:bg-surface-secondary has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary accent-primary"
                    checked={selectedRegions.has(region)}
                    onChange={() => toggleRegion(region)}
                  />
                  <span className="text-body-sm text-text">{region}</span>
                </label>
              ))}
            </div>
            {selectedRegions.size > 0 && (
              <p className="mt-2 text-caption-md text-text-secondary">
                {selectedRegions.size} region{selectedRegions.size !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
