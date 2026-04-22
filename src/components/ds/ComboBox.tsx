"use client";

import { useCombobox } from "downshift";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import FormField from "./FormField";

export type ComboBoxSize = "sm" | "md" | "lg";

export interface ComboBoxOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

export interface ComboBoxProps<T extends ComboBoxOption = ComboBoxOption> {
  label?: string;
  options: T[];
  value?: string | null;
  onChange?: (value: string | null, option: T | null) => void;
  inputValue?: string;
  onInputChange?: (text: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: ComboBoxSize;
  placeholder?: string;
  emptyMessage?: string;
  /** When true, emits typed text as the value if no option matches. */
  allowFreeEntry?: boolean;
  /** Show a "Create '{text}'" row in the list. */
  onCreate?: (text: string) => void;
  renderOption?: (option: T) => ReactNode;
  clearable?: boolean;
  id?: string;
  className?: string;
}

const sizeHeight: Record<ComboBoxSize, number> = { sm: 24, md: 32, lg: 40 };

/**
 * Filterable text input with dropdown. Distinct from `FormSelect`
 * (small closed sets, no filter) and `AsyncSelect` (server-fetched on
 * every keystroke). Built on Downshift. `allowFreeEntry` emits the
 * typed text when no option matches; `onCreate` surfaces a "Create
 * '{text}'" row for add-on-the-fly UX. `renderOption` supports icons,
 * avatars, and secondary lines.
 */
export default function ComboBox<T extends ComboBoxOption = ComboBoxOption>({
  label,
  options,
  value,
  onChange,
  inputValue: inputValueProp,
  onInputChange,
  disabled,
  required,
  error,
  hint,
  size = "md",
  placeholder,
  emptyMessage = "No results",
  allowFreeEntry = false,
  onCreate,
  renderOption,
  clearable = true,
  id,
  className,
}: ComboBoxProps<T>) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const [internalInput, setInternalInput] = useState(
    value ? options.find((o) => o.value === value)?.label ?? "" : "",
  );
  const inputValue = inputValueProp !== undefined ? inputValueProp : internalInput;

  const filtered = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, inputValue]);

  const items: Array<T | { __create: true; label: string }> = [...filtered];
  if (onCreate && inputValue.trim() && !filtered.some((o) => o.label.toLowerCase() === inputValue.trim().toLowerCase())) {
    items.push({ __create: true, label: `Create "${inputValue.trim()}"` });
  }

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    getToggleButtonProps,
    highlightedIndex,
    selectItem,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({ inputValue: v }) => {
      setInternalInput(v ?? "");
      onInputChange?.(v ?? "");
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) return;
      if ("__create" in selectedItem) {
        onCreate?.(inputValue.trim());
        return;
      }
      onChange?.(selectedItem.value, selectedItem);
      setInternalInput(selectedItem.label);
    },
    itemToString: (it) => (it ? it.label : ""),
  });

  const handleBlur = () => {
    if (allowFreeEntry && inputValue.trim() && !options.some((o) => o.label === inputValue.trim())) {
      onChange?.(inputValue.trim(), null);
    }
  };

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: sizeHeight[size],
    padding: "0 28px 0 12px",
    borderRadius: 8,
    border: `1px solid ${error ? "var(--color-danger, #D00032)" : "var(--color-border, #e5e5e5)"}`,
    fontSize: 14,
    outline: "none",
    background: disabled ? "var(--color-fill-tertiary, #f3f4f6)" : "#ffffff",
    color: disabled ? "var(--color-text-secondary, #6E6E64)" : undefined,
    boxSizing: "border-box",
  };

  const body = (
    <div style={wrapperStyle} className={className}>
      <input
        {...getInputProps({
          id: inputId,
          placeholder,
          disabled,
          onBlur: handleBlur,
        })}
        style={inputStyle}
      />
      <button
        type="button"
        aria-label="Toggle menu"
        {...getToggleButtonProps({ disabled })}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          border: "none",
          background: "transparent",
          cursor: disabled ? "not-allowed" : "pointer",
          padding: 0,
          color: "var(--color-text-tertiary, #a5a59e)",
        }}
      >
        ▾
      </button>
      {clearable && value && !disabled ? (
        <button
          type="button"
          aria-label="Clear"
          onClick={() => {
            selectItem(null as never);
            setInternalInput("");
            onChange?.(null, null);
          }}
          style={{
            position: "absolute",
            right: 28,
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--color-text-tertiary, #a5a59e)",
            fontSize: 14,
          }}
        >
          ×
        </button>
      ) : null}

      <ul
        {...getMenuProps()}
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          marginTop: 4,
          padding: 4,
          listStyle: "none",
          background: "#ffffff",
          border: "1px solid var(--color-border, #e5e5e5)",
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          maxHeight: 240,
          overflowY: "auto",
          zIndex: 20,
          display: isOpen ? "block" : "none",
        }}
      >
        {isOpen && items.length === 0 ? (
          <li style={{ padding: 12, textAlign: "center", color: "#6E6E64", fontStyle: "italic", fontSize: 13 }}>
            {emptyMessage}
          </li>
        ) : null}
        {isOpen &&
          items.map((item, index) => {
            const isCreate = "__create" in item;
            return (
              <li
                key={isCreate ? "__create" : (item as T).value}
                {...getItemProps({ item, index })}
                style={{
                  padding: "8px 12px",
                  borderRadius: 4,
                  background:
                    highlightedIndex === index
                      ? "var(--color-fill-secondary, #f4f5f5)"
                      : undefined,
                  cursor: "pointer",
                  color: isCreate ? "var(--color-primary, #5578FF)" : undefined,
                  fontSize: 14,
                }}
              >
                {isCreate ? (
                  <span>+ {item.label}</span>
                ) : renderOption ? (
                  renderOption(item as T)
                ) : (
                  (item as T).label
                )}
              </li>
            );
          })}
      </ul>
    </div>
  );

  if (label || error || hint || required) {
    return (
      <FormField label={label} error={error} hint={hint} required={required} id={inputId}>
        {body}
      </FormField>
    );
  }

  return body;
}
