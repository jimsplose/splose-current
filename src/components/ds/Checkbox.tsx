"use client";

import { Checkbox as AntCheckbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { forwardRef } from "react";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
  className?: string;
  id?: string;
  name?: string;
  value?: string;
  readOnly?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, readOnly, onClick, ...props }, ref) => {
    return (
      <span onClick={onClick}>
        <AntCheckbox ref={ref as never} className={className} disabled={readOnly || props.disabled} {...props}>
          {label}
        </AntCheckbox>
      </span>
    );
  },
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
