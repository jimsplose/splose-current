"use client";

import RPNInput, {
  type Country,
  type Value,
} from "react-phone-number-input/input";
import FormField from "./FormField";
import { Input } from "antd";
import { forwardRef } from "react";
import "react-phone-number-input/style.css";

export type PhoneInputSize = "sm" | "md" | "lg";

export interface PhoneInputProps {
  label?: string;
  /** Stored as E.164, e.g. "+61412345678". */
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: PhoneInputSize;
  defaultCountry?: Country;
  placeholder?: string;
  id?: string;
  className?: string;
}

// Wrap AntD Input so react-phone-number-input's formatting + event
// handling still works while the visible shell matches FormInput.
const AntInputWrapper = forwardRef<HTMLInputElement, Record<string, unknown>>(
  function AntInputWrapper(props, ref) {
    return (
      <Input
        ref={ref as never}
        {...(props as Record<string, unknown>)}
        status={(props as { 'data-has-error'?: boolean })['data-has-error'] ? "error" : undefined}
      />
    );
  },
);

/**
 * Formatted phone input with country-code awareness and E.164
 * normalisation. Emits E.164 at the boundary (never the free-typed
 * display string) — stored values stay canonical across AU/NZ/etc.
 * Defaults to AU when `defaultCountry` is omitted. Threads
 * label/error/hint into FormField. Pair with a form library that can
 * surface `libphonenumber-js`-validated error strings on blur.
 */
export default function PhoneInput({
  label,
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  error,
  hint,
  size = "md",
  defaultCountry = "AU",
  placeholder = "0412 345 678",
  id,
  className,
}: PhoneInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const input = (
    <RPNInput
      id={inputId}
      country={defaultCountry}
      international={false}
      withCountryCallingCode
      value={(value ?? defaultValue ?? "") as Value}
      onChange={(v) => onChange?.(v ? (v as string) : null)}
      disabled={disabled}
      placeholder={placeholder}
      inputComponent={AntInputWrapper as never}
      data-has-error={!!error || undefined}
      data-size={size}
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
