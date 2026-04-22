"use client";

import { DatePicker as AntDatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/en-au";
import FormField from "./FormField";

dayjs.locale("en-au");

export type DatePickerSize = "sm" | "md" | "lg";

export interface DatePickerProps {
  /** When present, the picker is wrapped in `FormField` with this label. */
  label?: string;
  /** Controlled value (or `null` to clear). Always a native `Date`, never dayjs. */
  value?: Date | null;
  /** Uncontrolled default. */
  defaultValue?: Date;
  /** Called with a native `Date`, or `null` when cleared. */
  onChange?: (value: Date | null) => void;
  disabled?: boolean;
  required?: boolean;
  /** FormField error passthrough. */
  error?: string;
  /** FormField hint passthrough. */
  hint?: string;
  /** Default "DD/MM/YYYY". */
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  /** Custom disable predicate — return `true` to disable the date. */
  disabledDates?: (date: Date) => boolean;
  /** dayjs-compatible format string. Default "DD/MM/YYYY" (Australian locale). */
  format?: string;
  /** Show × in the input to clear the value. Default `true`. */
  clearable?: boolean;
  size?: DatePickerSize;
  id?: string;
  className?: string;
}

const sizeMap: Record<DatePickerSize, "small" | "middle" | "large"> = {
  sm: "small",
  md: "middle",
  lg: "large",
};

function toDayjs(date: Date | null | undefined): Dayjs | undefined {
  return date ? dayjs(date) : undefined;
}

function toDate(value: Dayjs | null): Date | null {
  return value ? value.toDate() : null;
}

/**
 * Single-date input with calendar popover for forms and filters. Always
 * emits native `Date` objects at the boundary — AntD's internal dayjs is
 * hidden from call sites. Locale locked to Australian English
 * (DD/MM/YYYY, Monday-first week). For date ranges use `DateRangeFilter`;
 * for date+time use `TimePicker` alongside this picker (Phase 4).
 */
export default function DatePicker({
  label,
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  error,
  hint,
  placeholder = "DD/MM/YYYY",
  minDate,
  maxDate,
  disabledDates,
  format = "DD/MM/YYYY",
  clearable = true,
  size = "md",
  id,
  className,
}: DatePickerProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const disabledDate = (current: Dayjs) => {
    const d = current.toDate();
    if (minDate && current.isBefore(dayjs(minDate), "day")) return true;
    if (maxDate && current.isAfter(dayjs(maxDate), "day")) return true;
    if (disabledDates && disabledDates(d)) return true;
    return false;
  };

  const picker = (
    <AntDatePicker
      id={inputId}
      value={value !== undefined ? toDayjs(value) : undefined}
      defaultValue={toDayjs(defaultValue)}
      onChange={(d) => onChange?.(toDate(d))}
      disabled={disabled}
      placeholder={placeholder}
      format={format}
      allowClear={clearable}
      size={sizeMap[size]}
      status={error ? "error" : undefined}
      disabledDate={minDate || maxDate || disabledDates ? disabledDate : undefined}
      style={{ width: "100%" }}
    />
  );

  if (label || error || hint || required) {
    return (
      <FormField
        label={label}
        error={error}
        hint={hint}
        required={required}
        id={inputId}
        className={className}
      >
        {picker}
      </FormField>
    );
  }

  return picker;
}
