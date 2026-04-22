"use client";

import { InputNumber } from "antd";
import type { ReactNode } from "react";
import FormField from "./FormField";

export type NumberInputSize = "sm" | "md" | "lg";
export type NumberInputFormat = "integer" | "decimal" | "currency" | "percent";
export type NumberInputCurrency = "AUD" | "USD" | "NZD";

export interface NumberInputProps {
  label?: string;
  value?: number | null;
  defaultValue?: number;
  onChange?: (value: number | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: NumberInputSize;
  min?: number;
  max?: number;
  /** Arrow / scroll increment. Default 1. */
  step?: number;
  /** Decimal places. Defaults per format: integer=0, decimal=2, currency=2, percent=2. */
  precision?: number;
  format?: NumberInputFormat;
  /** Required when `format="currency"`. Default "AUD". */
  currency?: NumberInputCurrency;
  /** Show ± stepper buttons. Default `true`. */
  showSteppers?: boolean;
  /** Override prefix (e.g. custom icon). Currency format sets `$` automatically. */
  prefix?: ReactNode;
  /** Override suffix. Percent format sets `%` automatically. */
  suffix?: ReactNode;
  placeholder?: string;
  id?: string;
  className?: string;
}

const sizeMap: Record<NumberInputSize, "small" | "middle" | "large"> = {
  sm: "small",
  md: "middle",
  lg: "large",
};

const currencySymbol: Record<NumberInputCurrency, string> = {
  AUD: "$",
  USD: "$",
  NZD: "$",
};

function resolveDefaults(format: NumberInputFormat, currency: NumberInputCurrency) {
  switch (format) {
    case "integer":
      return { precision: 0, prefix: undefined, suffix: undefined };
    case "decimal":
      return { precision: 2, prefix: undefined, suffix: undefined };
    case "currency":
      return { precision: 2, prefix: currencySymbol[currency], suffix: undefined };
    case "percent":
      return { precision: 2, prefix: undefined, suffix: "%" };
  }
}

/**
 * Typed numeric input with stepper controls and min/max clamping. Owns
 * currency/percent formatting so consumers never `parseFloat` the input
 * themselves. Emits `number | null` (never strings). Format variants:
 * `integer`, `decimal`, `currency` (AUD-formatted $1,234.50), `percent`
 * (12.5%). Use `showSteppers={false}` for free-entry numeric fields.
 */
export default function NumberInput({
  label,
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  error,
  hint,
  size = "md",
  min,
  max,
  step = 1,
  precision,
  format = "decimal",
  currency = "AUD",
  showSteppers = true,
  prefix,
  suffix,
  placeholder,
  id,
  className,
}: NumberInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const defaults = resolveDefaults(format, currency);
  const resolvedPrecision = precision ?? defaults.precision;
  const resolvedPrefix = prefix ?? defaults.prefix;
  const resolvedSuffix = suffix ?? defaults.suffix;

  const formatter = (v: number | string | undefined): string => {
    if (v === undefined || v === null || v === "") return "";
    const n = typeof v === "number" ? v : parseFloat(String(v));
    if (Number.isNaN(n)) return "";
    if (format === "currency") {
      return n.toLocaleString("en-AU", {
        minimumFractionDigits: resolvedPrecision,
        maximumFractionDigits: resolvedPrecision,
      });
    }
    if (format === "integer") return String(Math.round(n));
    return n.toLocaleString("en-AU", {
      minimumFractionDigits: resolvedPrecision,
      maximumFractionDigits: resolvedPrecision,
    });
  };

  const parser = (displayValue: string | undefined): string => {
    if (!displayValue) return "";
    // Strip thousand separators and non-numeric chars (except - and .)
    return displayValue.replace(/[^\d.-]/g, "");
  };

  const input = (
    <InputNumber
      id={inputId}
      value={value === null ? undefined : value}
      defaultValue={defaultValue}
      onChange={(v) => onChange?.(v === null || v === undefined ? null : Number(v))}
      disabled={disabled}
      size={sizeMap[size]}
      min={min}
      max={max}
      step={step}
      precision={resolvedPrecision}
      controls={showSteppers}
      prefix={resolvedPrefix}
      suffix={resolvedSuffix}
      placeholder={placeholder}
      status={error ? "error" : undefined}
      formatter={formatter as never}
      parser={parser as never}
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
        {input}
      </FormField>
    );
  }

  return input;
}
