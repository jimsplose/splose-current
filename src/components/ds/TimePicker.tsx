"use client";

import { TimePicker as AntTimePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import FormField from "./FormField";

export type TimePickerSize = "sm" | "md" | "lg";
export type TimePickerFormat = "12h" | "24h";
export type TimePickerStep = 5 | 10 | 15 | 30 | 60;

export interface TimePickerProps {
  label?: string;
  /** "HH:mm" in 24h. Always emitted in this canonical form regardless of display format. */
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: TimePickerSize;
  format?: TimePickerFormat;
  /** Minute increments in the picker. Default 15. */
  step?: TimePickerStep;
  /** "HH:mm" — earliest selectable time. */
  minTime?: string;
  /** "HH:mm" — latest selectable time. */
  maxTime?: string;
  clearable?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
}

const sizeMap: Record<TimePickerSize, "small" | "middle" | "large"> = {
  sm: "small",
  md: "middle",
  lg: "large",
};

function parse(time: string | null | undefined): Dayjs | undefined {
  if (!time) return undefined;
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return undefined;
  return dayjs().hour(h).minute(m).second(0).millisecond(0);
}

function serialise(d: Dayjs | null): string | null {
  if (!d) return null;
  return d.format("HH:mm");
}

/**
 * Time-of-day input with scroll-column popover. Always emits canonical
 * `HH:mm` 24h strings at the boundary; display format is chosen by the
 * `format` prop (12h default). Seconds excluded. Pair with `DatePicker`
 * when a full datetime is needed.
 */
export default function TimePicker({
  label,
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  error,
  hint,
  size = "md",
  format = "12h",
  step = 15,
  minTime,
  maxTime,
  clearable = true,
  placeholder,
  id,
  className,
}: TimePickerProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const displayFormat = format === "24h" ? "HH:mm" : "h:mm A";
  const min = parse(minTime);
  const max = parse(maxTime);

  const disabledTime = () => {
    if (!min && !max) return {};
    return {
      disabledHours: () => {
        const hours: number[] = [];
        for (let h = 0; h < 24; h++) {
          if (min && h < min.hour()) hours.push(h);
          if (max && h > max.hour()) hours.push(h);
        }
        return hours;
      },
      disabledMinutes: (selectedHour: number) => {
        const minutes: number[] = [];
        if (min && selectedHour === min.hour()) {
          for (let m = 0; m < min.minute(); m++) minutes.push(m);
        }
        if (max && selectedHour === max.hour()) {
          for (let m = max.minute() + 1; m < 60; m++) minutes.push(m);
        }
        return minutes;
      },
    };
  };

  const picker = (
    <AntTimePicker
      id={inputId}
      value={value !== undefined ? parse(value) : undefined}
      defaultValue={parse(defaultValue)}
      onChange={(d) => onChange?.(serialise(d))}
      disabled={disabled}
      size={sizeMap[size]}
      status={error ? "error" : undefined}
      format={displayFormat}
      minuteStep={(step === 60 ? 59 : step) as never}
      use12Hours={format === "12h"}
      showSecond={false}
      allowClear={clearable}
      placeholder={placeholder ?? (format === "24h" ? "HH:mm" : "h:mm AM")}
      disabledTime={disabledTime}
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
