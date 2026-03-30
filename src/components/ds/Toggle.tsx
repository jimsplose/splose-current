"use client";

import { Switch, Flex } from "antd";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function Toggle({ checked, onChange, label, disabled = false, className }: ToggleProps) {
  return (
    <Flex align="center" gap={8} className={className}>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {label && <span style={{ fontSize: 14 }}>{label}</span>}
    </Flex>
  );
}
