"use client";

import { useState, type ReactNode } from "react";
import { Flex } from "antd";
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
  render?: (item: T, index: number) => ReactNode;
}

export interface SettingsListPageProps<
  T extends Record<string, unknown>,
  F extends Record<string, unknown>,
> {
  title: string;
  description?: string;
  items: T[];
  columns: ColumnDef<T>[];
  dropdownItems: DropdownItem[];
  onAction?: (action: string, item: T, index: number) => void;
  showActions?: boolean;
  showDropdown?: (item: T, index: number) => boolean;
  hiddenDropdownContent?: ReactNode;
  primaryButtonLabel?: string;
  headerButtons?: ReactNode;
  hasSearch?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  itemsPerPage?: number;
  formDefaults?: F;
  onSave?: (values: F, index: number | null) => void;
  modalTitle?: (isEditing: boolean) => string;
  renderForm?: (form: F, setField: <K extends keyof F>(key: K, value: F[K]) => void) => ReactNode;
  className?: string;
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
  hiddenDropdownContent = <span style={{ color: "var(--ant-color-text-secondary)" }}>-</span>,
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
  className,
  beforeTable,
}: SettingsListPageProps<T, F>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const hasModal = formDefaults && onSave && renderForm;
  const modalHook = useFormModal<F>({
    defaults: (formDefaults ?? {}) as F,
    onSave: onSave ?? (() => {}),
  } as UseFormModalOptions<F>);

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
    if (action === "edit" && hasModal) {
      const values = {} as F;
      for (const key of Object.keys(formDefaults!)) {
        (values as Record<string, unknown>)[key] = (item as Record<string, unknown>)[key];
      }
      modalHook.openEdit(globalIndex, values);
    }
  }

  return (
    <div style={{ padding: 24 }} className={className}>
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
        <p style={{ marginBottom: 16, fontSize: 14, color: "var(--ant-color-text-secondary)" }}>{description}</p>
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
            <tr key={i}>
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
                style={{ padding: "32px 16px", textAlign: "center", fontSize: 14, color: "var(--ant-color-text-secondary)" }}
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
            <Flex justify="flex-end" gap={8}>
              <Button variant="secondary" onClick={modalHook.closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={modalHook.handleSave}>
                Save
              </Button>
            </Flex>
          }
        >
          <Flex vertical gap={16}>
            {renderForm(modalHook.form, modalHook.setField)}
          </Flex>
        </Modal>
      )}
    </div>
  );
}
