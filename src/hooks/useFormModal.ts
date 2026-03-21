"use client";

import { useState, useCallback } from "react";

export interface UseFormModalOptions<T extends Record<string, unknown>> {
  /** Default values for form fields when creating a new item */
  defaults: T;
  /** Called when saving. `index` is null for create, number for edit. */
  onSave: (values: T, index: number | null) => void;
}

export interface UseFormModalReturn<T extends Record<string, unknown>> {
  modalOpen: boolean;
  isEditing: boolean;
  editingIndex: number | null;
  form: T;
  setField: <K extends keyof T>(key: K, value: T[K]) => void;
  openCreate: () => void;
  openEdit: (index: number, values: T) => void;
  closeModal: () => void;
  handleSave: () => void;
}

export function useFormModal<T extends Record<string, unknown>>(
  options: UseFormModalOptions<T>,
): UseFormModalReturn<T> {
  const { defaults, onSave } = options;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<T>({ ...defaults });

  const openCreate = useCallback(() => {
    setEditingIndex(null);
    setForm({ ...defaults });
    setModalOpen(true);
  }, [defaults]);

  const openEdit = useCallback((index: number, values: T) => {
    setEditingIndex(index);
    setForm({ ...values });
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(form, editingIndex);
    setModalOpen(false);
  }, [form, editingIndex, onSave]);

  return {
    modalOpen,
    isEditing: editingIndex !== null,
    editingIndex,
    form,
    setField,
    openCreate,
    openEdit,
    closeModal,
    handleSave,
  };
}
