"use client";

import { useState, type ReactNode } from "react";
import {
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
} from "@/components/ds";
import type { DropdownItem } from "@/components/ds";
import { useFormModal, type UseFormModalOptions } from "@/hooks/useFormModal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ColumnDef<T> {
  key: string;
  label: string | ReactNode;
  align?: "left" | "right" | "center";
  /** Custom cell renderer. If omitted, renders `String(item[key])`. */
  render?: (item: T, index: number) => ReactNode;
}

export interface SettingsListPageProps<
  T extends Record<string, unknown>,
  F extends Record<string, unknown>,
> {
  /** Page title shown in PageHeader */
  title: string;
  /** Description text below header (optional) */
  description?: string;
  /** Items to display in the table */
  items: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Dropdown preset or custom items for the Actions column */
  dropdownItems: DropdownItem[];
  /** Called when a dropdown action is selected. Default handles "edit" → openEdit. */
  onAction?: (action: string, item: T, index: number) => void;
  /** Whether to show the actions column (default: true) */
  showActions?: boolean;
  /** Condition to show dropdown for a row (default: always show) */
  showDropdown?: (item: T, index: number) => boolean;
  /** Fallback content when dropdown is hidden (default: "-") */
  hiddenDropdownContent?: ReactNode;

  // --- Header buttons ---
  /** Primary button label (e.g. "+ New tag"). If omitted, no primary button. */
  primaryButtonLabel?: string;
  /** Extra header buttons (Learn, Show archived, etc.) */
  headerButtons?: ReactNode;

  // --- Search ---
  /** Show search bar */
  hasSearch?: boolean;
  searchPlaceholder?: string;
  /** Filter function for search. If omitted, search is disabled. */
  searchFilter?: (item: T, query: string) => boolean;

  // --- Pagination ---
  itemsPerPage?: number;

  // --- Modal form ---
  /** Form field defaults for useFormModal. If omitted, no modal is rendered. */
  formDefaults?: F;
  /** Called on save — receives form values and edit index (null for create) */
  onSave?: (values: F, index: number | null) => void;
  /** Modal title factory */
  modalTitle?: (isEditing: boolean) => string;
  /** Render the modal form body */
  renderForm?: (form: F, setField: <K extends keyof F>(key: K, value: F[K]) => void) => ReactNode;

  // --- Wrapper ---
  /** Additional className on outer div */
  className?: string;
  /** Content rendered between header and table (tabs, description, etc.) */
  beforeTable?: ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SettingsListPage<
  T extends Record<string, unknown>,
  F extends Record<string, unknown>,
>({
  title,
  description,
  items,
  columns,
  dropdownItems,
  onAction,
  showActions = true,
  showDropdown,
  hiddenDropdownContent = <span className="text-text-secondary">-</span>,
  primaryButtonLabel,
  headerButtons,
  hasSearch = false,
  searchPlaceholder = "Search...",
  searchFilter,
  itemsPerPage = 10,
  formDefaults,
  onSave,
  modalTitle,
  renderForm,
  className = "",
  beforeTable,
}: SettingsListPageProps<T, F>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal (only used when formDefaults + onSave are provided)
  const hasModal = formDefaults && onSave && renderForm;
  const modalHook = useFormModal<F>({
    defaults: (formDefaults ?? {}) as F,
    onSave: onSave ?? (() => {}),
  } as UseFormModalOptions<F>);

  // Search + pagination
  const filtered =
    hasSearch && searchFilter && searchQuery
      ? items.filter((item) => searchFilter(item, searchQuery))
      : items;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  function handleDropdownAction(action: string, item: T, index: number) {
    const globalIndex = startIdx + index;
    if (onAction) {
      onAction(action, item, globalIndex);
      return;
    }
    // Default: open edit modal
    if (action === "edit" && hasModal) {
      // Extract form fields from item
      const values = {} as F;
      for (const key of Object.keys(formDefaults!)) {
        (values as Record<string, unknown>)[key] = (item as Record<string, unknown>)[key];
      }
      modalHook.openEdit(globalIndex, values);
    }
  }

  return (
    <div className={`p-6 ${className}`}>
      <PageHeader title={title}>
        {headerButtons}
        {primaryButtonLabel && hasModal && (
          <Button variant="primary" onClick={modalHook.openCreate}>
            {primaryButtonLabel}
          </Button>
        )}
        {primaryButtonLabel && !hasModal && (
          <Button variant="primary">{primaryButtonLabel}</Button>
        )}
      </PageHeader>

      {description && (
        <p className="mb-4 text-body-md text-text-secondary">{description}</p>
      )}

      {beforeTable}

      {hasSearch && (
        <SearchBar
          placeholder={searchPlaceholder}
          onSearch={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
        />
      )}

      <DataTable>
        <TableHead>
          {columns.map((col) => (
            <Th key={col.key} align={col.align}>
              {col.label}
            </Th>
          ))}
          {showActions && <Th align="right">Actions</Th>}
        </TableHead>
        <TableBody>
          {pageItems.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map((col) => (
                <Td key={col.key} align={col.align}>
                  {col.render
                    ? col.render(item, startIdx + i)
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </Td>
              ))}
              {showActions && (
                <Td align="right">
                  {(!showDropdown || showDropdown(item, startIdx + i)) ? (
                    <Dropdown
                      align="right"
                      trigger={<DropdownTriggerButton />}
                      items={dropdownItems}
                      onSelect={(action) => handleDropdownAction(action, item, i)}
                    />
                  ) : (
                    hiddenDropdownContent
                  )}
                </Td>
              )}
            </tr>
          ))}
          {pageItems.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="px-4 py-8 text-center text-body-md text-text-secondary"
              >
                No items found.
              </td>
            </tr>
          )}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {hasModal && (
        <Modal
          open={modalHook.modalOpen}
          onClose={modalHook.closeModal}
          title={modalTitle ? modalTitle(modalHook.isEditing) : (modalHook.isEditing ? "Edit" : "Create")}
          footer={
            <>
              <Button variant="secondary" onClick={modalHook.closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={modalHook.handleSave}>
                Save
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {renderForm(modalHook.form, modalHook.setField)}
          </div>
        </Modal>
      )}
    </div>
  );
}
