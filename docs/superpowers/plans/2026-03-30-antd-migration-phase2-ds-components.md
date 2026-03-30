# Ant Design Migration — Phase 2: DS Component Rewrite

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite all 43 DS components to use Ant Design internally while keeping barrel exports stable.

**Architecture:** Each component in src/components/ds/ becomes either a thin wrapper around an AntD component (applying Splose defaults) or a standalone custom component using AntD design tokens + CSS Modules.

**Tech Stack:** antd 5.x, @ant-design/icons, CSS Modules, Next.js 16, React 19, TypeScript strict

**Spec:** `docs/superpowers/specs/2026-03-30-antd-migration-design.md`

**Colour tokens:** Read `docs/superpowers/specs/2026-03-30-colour-tokens-reference.md` before touching any colour values. This is the canonical source of truth. Only implement tokens marked Confirmed, Updated, Fixed, or New.

**Prerequisite:** Phase 1 (Foundation) must be complete — antd installed, theme.ts created, ThemeProvider wired into layout.tsx.

---

## General Rules

1. **No Tailwind classes** in component implementations. Use AntD CSS-in-JS (component props, `styles` prop, `classNames` prop) and CSS Modules for edge cases.
2. **Barrel export stability.** Every component in `src/components/ds/index.ts` must continue to export the same names and types. Page code should not break.
3. **"use client" directive.** AntD components require client-side rendering. Add `"use client"` at the top of every component file that uses AntD internally.
4. **CSS Module convention.** When a CSS Module is needed, create it as `ComponentName.module.css` co-located in `src/components/ds/`.
5. **Colour values.** Never hardcode hex values. Use AntD theme tokens (via `theme.useToken()`) or refer to the canonical token reference doc. If a colour is not in the theme, add it to `theme.ts` first.
6. **Icon replacement.** Replace every `lucide-react` icon with its `@ant-design/icons` equivalent. Mapping: `ChevronDown` -> `DownOutlined`, `ChevronRight` -> `RightOutlined`, `ArrowLeft` -> `ArrowLeftOutlined`, `Search` -> `SearchOutlined`, `X` -> `CloseOutlined`, `MoreHorizontal` -> `MoreOutlined` / `EllipsisOutlined`, `GripVertical` -> `HolderOutlined`, `Filter` -> `FilterOutlined`, `ArrowUpDown`/`ArrowUp`/`ArrowDown` -> built-in AntD Table sorter, `Menu` -> `MenuOutlined`, `Bold`/`Italic`/`Underline`/`Strikethrough`/`Link`/`List`/`ListOrdered`/`Heading1`/`Heading2`/`Image`/`Undo2`/`Redo2`/`Minus` -> `BoldOutlined`/`ItalicOutlined`/`UnderlineOutlined`/`StrikethroughOutlined`/`LinkOutlined`/`UnorderedListOutlined`/`OrderedListOutlined`/`FontSizeOutlined` (x2 for H1/H2)/`PictureOutlined`/`UndoOutlined`/`RedoOutlined`/`MinusOutlined`.

---

## Task 1: Simple Same-API Wrappers

**Components:** Spinner, Avatar, Checkbox, RadioGroup, Collapse

These have near-identical APIs to their AntD equivalents. The wrapper is thin.

**Files:**
- Modify: `src/components/ds/Spinner.tsx`
- Modify: `src/components/ds/Avatar.tsx`
- Modify: `src/components/ds/Checkbox.tsx`
- Modify: `src/components/ds/RadioGroup.tsx`
- Modify: `src/components/ds/Collapse.tsx`
- Test: `src/components/ds/stories/Spinner.stories.tsx`
- Test: `src/components/ds/stories/Avatar.stories.tsx`
- Test: `src/components/ds/stories/Checkbox.stories.tsx`
- Test: `src/components/ds/stories/RadioGroup.stories.tsx`
- Test: `src/components/ds/stories/Collapse.stories.tsx`

### Steps

- [ ] 1.1 Rewrite `Spinner.tsx`:

```tsx
"use client";

import { Spin } from "antd";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap: Record<string, "small" | "default" | "large"> = {
  sm: "small",
  md: "default",
  lg: "large",
};

export default function Spinner({ size = "md", className }: SpinnerProps) {
  return <Spin size={sizeMap[size]} className={className} />;
}
```

- [ ] 1.2 Rewrite `Avatar.tsx`:

```tsx
"use client";

import { Avatar as AntAvatar } from "antd";
import { theme } from "antd";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name: string;
  color?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 28,
  md: 40,
  lg: 48,
  xl: 56,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ name, color, size = "md", className }: AvatarProps) {
  const { token } = theme.useToken();

  return (
    <AntAvatar
      size={sizeMap[size]}
      className={className}
      style={{ backgroundColor: color || token.colorPrimary, flexShrink: 0 }}
    >
      {getInitials(name)}
    </AntAvatar>
  );
}
```

- [ ] 1.3 Rewrite `Checkbox.tsx`:

```tsx
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
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <AntCheckbox ref={ref as never} className={className} {...props}>
        {label}
      </AntCheckbox>
    );
  },
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
```

- [ ] 1.4 Rewrite `RadioGroup.tsx`:

```tsx
"use client";

import { Radio } from "antd";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function RadioGroup({ name, label, options, value, onChange, className }: RadioGroupProps) {
  return (
    <div className={className}>
      {label && (
        <div style={{ marginBottom: 8, fontSize: 14, color: 'var(--ant-color-text-secondary)' }}>
          {label}
        </div>
      )}
      <Radio.Group
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        options={options}
        optionType="default"
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      />
    </div>
  );
}
```

- [ ] 1.5 Rewrite `Collapse.tsx`:

```tsx
"use client";

import { Collapse as AntCollapse } from "antd";

interface CollapseProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function Collapse({ title, children, defaultOpen = false, className }: CollapseProps) {
  return (
    <AntCollapse
      defaultActiveKey={defaultOpen ? ["1"] : []}
      className={className}
      bordered={false}
      items={[
        {
          key: "1",
          label: title,
          children,
        },
      ]}
    />
  );
}
```

- [ ] 1.6 Verify all five stories still render correctly in Storybook.
- [ ] 1.7 Run `npx tsc --noEmit` to confirm no type errors.
- [ ] 1.8 Commit: `feat(ds): rewrite Spinner, Avatar, Checkbox, RadioGroup, Collapse to AntD wrappers`

---

## Task 2: Button

The current Button has 7 variants (`primary`, `secondary`, `danger`, `ghost`, `link`, `icon`, `toolbar`) and 3 sizes (`sm`, `md`, `lg`). Map these to AntD's `type`, `danger`, `ghost`, and `shape` props.

**Files:**
- Modify: `src/components/ds/Button.tsx`
- Test: `src/components/ds/stories/Button.stories.tsx`

### Variant Mapping

| Current Variant | AntD Props |
|----------------|-----------|
| `primary` | `type="primary"` |
| `secondary` | `type="default"` |
| `danger` | `type="default" danger` |
| `ghost` | `type="text"` |
| `link` | `type="link"` |
| `icon` | `type="text" shape="circle"` or `shape="default"` |
| `toolbar` | `type="text"` (with compact styling) |

### Steps

- [ ] 2.1 Rewrite `Button.tsx`:

```tsx
"use client";

import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link" | "icon" | "toolbar";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  round?: boolean;
  children: React.ReactNode;
  htmlType?: "button" | "submit" | "reset";
}

const sizeMap: Record<ButtonSize, AntButtonProps["size"]> = {
  sm: "small",
  md: "middle",
  lg: "large",
};

function mapVariant(variant: ButtonVariant): Pick<AntButtonProps, "type" | "danger" | "shape"> {
  switch (variant) {
    case "primary":
      return { type: "primary" };
    case "secondary":
      return { type: "default" };
    case "danger":
      return { type: "default", danger: true };
    case "ghost":
      return { type: "text" };
    case "link":
      return { type: "link" };
    case "icon":
      return { type: "text" };
    case "toolbar":
      return { type: "text" };
  }
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "secondary", size = "md", round = false, className, children, htmlType, disabled, onClick, ...props }, ref) => {
    const antProps = mapVariant(variant);

    return (
      <AntButton
        ref={ref}
        {...antProps}
        size={sizeMap[size]}
        shape={round ? "circle" : undefined}
        className={className}
        disabled={disabled}
        onClick={onClick}
        htmlType={htmlType}
      >
        {children}
      </AntButton>
    );
  },
);

Button.displayName = "Button";
export default Button;
```

- [ ] 2.2 Update the Button story to exercise all 7 variants.
- [ ] 2.3 Run `npx tsc --noEmit`.
- [ ] 2.4 Commit: `feat(ds): rewrite Button to AntD wrapper with 7-variant mapping`

---

## Task 3: Badge (-> AntD Tag)

Badge maps to AntD `Tag`. The `statusVariant()` utility function is pure business logic and stays unchanged.

**Files:**
- Modify: `src/components/ds/Badge.tsx`
- Test: `src/components/ds/stories/Badge.stories.tsx`

### Steps

- [ ] 3.1 Rewrite `Badge.tsx`:

```tsx
"use client";

import { Tag, theme } from "antd";

type BadgeVariant = "green" | "red" | "blue" | "yellow" | "orange" | "gray" | "purple";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  solid?: boolean;
  className?: string;
}

// AntD Tag color mapping for light (bordered) style
const variantColorMap: Record<BadgeVariant, string> = {
  green: "success",
  red: "error",
  blue: "processing",
  yellow: "warning",
  orange: "warning",
  gray: "default",
  purple: "purple",
};

// For solid style, use explicit background colours
const solidColorMap: Record<BadgeVariant, { bg: string; text: string }> = {
  green: { bg: "#b4eb64", text: "#ffffff" },
  red: { bg: "#D00032", text: "#ffffff" },
  blue: { bg: "#5578FF", text: "#ffffff" },
  yellow: { bg: "#FFD232", text: "#ffffff" },
  orange: { bg: "#f97316", text: "#ffffff" },
  gray: { bg: "#a5a59e", text: "#ffffff" },
  purple: { bg: "#8250FF", text: "#ffffff" },
};

export default function Badge({ children, variant = "gray", solid = false, className }: BadgeProps) {
  if (solid) {
    const colors = solidColorMap[variant];
    return (
      <Tag
        bordered={false}
        className={className}
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          borderRadius: 8,
          fontSize: 12,
        }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      color={variantColorMap[variant]}
      className={className}
      style={{ borderRadius: 8, fontSize: 12 }}
    >
      {children}
    </Tag>
  );
}

/** Convenience map for common status -> variant */
export function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Active: "green",
    Paid: "green",
    Delivered: "green",
    Final: "green",
    Completed: "green",
    Upcoming: "green",
    Scheduled: "green",
    "In progress": "green",
    Draft: "gray",
    Sent: "blue",
    Outstanding: "yellow",
    Pending: "yellow",
    "No Show": "yellow",
    Overdue: "red",
    Failed: "red",
    Cancelled: "red",
    Expired: "red",
    Archived: "orange",
    Closed: "gray",
    Opened: "blue",
    "On Leave": "yellow",
    "Do not invoice": "gray",
  };
  return map[status] ?? "gray";
}
```

- [ ] 3.2 Update Badge story.
- [ ] 3.3 Run `npx tsc --noEmit`.
- [ ] 3.4 Commit: `feat(ds): rewrite Badge to AntD Tag wrapper`

---

## Task 4: Alert

Map `variant` -> AntD `type`: `info` -> `info`, `warning` -> `warning`, `success` -> `success`, `error` -> `error`.

**Files:**
- Modify: `src/components/ds/Alert.tsx`
- Test: `src/components/ds/stories/Alert.stories.tsx`

### Steps

- [ ] 4.1 Rewrite `Alert.tsx`:

```tsx
"use client";

import { Alert as AntAlert } from "antd";

type AlertVariant = "info" | "warning" | "success" | "error";

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  className?: string;
}

export default function Alert({ children, variant = "info", icon, className }: AlertProps) {
  return (
    <AntAlert
      type={variant}
      message={children}
      icon={icon}
      showIcon={!!icon}
      className={className}
    />
  );
}
```

- [ ] 4.2 Update Alert story.
- [ ] 4.3 Run `npx tsc --noEmit`.
- [ ] 4.4 Commit: `feat(ds): rewrite Alert to AntD wrapper`

---

## Task 5: Card

Map `headerBar` + `title` to AntD Card `title` + `extra`. Map `padding` to AntD `bodyStyle`.

**Files:**
- Modify: `src/components/ds/Card.tsx`
- Test: `src/components/ds/stories/Card.stories.tsx`

### Steps

- [ ] 5.1 Rewrite `Card.tsx`:

```tsx
"use client";

import { Card as AntCard } from "antd";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  headerBar?: boolean;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap: Record<string, number> = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 20,
};

export default function Card({ children, title, headerBar, className, padding = "md" }: CardProps) {
  // When headerBar is true, use AntD Card's built-in title area
  // When headerBar is false but title exists, render title inside the body
  const showAntTitle = title && headerBar;

  return (
    <AntCard
      title={showAntTitle ? title : undefined}
      className={className}
      styles={{
        body: { padding: paddingMap[padding] },
        header: headerBar ? { backgroundColor: "var(--ant-color-fill-alter)" } : undefined,
      }}
    >
      {title && !headerBar && (
        <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>{title}</h3>
      )}
      {children}
    </AntCard>
  );
}
```

- [ ] 5.2 Update Card story.
- [ ] 5.3 Run `npx tsc --noEmit`.
- [ ] 5.4 Commit: `feat(ds): rewrite Card to AntD wrapper`

---

## Task 6: Toggle -> AntD Switch

**Files:**
- Modify: `src/components/ds/Toggle.tsx`
- Test: `src/components/ds/stories/Toggle.stories.tsx`

### Steps

- [ ] 6.1 Rewrite `Toggle.tsx`:

```tsx
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
```

- [ ] 6.2 Update Toggle story.
- [ ] 6.3 Run `npx tsc --noEmit`.
- [ ] 6.4 Commit: `feat(ds): rewrite Toggle to AntD Switch wrapper`

---

## Task 7: Modal

Map `maxWidth` to AntD `width`. AntD Modal handles escape key and backdrop click natively.

**Files:**
- Modify: `src/components/ds/Modal.tsx`
- Test: `src/components/ds/stories/Modal.stories.tsx`

### Steps

- [ ] 7.1 Rewrite `Modal.tsx`:

```tsx
"use client";

import { Modal as AntModal } from "antd";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const widthMap: Record<string, number> = {
  sm: 384,   // 24rem
  md: 448,   // 28rem
  lg: 512,   // 32rem
  xl: 576,   // 36rem
};

export default function Modal({ open, onClose, title, children, footer, maxWidth = "lg" }: ModalProps) {
  return (
    <AntModal
      open={open}
      onCancel={onClose}
      title={title}
      footer={footer !== undefined ? footer : null}
      width={widthMap[maxWidth]}
      destroyOnClose
      centered={false}
      style={{ top: 48 }}
    >
      {children}
    </AntModal>
  );
}
```

- [ ] 7.2 Update Modal story.
- [ ] 7.3 Run `npx tsc --noEmit`.
- [ ] 7.4 Commit: `feat(ds): rewrite Modal to AntD wrapper`

---

## Task 8: FormInput

Wrap AntD `Form.Item` + `Input`. Preserve `label`, `error`, and `forwardRef` pattern.

**Files:**
- Modify: `src/components/ds/FormInput.tsx`
- Test: `src/components/ds/stories/FormInput.stories.tsx`

### Steps

- [ ] 8.1 Rewrite `FormInput.tsx`:

```tsx
"use client";

import { Input } from "antd";
import { forwardRef } from "react";

interface FormInputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  type?: string;
  id?: string;
  name?: string;
  className?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={inputId}
            style={{ display: "block", marginBottom: 4, fontSize: 14, color: "var(--ant-color-text-secondary)" }}
          >
            {label}
          </label>
        )}
        <Input
          ref={ref as never}
          id={inputId}
          status={error ? "error" : undefined}
          {...props}
        />
        {error && (
          <div style={{ marginTop: 4, fontSize: 12, color: "var(--ant-color-error)" }}>
            {error}
          </div>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
export default FormInput;
```

- [ ] 8.2 Update FormInput story.
- [ ] 8.3 Run `npx tsc --noEmit`.
- [ ] 8.4 Commit: `feat(ds): rewrite FormInput to AntD Input wrapper`

---

## Task 9: FormSelect

Wrap AntD `Select` (not native `<select>`). The current API takes `options: { value: string; label: string }[]` which is already the AntD format.

**Files:**
- Modify: `src/components/ds/FormSelect.tsx`
- Test: `src/components/ds/stories/FormSelect.stories.tsx`

### Steps

- [ ] 9.1 Rewrite `FormSelect.tsx`:

```tsx
"use client";

import { Select } from "antd";
import { forwardRef } from "react";

interface FormSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const FormSelect = forwardRef<HTMLDivElement, FormSelectProps>(
  ({ label, options, className, id, onChange, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div ref={ref} className={className}>
        {label && (
          <label
            htmlFor={selectId}
            style={{ display: "block", marginBottom: 4, fontSize: 14, color: "var(--ant-color-text-secondary)" }}
          >
            {label}
          </label>
        )}
        <Select
          id={selectId}
          options={options}
          onChange={onChange}
          style={{ width: "100%" }}
          {...props}
        />
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";
export default FormSelect;
```

**API change note:** The `onChange` handler changes from `(e: ChangeEvent<HTMLSelectElement>) => void` to `(value: string) => void`. All consumer pages that use `(e) => onChange(e.target.value)` must be updated to `(value) => onChange(value)` in Phase 3. During Phase 2, update only the component itself. Document the breaking change at the bottom of this file.

- [ ] 9.2 Update FormSelect story.
- [ ] 9.3 Run `npx tsc --noEmit`.
- [ ] 9.4 Commit: `feat(ds): rewrite FormSelect to AntD Select wrapper`

---

## Task 10: FormTextarea

Wrap AntD `Input.TextArea`.

**Files:**
- Modify: `src/components/ds/FormTextarea.tsx`
- Test: `src/components/ds/stories/FormTextarea.stories.tsx`

### Steps

- [ ] 10.1 Rewrite `FormTextarea.tsx`:

```tsx
"use client";

import { Input } from "antd";
import { forwardRef } from "react";

const { TextArea } = Input;

interface FormTextareaProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  rows?: number;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={textareaId}
            style={{ display: "block", marginBottom: 4, fontSize: 14, color: "var(--ant-color-text-secondary)" }}
          >
            {label}
          </label>
        )}
        <TextArea
          ref={ref as never}
          id={textareaId}
          status={error ? "error" : undefined}
          {...props}
        />
        {error && (
          <div style={{ marginTop: 4, fontSize: 12, color: "var(--ant-color-error)" }}>
            {error}
          </div>
        )}
      </div>
    );
  },
);

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
```

- [ ] 10.2 Update FormTextarea story.
- [ ] 10.3 Run `npx tsc --noEmit`.
- [ ] 10.4 Commit: `feat(ds): rewrite FormTextarea to AntD Input.TextArea wrapper`

---

## Task 11: Select

Replace the custom dropdown UI with AntD `Select`. The current component has `searchable`, `options`, `value`, `onChange`, `placeholder`, and `label` props.

**Files:**
- Modify: `src/components/ds/Select.tsx`
- Test: `src/components/ds/stories/Select.stories.tsx`

### Steps

- [ ] 11.1 Rewrite `Select.tsx`:

```tsx
"use client";

import { Select as AntSelect } from "antd";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  label?: string;
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchable = false,
  label,
  className,
}: SelectProps) {
  return (
    <div className={className}>
      {label && (
        <label style={{ display: "block", marginBottom: 4, fontSize: 14, color: "var(--ant-color-text-secondary)" }}>
          {label}
        </label>
      )}
      <AntSelect
        value={value || undefined}
        onChange={onChange}
        placeholder={placeholder}
        showSearch={searchable}
        optionFilterProp="label"
        options={options}
        style={{ width: "100%" }}
      />
    </div>
  );
}
```

- [ ] 11.2 Update Select story.
- [ ] 11.3 Run `npx tsc --noEmit`.
- [ ] 11.4 Commit: `feat(ds): rewrite Select to AntD Select wrapper`

---

## Task 12: AsyncSelect

Replace the fetch-and-render pattern with AntD `Select` using remote search.

**Files:**
- Modify: `src/components/ds/AsyncSelect.tsx`
- Test: `src/components/ds/stories/AsyncSelect.stories.tsx`

### Steps

- [ ] 12.1 Rewrite `AsyncSelect.tsx`:

```tsx
"use client";

import { Select, Spin } from "antd";
import { useState, useEffect } from "react";

interface AsyncSelectProps {
  url: string;
  mapOption: (item: Record<string, unknown>) => { value: string; label: string };
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function AsyncSelect({
  url,
  mapOption,
  value,
  onChange,
  label,
  placeholder = "Select...",
  className,
}: AsyncSelectProps) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((data: Record<string, unknown>[]) => {
        setOptions(data.map(mapOption));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url, mapOption]);

  return (
    <div className={className}>
      {label && (
        <label style={{ display: "block", marginBottom: 4, fontSize: 14, color: "var(--ant-color-text-secondary)" }}>
          {label}
        </label>
      )}
      <Select
        value={value || undefined}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        loading={loading}
        notFoundContent={loading ? <Spin size="small" /> : undefined}
        showSearch
        optionFilterProp="label"
        style={{ width: "100%" }}
      />
    </div>
  );
}
```

- [ ] 12.2 Update AsyncSelect story.
- [ ] 12.3 Run `npx tsc --noEmit`.
- [ ] 12.4 Commit: `feat(ds): rewrite AsyncSelect to AntD Select wrapper with async loading`

---

## Task 13: Dropdown

Map the `items` array to AntD's `menu.items` format. AntD Dropdown handles click-outside natively.

**Files:**
- Modify: `src/components/ds/Dropdown.tsx`
- Test: `src/components/ds/stories/Dropdown.stories.tsx`

### Steps

- [ ] 13.1 Rewrite `Dropdown.tsx`:

```tsx
"use client";

import { Dropdown as AntDropdown, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

export interface DropdownItem {
  label: string;
  value: string;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  align?: "left" | "right";
  className?: string;
}

export function DropdownTriggerButton() {
  return (
    <Button type="text" icon={<EllipsisOutlined />} size="small" />
  );
}

function toMenuItems(items: DropdownItem[]): MenuProps["items"] {
  return items.map((item) => {
    if (item.divider) {
      return { type: "divider" as const, key: item.value };
    }
    return {
      key: item.value,
      label: item.label,
      danger: item.danger,
    };
  });
}

export default function Dropdown({ trigger, items, onSelect, align = "left", className }: DropdownProps) {
  const menuProps: MenuProps = {
    items: toMenuItems(items),
    onClick: ({ key }) => onSelect(key),
  };

  return (
    <AntDropdown
      menu={menuProps}
      trigger={["click"]}
      placement={align === "right" ? "bottomRight" : "bottomLeft"}
      className={className}
    >
      <span style={{ cursor: "pointer" }}>{trigger}</span>
    </AntDropdown>
  );
}
```

- [ ] 13.2 Update Dropdown story.
- [ ] 13.3 Run `npx tsc --noEmit`.
- [ ] 13.4 Commit: `feat(ds): rewrite Dropdown to AntD Dropdown wrapper`

---

## Task 14: Tab

Map `TabItem[]` to AntD `Tabs` items format. Handle both link mode (Next.js `Link`) and controlled mode.

**Files:**
- Modify: `src/components/ds/Tab.tsx`
- Test: `src/components/ds/stories/Tab.stories.tsx`

### Steps

- [ ] 14.1 Rewrite `Tab.tsx`:

```tsx
"use client";

import { Tabs, Badge } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface TabItem {
  label: string;
  value: string;
  badge?: string;
  href?: string;
}

interface TabProps {
  items: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function Tab({ items, value, onChange, className }: TabProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isLinkMode = items.some((item) => item.href);

  function isActive(item: TabItem): boolean {
    if (isLinkMode && item.href) {
      const isFirstItem = items[0]?.value === item.value;
      if (isFirstItem) return pathname === item.href;
      return pathname.startsWith(item.href);
    }
    return value === item.value;
  }

  const activeKey = items.find((item) => isActive(item))?.value ?? value;

  const tabItems = items.map((item) => ({
    key: item.value,
    label: (
      <span>
        {isLinkMode && item.href ? (
          <Link href={item.href} style={{ color: "inherit", textDecoration: "none" }}>
            {item.label}
          </Link>
        ) : (
          item.label
        )}
        {item.badge && (
          <Badge
            count={item.badge}
            size="small"
            style={{ marginLeft: 6 }}
          />
        )}
      </span>
    ),
  }));

  function handleChange(key: string) {
    if (isLinkMode) {
      const item = items.find((i) => i.value === key);
      if (item?.href) router.push(item.href);
    } else {
      onChange?.(key);
    }
  }

  return (
    <Tabs
      activeKey={activeKey}
      onChange={handleChange}
      items={tabItems}
      className={className}
    />
  );
}

export type { TabItem, TabProps };
```

- [ ] 14.2 Update Tab story.
- [ ] 14.3 Run `npx tsc --noEmit`.
- [ ] 14.4 Commit: `feat(ds): rewrite Tab to AntD Tabs wrapper with link mode support`

---

## Task 15: SearchBar

Wrap AntD `Input.Search`.

**Files:**
- Modify: `src/components/ds/SearchBar.tsx`
- Test: `src/components/ds/stories/SearchBar.stories.tsx`

### Steps

- [ ] 15.1 Rewrite `SearchBar.tsx`:

```tsx
"use client";

import { Input } from "antd";
import { useState } from "react";

const { Search } = Input;

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  defaultValue?: string;
}

export default function SearchBar({ placeholder = "Search...", onSearch, defaultValue = "" }: SearchBarProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Search
        placeholder={placeholder}
        defaultValue={defaultValue}
        onSearch={onSearch}
        enterButton="Search"
        allowClear
      />
    </div>
  );
}
```

- [ ] 15.2 Update SearchBar story.
- [ ] 15.3 Run `npx tsc --noEmit`.
- [ ] 15.4 Commit: `feat(ds): rewrite SearchBar to AntD Input.Search wrapper`

---

## Task 16: Pagination

Wrap AntD `Pagination`. Map existing props to AntD equivalents.

**Files:**
- Modify: `src/components/ds/Pagination.tsx`
- Test: `src/components/ds/stories/Pagination.stories.tsx`

### Steps

- [ ] 16.1 Rewrite `Pagination.tsx`:

```tsx
"use client";

import { Pagination as AntPagination } from "antd";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  showPageSize?: boolean;
  onPageChange?: (page: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
  showPageSize = true,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationProps) {
  const total = totalItems ?? totalPages * itemsPerPage;

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--ant-color-border)", padding: "12px 16px" }}>
      <AntPagination
        current={currentPage}
        total={total}
        pageSize={itemsPerPage}
        onChange={(page) => onPageChange?.(page)}
        onShowSizeChange={(_current, size) => onPageSizeChange?.(size)}
        showSizeChanger={showPageSize && !!pageSizeOptions}
        pageSizeOptions={pageSizeOptions?.map(String)}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        size="small"
      />
    </div>
  );
}
```

- [ ] 16.2 Update Pagination story.
- [ ] 16.3 Run `npx tsc --noEmit`.
- [ ] 16.4 Commit: `feat(ds): rewrite Pagination to AntD wrapper`

---

## Task 17: List

Wrap AntD `List` component. The current component renders label-value pairs.

**Files:**
- Modify: `src/components/ds/List.tsx`
- Test: `src/components/ds/stories/List.stories.tsx`

### Steps

- [ ] 17.1 Rewrite `List.tsx`:

```tsx
"use client";

import { List as AntList, Flex } from "antd";

interface ListItem {
  label: string;
  value: React.ReactNode;
}

interface ListProps {
  items: ListItem[];
  labelWidth?: string;
  className?: string;
}

export default function List({ items, labelWidth, className }: ListProps) {
  return (
    <AntList
      className={className}
      dataSource={items}
      split={false}
      renderItem={(item) => (
        <AntList.Item style={{ padding: "4px 0", border: "none" }}>
          <Flex gap={64}>
            <span style={{ width: labelWidth || 112, flexShrink: 0, fontSize: 14, color: "var(--ant-color-text-secondary)" }}>
              {item.label}
            </span>
            <span style={{ fontSize: 14 }}>
              {item.value}
            </span>
          </Flex>
        </AntList.Item>
      )}
    />
  );
}
```

- [ ] 17.2 Update List story.
- [ ] 17.3 Run `npx tsc --noEmit`.
- [ ] 17.4 Commit: `feat(ds): rewrite List to AntD List wrapper`

---

## Task 18: Stat

Wrap AntD `Statistic`.

**Files:**
- Modify: `src/components/ds/Stat.tsx`
- Test: `src/components/ds/stories/Stat.stories.tsx`

### Steps

- [ ] 18.1 Rewrite `Stat.tsx`:

```tsx
"use client";

import { Statistic } from "antd";

interface StatProps {
  value: React.ReactNode;
  label: string;
  className?: string;
}

export default function Stat({ value, label, className }: StatProps) {
  return (
    <div style={{ textAlign: "center" }} className={className}>
      <Statistic
        title={label}
        value={typeof value === "string" || typeof value === "number" ? value : undefined}
        formatter={typeof value !== "string" && typeof value !== "number" ? () => value : undefined}
      />
    </div>
  );
}
```

- [ ] 18.2 Update Stat story.
- [ ] 18.3 Run `npx tsc --noEmit`.
- [ ] 18.4 Commit: `feat(ds): rewrite Stat to AntD Statistic wrapper`

---

## Task 19: DateRangeFilter

Wrap AntD `DatePicker.RangePicker`.

**Files:**
- Modify: `src/components/ds/DateRangeFilter.tsx`
- Test: `src/components/ds/stories/DateRangeFilter.stories.tsx`

### Steps

- [ ] 19.1 Rewrite `DateRangeFilter.tsx`:

```tsx
"use client";

import { DatePicker, Flex } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartChange?: (date: string) => void;
  onEndChange?: (date: string) => void;
  className?: string;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  className,
}: DateRangeFilterProps) {
  const value: [dayjs.Dayjs | null, dayjs.Dayjs | null] = [
    startDate ? dayjs(startDate) : null,
    endDate ? dayjs(endDate) : null,
  ];

  return (
    <div className={className}>
      <RangePicker
        value={value}
        onChange={(dates) => {
          if (dates) {
            onStartChange?.(dates[0]?.format("YYYY-MM-DD") ?? "");
            onEndChange?.(dates[1]?.format("YYYY-MM-DD") ?? "");
          } else {
            onStartChange?.("");
            onEndChange?.("");
          }
        }}
        format="DD/MM/YYYY"
      />
    </div>
  );
}
```

**Dependency note:** AntD DatePicker uses `dayjs` internally. Add `dayjs` to `package.json` if not already installed. (It is a dependency of `antd` so it will be available, but add an explicit dependency for direct import.)

- [ ] 19.2 Run `npm ls dayjs` to check. If missing as direct dep, run `npm install dayjs`.
- [ ] 19.3 Update DateRangeFilter story.
- [ ] 19.4 Run `npx tsc --noEmit`.
- [ ] 19.5 Commit: `feat(ds): rewrite DateRangeFilter to AntD RangePicker wrapper`

---

## Task 20: Filter

The current Filter is a segmented button group — this maps well to AntD `Segmented` component.

**Files:**
- Modify: `src/components/ds/Filter.tsx`
- Test: `src/components/ds/stories/Filter.stories.tsx`

### Steps

- [ ] 20.1 Rewrite `Filter.tsx`:

```tsx
"use client";

import { Segmented } from "antd";

interface FilterItem {
  label: string | React.ReactNode;
  value: string;
}

interface FilterProps {
  items: FilterItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Filter({ items, value, onChange, className }: FilterProps) {
  return (
    <Segmented
      options={items.map((item) => ({
        label: item.label,
        value: item.value,
      }))}
      value={value}
      onChange={(val) => onChange(val as string)}
      className={className}
    />
  );
}
```

- [ ] 20.2 Update Filter story.
- [ ] 20.3 Run `npx tsc --noEmit`.
- [ ] 20.4 Commit: `feat(ds): rewrite Filter to AntD Segmented wrapper`

---

## Task 21: DataTable (Major Rewrite)

**This is the largest task.** Replace the primitive JSX table (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`) and exported sub-components (`TableHead`, `Th`, `TableBody`, `Td`, `Tr`, `LinkCell`, `ActionsCell`, `ExpandableRow`) with a single `DataTable` component backed by AntD `Table`.

The new API uses a `columns` array and `dataSource` prop instead of inline JSX `.map()` loops. This is a **breaking change** — pages must be updated in Phase 3 to use the new column definition system.

**Files:**
- Modify: `src/components/ds/DataTable.tsx`
- Test: `src/components/ds/stories/DataTable.stories.tsx`

### New DataTable API

```tsx
"use client";

import { Table, Dropdown, Button, Flex } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import type { TableProps, ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import type { DropdownItem } from "./Dropdown";
import type { MenuProps } from "antd";
import type { Key, ReactNode } from "react";

// ─── Column Definition ─────────────────────────────────────────────────────

export interface DataTableColumn<T> {
  /** Unique key matching a field in T (or arbitrary string for custom render) */
  key: string;
  /** Column header text */
  title: string | ReactNode;
  /** Field path in the data record (defaults to key) */
  dataIndex?: string | string[];
  /** Text alignment */
  align?: "left" | "right" | "center";
  /** Enable sorting */
  sortable?: boolean;
  /** Custom sort function */
  sorter?: (a: T, b: T) => number;
  /** Enable filtering — provide filter options */
  filters?: { text: string; value: string }[];
  /** Custom filter function */
  onFilter?: (value: string, record: T) => boolean;
  /** Custom cell renderer */
  render?: (value: unknown, record: T, index: number) => ReactNode;
  /** Hide column below this breakpoint */
  responsive?: ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[];
  /** Fixed width */
  width?: number | string;
  /** Whether column is fixed */
  fixed?: "left" | "right";
}

// ─── Props ──────────────────────────────────────────────────────────────────

export interface DataTableProps<T extends Record<string, unknown>> {
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Data array — each item must have a unique `id` or `key` field */
  dataSource: T[];
  /** Field to use as row key (default: "id") */
  rowKey?: string | ((record: T) => Key);
  /** Loading state */
  loading?: boolean;
  /** Minimum table width for horizontal scroll */
  minWidth?: number;

  // ─── Pagination ───────────────────────────────────────────────────────
  /** Pagination config, or false to disable */
  pagination?: false | {
    current?: number;
    pageSize?: number;
    total?: number;
    onChange?: (page: number, pageSize: number) => void;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    showTotal?: (total: number, range: [number, number]) => string;
  };

  // ─── Row Selection ────────────────────────────────────────────────────
  /** Enable row selection checkboxes */
  rowSelection?: {
    selectedRowKeys: Key[];
    onChange: (keys: Key[], rows: T[]) => void;
  };

  // ─── Row Expansion ────────────────────────────────────────────────────
  /** Expandable row config */
  expandable?: {
    expandedRowRender: (record: T) => ReactNode;
    rowExpandable?: (record: T) => boolean;
  };

  // ─── Row Actions ──────────────────────────────────────────────────────
  /** Row click handler */
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
    style?: React.CSSProperties;
  };

  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  dataSource,
  rowKey = "id",
  loading,
  minWidth,
  pagination,
  rowSelection,
  expandable,
  onRow,
  className,
}: DataTableProps<T>) {
  // Convert our column defs to AntD ColumnsType
  const antColumns: ColumnsType<T> = columns.map((col) => ({
    key: col.key,
    title: col.title,
    dataIndex: col.dataIndex ?? col.key,
    align: col.align,
    sorter: col.sortable ? (col.sorter ?? true) : undefined,
    filters: col.filters,
    onFilter: col.onFilter
      ? (value: boolean | Key, record: T) => col.onFilter!(String(value), record)
      : undefined,
    render: col.render
      ? (_value: unknown, record: T, index: number) => col.render!(_value, record, index)
      : undefined,
    responsive: col.responsive,
    width: col.width,
    fixed: col.fixed,
  }));

  return (
    <Table<T>
      columns={antColumns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      scroll={minWidth ? { x: minWidth } : undefined}
      pagination={pagination === false ? false : pagination ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: pagination.onChange,
        showSizeChanger: pagination.showSizeChanger,
        pageSizeOptions: pagination.pageSizeOptions?.map(String),
        showTotal: pagination.showTotal ?? ((total, range) => `${range[0]}-${range[1]} of ${total} items`),
        size: "small",
      } : undefined}
      rowSelection={rowSelection ? {
        type: "checkbox",
        selectedRowKeys: rowSelection.selectedRowKeys,
        onChange: rowSelection.onChange as (keys: Key[], rows: T[]) => void,
      } : undefined}
      expandable={expandable ? {
        expandedRowRender: (record) => expandable.expandedRowRender(record),
        rowExpandable: expandable.rowExpandable,
      } : undefined}
      onRow={onRow ? (record, index) => onRow(record, index ?? 0) : undefined}
      className={className}
      size="middle"
    />
  );
}

// ─── Helper Components ──────────────────────────────────────────────────────

// These are re-exported for backward compatibility during migration.
// Pages should migrate to column definitions. After Phase 3, remove these.

/** @deprecated Use DataTableColumn.render with <a> tag instead */
export function LinkCell({ children, href, onClick, className }: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  if (href) {
    return <a href={href} className={className} style={{ color: "var(--ant-color-primary)" }}>{children}</a>;
  }
  return <button onClick={onClick} className={className} style={{ color: "var(--ant-color-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>{children}</button>;
}

/** @deprecated Use DataTableColumn with a render function that includes a Dropdown */
export function ActionsCell({ items, onSelect }: {
  items: DropdownItem[];
  onSelect?: (value: string) => void;
}) {
  const menuItems: MenuProps["items"] = items.map((item) =>
    item.divider
      ? { type: "divider" as const, key: item.value }
      : { key: item.value, label: item.label, danger: item.danger }
  );

  return (
    <Dropdown menu={{ items: menuItems, onClick: ({ key }) => onSelect?.(key) }} trigger={["click"]}>
      <Button type="text" icon={<EllipsisOutlined />} size="small" />
    </Dropdown>
  );
}

// Legacy sub-components — exported for backward compat during Phase 3 migration
// TODO: Remove after all pages are migrated to column definitions
/** @deprecated Use DataTable with columns prop */
export function TableHead({ children }: { children: ReactNode }) {
  return <thead><tr>{children}</tr></thead>;
}
/** @deprecated Use DataTableColumn instead */
export function Th({ children }: { children?: ReactNode; align?: string; className?: string; hidden?: string; sortable?: boolean; sortDirection?: string | null; onSort?: () => void; filterable?: boolean; onFilter?: () => void }) {
  return <th>{children}</th>;
}
/** @deprecated Use DataTable with dataSource prop */
export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}
/** @deprecated Use DataTableColumn.render instead */
export function Td({ children }: { children?: ReactNode; align?: string; className?: string; hidden?: string }) {
  return <td>{children}</td>;
}
/** @deprecated Use onRow prop instead */
export function Tr({ children, ...props }: { children: ReactNode; hover?: boolean; clickable?: boolean; selected?: boolean; className?: string } & React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props}>{children}</tr>;
}
/** @deprecated Use expandable prop instead */
export function ExpandableRow({ children }: { children: ReactNode; expandContent: ReactNode; colSpan: number; expanded?: boolean; onToggle?: () => void; hover?: boolean; className?: string }) {
  return <tr>{children}</tr>;
}
```

### Usage Example (how a page migrates)

**Before (Tailwind inline JSX):**
```tsx
<DataTable>
  <TableHead>
    <Th sortable sortDirection={sort} onSort={() => toggleSort()}>Name</Th>
    <Th>Email</Th>
    <Th hidden="sm">Phone</Th>
    <Th align="right">Actions</Th>
  </TableHead>
  <TableBody>
    {clients.map((client) => (
      <Tr key={client.id} clickable onClick={() => navigate(client.id)}>
        <Td><LinkCell href={`/clients/${client.id}`}>{client.name}</LinkCell></Td>
        <Td>{client.email}</Td>
        <Td hidden="sm">{client.phone}</Td>
        <ActionsCell items={[{ label: "Edit", value: "edit" }]} onSelect={handleAction} />
      </Tr>
    ))}
  </TableBody>
</DataTable>
```

**After (AntD column definitions):**
```tsx
const columns: DataTableColumn<Client>[] = [
  {
    key: "name",
    title: "Name",
    sortable: true,
    render: (_, client) => <a href={`/clients/${client.id}`} style={{ color: "var(--ant-color-primary)" }}>{client.name}</a>,
  },
  {
    key: "email",
    title: "Email",
  },
  {
    key: "phone",
    title: "Phone",
    responsive: ["sm", "md", "lg", "xl", "xxl"],
  },
  {
    key: "actions",
    title: "Actions",
    align: "right",
    width: 80,
    render: (_, client) => (
      <ActionsCell items={[{ label: "Edit", value: "edit" }]} onSelect={(action) => handleAction(action, client)} />
    ),
  },
];

<DataTable columns={columns} dataSource={clients} rowKey="id" onRow={(client) => ({ onClick: () => navigate(client.id), style: { cursor: "pointer" } })} />
```

### Steps

- [ ] 21.1 Rewrite `DataTable.tsx` with the full implementation above.
- [ ] 21.2 Export `DataTableColumn` and `DataTableProps` types from the barrel.
- [ ] 21.3 Rewrite the DataTable Storybook story to demonstrate the new API with column definitions, sorting, filtering, pagination, row expansion, and row selection.
- [ ] 21.4 Run `npx tsc --noEmit` — fix any type errors. Note: legacy sub-components may cause warnings; that's expected during the transition.
- [ ] 21.5 Commit: `feat(ds): rewrite DataTable to AntD Table wrapper with column definition API`

---

## Task 22: Text (Custom Typography)

Text remains a custom component. Remove Tailwind utility classes and use CSS Modules + AntD tokens. Apply Sprig Sans font-family for display variants via CSS Module.

**Files:**
- Modify: `src/components/ds/Text.tsx`
- Create: `src/components/ds/Text.module.css`
- Test: `src/components/ds/stories/Text.stories.tsx`

### Steps

- [ ] 22.1 Create `Text.module.css`:

```css
/* Display variants use Sprig Sans */
.displayLg {
  font-family: 'Sprig Sans', 'Inter', sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
}

.displayMd {
  font-family: 'Sprig Sans', 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
}

.displaySm {
  font-family: 'Sprig Sans', 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
}

/* Heading variants use Inter (inherited from AntD theme) */
.headingLg {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.headingMd {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

.headingSm {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.57;
}

/* Body variants */
.bodyLg {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}

.bodyMd {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.57;
}

.bodySm {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.67;
}

.bodyMdStrong {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.57;
}

.bodyLgStrong {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

/* Label variants */
.labelLg {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.57;
}

.labelMd {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.67;
}

.labelSm {
  font-size: 11px;
  font-weight: 500;
  line-height: 1.5;
}

/* Caption variants */
.captionMd {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.67;
}

.captionSm {
  font-size: 11px;
  font-weight: 400;
  line-height: 1.5;
}

/* Metric variants */
.metricLg {
  font-family: 'Sprig Sans', 'Inter', sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.metricMd {
  font-family: 'Sprig Sans', 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
  font-variant-numeric: tabular-nums;
}
```

- [ ] 22.2 Rewrite `Text.tsx`:

```tsx
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Text.module.css";

export type TextVariant =
  | "display/lg" | "display/md" | "display/sm"
  | "heading/lg" | "heading/md" | "heading/sm"
  | "body/lg" | "body/md" | "body/sm" | "body/md-strong" | "body/lg-strong"
  | "label/lg" | "label/md" | "label/sm"
  | "caption/md" | "caption/sm"
  | "metric/lg" | "metric/md";

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant: TextVariant;
  as?: ElementType;
  color?: string;
  children: ReactNode;
}

const variantClass: Record<TextVariant, string> = {
  "display/lg": styles.displayLg,
  "display/md": styles.displayMd,
  "display/sm": styles.displaySm,
  "heading/lg": styles.headingLg,
  "heading/md": styles.headingMd,
  "heading/sm": styles.headingSm,
  "body/lg": styles.bodyLg,
  "body/md": styles.bodyMd,
  "body/sm": styles.bodySm,
  "body/md-strong": styles.bodyMdStrong,
  "body/lg-strong": styles.bodyLgStrong,
  "label/lg": styles.labelLg,
  "label/md": styles.labelMd,
  "label/sm": styles.labelSm,
  "caption/md": styles.captionMd,
  "caption/sm": styles.captionSm,
  "metric/lg": styles.metricLg,
  "metric/md": styles.metricMd,
};

const defaultElement: Record<string, ElementType> = {
  display: "h1",
  heading: "h2",
  body: "p",
  label: "span",
  caption: "span",
  metric: "span",
};

function getCategory(variant: TextVariant): string {
  return variant.split("/")[0];
}

export default function Text({ variant, as, color, className = "", children, style, ...props }: TextProps) {
  const Component = as ?? defaultElement[getCategory(variant)] ?? "span";
  const classes = [variantClass[variant], className].filter(Boolean).join(" ");
  const mergedStyle = color ? { ...style, color } : style;

  return (
    <Component className={classes} style={mergedStyle} {...props}>
      {children}
    </Component>
  );
}
```

**API change note:** The `color` prop now accepts CSS colour values directly (e.g. `"var(--ant-color-text-secondary)"`) instead of Tailwind classes (e.g. `"text-text-secondary"`). Pages using the `color` prop must be updated in Phase 3.

- [ ] 22.3 Update the Text story.
- [ ] 22.4 Run `npx tsc --noEmit`.
- [ ] 22.5 Commit: `feat(ds): rewrite Text to CSS Module-based typography with Sprig Sans support`

---

## Task 23: Custom Display Components

**Components:** ColorDot, Chip, OnOffBadge, Status, HintIcon, IconText, EmptyState

Rewrite to use AntD tokens (via `theme.useToken()`) and CSS Modules instead of Tailwind classes.

**Files:**
- Modify: `src/components/ds/ColorDot.tsx`
- Modify: `src/components/ds/Chip.tsx`
- Modify: `src/components/ds/OnOffBadge.tsx`
- Modify: `src/components/ds/Status.tsx`
- Modify: `src/components/ds/HintIcon.tsx`
- Modify: `src/components/ds/IconText.tsx`
- Modify: `src/components/ds/EmptyState.tsx`
- Create: `src/components/ds/Chip.module.css` (for variant colours)
- Create: `src/components/ds/Status.module.css` (for colour dot)
- Test: all 7 corresponding story files

### Steps

- [ ] 23.1 Rewrite `ColorDot.tsx` — replace Tailwind size classes with inline styles:

```tsx
interface ColorDotProps {
  color: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { xs: 8, sm: 12, md: 16, lg: 20 };

export default function ColorDot({ color, size = "sm", className }: ColorDotProps) {
  const px = sizeMap[size];
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        flexShrink: 0,
        width: px,
        height: px,
        borderRadius: "50%",
        backgroundColor: color,
      }}
    />
  );
}
```

- [ ] 23.2 Rewrite `Chip.tsx` — use AntD `Tag` with `closable` prop for `onRemove`, and a CSS Module for variant colours:

```tsx
"use client";

import { Tag, theme } from "antd";
import { CloseOutlined } from "@ant-design/icons";

type ChipVariant = "green" | "purple" | "yellow" | "blue" | "red" | "gray";

interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  onRemove?: () => void;
  className?: string;
}

const colorMap: Record<ChipVariant, string> = {
  green: "success",
  purple: "purple",
  yellow: "warning",
  blue: "processing",
  red: "error",
  gray: "default",
};

export default function Chip({ children, variant = "gray", onRemove, className }: ChipProps) {
  return (
    <Tag
      color={colorMap[variant]}
      closable={!!onRemove}
      onClose={onRemove}
      className={className}
      style={{ borderRadius: 9999, padding: "4px 12px", fontSize: 14, fontWeight: 500 }}
    >
      {children}
    </Tag>
  );
}
```

- [ ] 23.3 Rewrite `OnOffBadge.tsx` — use AntD tokens for colours:

```tsx
"use client";

import { theme } from "antd";

interface OnOffBadgeProps {
  value: boolean;
  onLabel?: string;
  offLabel?: string;
}

export default function OnOffBadge({ value, onLabel = "On", offLabel = "Off" }: OnOffBadgeProps) {
  const { token } = theme.useToken();
  return (
    <span style={{ color: value ? token.colorSuccess : token.colorError }}>
      {value ? onLabel : offLabel}
    </span>
  );
}
```

- [ ] 23.4 Rewrite `Status.tsx` — use AntD tokens for dot colours:

```tsx
"use client";

import { Badge, Flex } from "antd";

type StatusColor = "green" | "red" | "yellow" | "blue" | "gray" | "purple" | "orange";

interface StatusProps {
  color?: StatusColor;
  label?: string;
  className?: string;
}

const colorMap: Record<StatusColor, string> = {
  green: "#00C269",
  red: "#D00032",
  yellow: "#FFD232",
  blue: "#5578FF",
  gray: "#b8bcc0",
  purple: "#8250FF",
  orange: "#f97316",
};

export default function Status({ color = "gray", label, className }: StatusProps) {
  return (
    <Flex align="center" gap={8} className={className}>
      <Badge color={colorMap[color]} />
      {label && <span style={{ fontSize: 14 }}>{label}</span>}
    </Flex>
  );
}
```

**Note:** Colour values above reference the canonical colour tokens doc. `#00C269` = success-600, `#D00032` = critical-600, `#FFD232` = warning-600, `#5578FF` = info-600, `#b8bcc0` = cool-black-600, `#8250FF` = violet-600.

- [ ] 23.5 Rewrite `HintIcon.tsx` — use AntD `Tooltip`:

```tsx
"use client";

import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface HintIconProps {
  tooltip?: string;
  className?: string;
}

export default function HintIcon({ tooltip, className }: HintIconProps) {
  return (
    <Tooltip title={tooltip}>
      <InfoCircleOutlined
        className={className}
        style={{ fontSize: 14, color: "var(--ant-color-text-quaternary)", cursor: "help", marginLeft: 2 }}
      />
    </Tooltip>
  );
}
```

- [ ] 23.6 Rewrite `IconText.tsx` — use AntD `Flex`:

```tsx
import { Flex } from "antd";

interface IconTextProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function IconText({ icon, children, className }: IconTextProps) {
  return (
    <Flex align="center" gap={8} className={className} style={{ fontSize: 14, color: "var(--ant-color-text-secondary)" }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span>{children}</span>
    </Flex>
  );
}
```

- [ ] 23.7 Rewrite `EmptyState.tsx` — use AntD `Empty` as inspiration but keep custom layout:

```tsx
"use client";

import { Flex, theme } from "antd";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  const { token } = theme.useToken();

  return (
    <Flex vertical align="center" justify="center" className={className} style={{ padding: "64px 0" }}>
      {icon && (
        <div style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 96,
          height: 96,
          borderRadius: "50%",
          backgroundColor: token.colorFillTertiary,
        }}>
          {icon}
        </div>
      )}
      {title && <h3 style={{ marginBottom: 4, fontSize: 14, fontWeight: 600 }}>{title}</h3>}
      <p style={{ fontSize: 14, color: token.colorTextSecondary }}>{message}</p>
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </Flex>
  );
}
```

- [ ] 23.8 Verify all 7 stories render correctly in Storybook.
- [ ] 23.9 Run `npx tsc --noEmit`.
- [ ] 23.10 Commit: `feat(ds): rewrite custom display components to AntD tokens + CSS Modules`

---

## Task 24: Custom Form Components

**Components:** FileUpload, FormColorPicker

**Files:**
- Modify: `src/components/ds/FileUpload.tsx`
- Modify: `src/components/ds/FormColorPicker.tsx`
- Test: `src/components/ds/stories/FileUpload.stories.tsx`
- Test: `src/components/ds/stories/FormColorPicker.stories.tsx`

### Steps

- [ ] 24.1 Rewrite `FileUpload.tsx` — use AntD tokens for styling:

```tsx
"use client";

import { theme, Flex } from "antd";

interface FileUploadProps {
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export default function FileUpload({ icon, label = "Upload", className, onClick }: FileUploadProps) {
  const { token } = theme.useToken();

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={12}
      className={className}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={{
        padding: 24,
        borderRadius: token.borderRadius,
        border: `2px dashed ${token.colorBorder}`,
        backgroundColor: token.colorFillTertiary,
        cursor: onClick ? "pointer" : undefined,
        transition: "border-color 0.2s, background-color 0.2s",
      }}
    >
      {icon && <div>{icon}</div>}
      {label && (
        <span style={{
          padding: "6px 16px",
          borderRadius: token.borderRadius,
          border: `1px solid ${token.colorBorder}`,
          backgroundColor: token.colorBgContainer,
          fontSize: 14,
          fontWeight: 500,
        }}>
          {label}
        </span>
      )}
    </Flex>
  );
}
```

- [ ] 24.2 Rewrite `FormColorPicker.tsx` — evaluate AntD `ColorPicker` for native variant, keep swatch grid for swatches variant:

```tsx
"use client";

import { ColorPicker, Flex, theme } from "antd";

const DEFAULT_SWATCHES = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#78716c", "#6b7280", "#1e293b",
];

interface FormColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  variant?: "native" | "swatches";
  swatches?: string[];
}

export default function FormColorPicker({
  label = "Colour",
  value,
  onChange,
  variant = "native",
  swatches = DEFAULT_SWATCHES,
}: FormColorPickerProps) {
  const { token } = theme.useToken();

  return (
    <div>
      <label style={{ display: "block", marginBottom: 4, fontSize: 14, color: token.colorTextSecondary }}>
        {label}
      </label>
      {variant === "swatches" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8 }}>
          {swatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => onChange(swatch)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: swatch,
                border: "none",
                cursor: "pointer",
                outline: value === swatch ? `2px solid ${token.colorPrimary}` : "none",
                outlineOffset: 2,
                transition: "transform 0.15s",
              }}
              aria-label={`Select colour ${swatch}`}
            />
          ))}
        </div>
      ) : (
        <Flex align="center" gap={12}>
          <ColorPicker
            value={value}
            onChange={(_, hex) => onChange(hex)}
          />
          <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{value}</span>
        </Flex>
      )}
    </div>
  );
}
```

- [ ] 24.3 Verify both stories render correctly.
- [ ] 24.4 Run `npx tsc --noEmit`.
- [ ] 24.5 Commit: `feat(ds): rewrite FileUpload and FormColorPicker to AntD tokens`

---

## Task 25: Custom Layout Components

**Components:** PageHeader, Navbar, TopNav, SideNav, SettingsListPage

These are Splose-specific layout patterns. Rewrite to use AntD layout tokens, `Flex`, and CSS Modules. Replace Lucide icons with @ant-design/icons.

**Files:**
- Modify: `src/components/ds/PageHeader.tsx`
- Modify: `src/components/ds/Navbar.tsx`
- Modify: `src/components/ds/TopNav.tsx`
- Create: `src/components/ds/TopNav.module.css`
- Modify: `src/components/ds/SideNav.tsx`
- Create: `src/components/ds/SideNav.module.css`
- Modify: `src/components/ds/SettingsListPage.tsx`
- Test: all 5 corresponding story files

### Steps

- [ ] 25.1 Rewrite `PageHeader.tsx`:

```tsx
import { Flex } from "antd";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <Flex justify="space-between" align="center" wrap="wrap" gap={12} style={{ marginTop: 4, marginBottom: 16 }}>
      <h1 style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Sprig Sans', 'Inter', sans-serif", lineHeight: 1.2 }}>{title}</h1>
      {children && <Flex align="center" gap={8}>{children}</Flex>}
    </Flex>
  );
}
```

- [ ] 25.2 Rewrite `Navbar.tsx` — replace `ArrowLeft` with `ArrowLeftOutlined`:

```tsx
"use client";

import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Flex, theme } from "antd";

interface NavbarProps {
  backHref: string;
  title: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Navbar({ backHref, title, badge, children }: NavbarProps) {
  const { token } = theme.useToken();

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        borderBottom: `1px solid ${token.colorBorder}`,
        backgroundColor: token.colorBgContainer,
        padding: "12px 24px",
      }}
    >
      <Flex align="center" gap={12}>
        <Link href={backHref} style={{ color: token.colorTextSecondary, display: "flex", alignItems: "center" }}>
          <ArrowLeftOutlined style={{ fontSize: 14 }} />
        </Link>
        <h1 style={{ fontSize: 18, fontWeight: 600 }}>{title}</h1>
        {badge}
      </Flex>
      {children && <Flex align="center" gap={8}>{children}</Flex>}
    </Flex>
  );
}
```

- [ ] 25.3 Rewrite `TopNav.tsx` — replace Lucide icons (`Menu`, `X`, `ChevronDown`) with `MenuOutlined`, `CloseOutlined`, `DownOutlined`. Create `TopNav.module.css` for navigation link styles (active state, border-top indicator, responsive behaviour). Keep the "More" overflow measurement logic. This is a complex component — preserve the existing responsive behaviour while removing all Tailwind classes.

- [ ] 25.4 Rewrite `SideNav.tsx` — create `SideNav.module.css` for section headers, active link styles, and layout. Keep the `isActive` logic for pathname matching.

- [ ] 25.5 Rewrite `SettingsListPage.tsx` — update internal usage to use the new DS component APIs. This component imports from `@/components/ds` so it will automatically pick up the new wrappers. Remove any remaining Tailwind classes in the template markup, replacing with AntD `Flex` and inline styles referencing AntD tokens.

- [ ] 25.6 Verify all 5 stories render correctly.
- [ ] 25.7 Run `npx tsc --noEmit`.
- [ ] 25.8 Commit: `feat(ds): rewrite layout components (PageHeader, Navbar, TopNav, SideNav, SettingsListPage) to AntD tokens`

---

## Task 26: Custom Modal Components

**Components:** EmailPreview, ReorderModal

Both use Modal internally — they will automatically benefit from the Modal rewrite. Replace remaining Tailwind classes with AntD tokens and CSS Modules.

**Files:**
- Modify: `src/components/ds/EmailPreview.tsx`
- Modify: `src/components/ds/ReorderModal.tsx`
- Test: `src/components/ds/stories/EmailPreview.stories.tsx`
- Test: `src/components/ds/stories/ReorderModal.stories.tsx`

### Steps

- [ ] 26.1 Rewrite `EmailPreview.tsx` — replace Tailwind classes with inline styles + AntD tokens:

```tsx
"use client";

import { theme, Flex } from "antd";
import Modal from "./Modal";

interface EmailPreviewProps {
  open: boolean;
  onClose: () => void;
  subject: string;
  recipientName: string;
  body: string;
  senderName?: string;
}

export default function EmailPreview({
  open,
  onClose,
  subject,
  recipientName,
  body,
  senderName = "Hands Together Therapies",
}: EmailPreviewProps) {
  const { token } = theme.useToken();

  return (
    <Modal open={open} onClose={onClose} title="Email Preview" maxWidth="lg">
      <div style={{ borderRadius: token.borderRadius, border: `1px solid ${token.colorBorder}`, overflow: "hidden" }}>
        <div style={{ backgroundColor: token.colorFillTertiary, padding: "12px 16px" }}>
          <Flex vertical gap={4}>
            <p style={{ fontSize: 12, color: token.colorTextSecondary }}>
              <span style={{ fontWeight: 500 }}>From:</span> {senderName}
            </p>
            <p style={{ fontSize: 12, color: token.colorTextSecondary }}>
              <span style={{ fontWeight: 500 }}>To:</span> {recipientName}
            </p>
            <p style={{ fontSize: 12, color: token.colorTextSecondary }}>
              <span style={{ fontWeight: 500 }}>Subject:</span> {subject}
            </p>
          </Flex>
        </div>
        <hr style={{ border: "none", borderTop: `1px solid ${token.colorBorder}`, margin: 0 }} />
        <div style={{ padding: 16, backgroundColor: token.colorBgContainer }}>
          <div style={{ whiteSpace: "pre-line", fontSize: 14 }}>{body}</div>
        </div>
        <div style={{ borderTop: `1px solid ${token.colorBorder}`, backgroundColor: token.colorFillTertiary, padding: "8px 16px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: token.colorTextTertiary }}>Sent via Splose</p>
        </div>
      </div>
    </Modal>
  );
}
```

- [ ] 26.2 Rewrite `ReorderModal.tsx` — replace `GripVertical` with `HolderOutlined`, replace Tailwind classes with AntD tokens:

```tsx
"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";
import { theme, Flex } from "antd";
import Modal from "./Modal";
import Button from "./Button";

export interface ReorderItem {
  id: string;
  label: string;
}

interface ReorderModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  items: ReorderItem[];
  onReorder: (items: ReorderItem[]) => void;
}

function SortableRow({ item }: { item: ReorderItem }) {
  const { token } = theme.useToken();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderRadius: token.borderRadius,
    border: `1px solid ${token.colorBorder}`,
    backgroundColor: token.colorBgContainer,
    padding: "10px 12px",
    ...(isDragging ? { zIndex: 10, boxShadow: token.boxShadowSecondary, opacity: 0.9 } : {}),
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button
        type="button"
        style={{ cursor: "grab", color: token.colorTextSecondary, background: "none", border: "none", padding: 0, touchAction: "none" }}
        {...attributes}
        {...listeners}
      >
        <HolderOutlined style={{ fontSize: 14 }} />
      </button>
      <span style={{ fontSize: 14 }}>{item.label}</span>
    </div>
  );
}

export default function ReorderModal({ open, onClose, title = "Reorder items", items: initialItems, onReorder }: ReorderModalProps) {
  const [items, setItems] = useState<ReorderItem[]>(initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  if (open && JSON.stringify(items.map((i) => i.id)) !== JSON.stringify(initialItems.map((i) => i.id))) {
    setItems(initialItems);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="md"
      footer={
        <Flex justify="flex-end" gap={8}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { onReorder(items); onClose(); }}>Save order</Button>
        </Flex>
      }
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <Flex vertical gap={6}>
            {items.map((item) => (
              <SortableRow key={item.id} item={item} />
            ))}
          </Flex>
        </SortableContext>
      </DndContext>
    </Modal>
  );
}
```

- [ ] 26.3 Verify both stories render correctly.
- [ ] 26.4 Run `npx tsc --noEmit`.
- [ ] 26.5 Commit: `feat(ds): rewrite EmailPreview and ReorderModal to AntD tokens`

---

## Task 27: RichTextEditor

Replace Lucide toolbar icons with @ant-design/icons. Replace Tailwind styling with AntD tokens + CSS Module.

**Files:**
- Modify: `src/components/ds/RichTextEditor.tsx`
- Create: `src/components/ds/RichTextEditor.module.css`
- Test: `src/components/ds/stories/RichTextEditor.stories.tsx`

### Steps

- [ ] 27.1 Create `RichTextEditor.module.css` for editor chrome (toolbar background, divider, editable area):

```css
.wrapper {
  border-radius: var(--ant-border-radius);
  border: 1px solid var(--ant-color-border);
  overflow: hidden;
}

.wrapper:focus-within {
  border-color: var(--ant-color-primary);
  box-shadow: 0 0 0 2px rgba(130, 80, 255, 0.1);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  border-bottom: 1px solid var(--ant-color-border);
  background-color: var(--ant-color-fill-tertiary);
  padding: 6px 8px;
}

.toolbarButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  color: var(--ant-color-text-secondary);
  font-size: 14px;
  transition: background-color 0.15s, color 0.15s;
}

.toolbarButton:hover {
  background-color: var(--ant-color-fill);
  color: var(--ant-color-text);
}

.toolbarButtonActive {
  background-color: rgba(130, 80, 255, 0.1);
  color: var(--ant-color-primary);
}

.divider {
  width: 1px;
  height: 20px;
  margin: 0 4px;
  background-color: var(--ant-color-border);
}

.editor {
  padding: 12px 16px;
  font-size: 14px;
  outline: none;
}
```

- [ ] 27.2 Rewrite `RichTextEditor.tsx` — replace all Lucide icon imports with @ant-design/icons equivalents. Use the CSS Module for styling. Replace `Dropdown` import with the new AntD-based one (no changes needed since it's already imported from `./Dropdown`).

- [ ] 27.3 Update the RichTextEditor story.
- [ ] 27.4 Run `npx tsc --noEmit`.
- [ ] 27.5 Commit: `feat(ds): rewrite RichTextEditor to AntD icons + CSS Module`

---

## Task 28: Delete usePagination and portable/

**Files:**
- Delete: `src/components/ds/usePagination.ts`
- Delete: `src/components/ds/portable/Tab.tsx`
- Delete: `src/components/ds/portable/Navbar.tsx`
- Delete: `src/components/ds/portable/SideNav.tsx`
- Delete: `src/components/ds/portable/TopNav.tsx`
- Delete: `src/components/ds/portable/index.ts`

### Steps

- [ ] 28.1 Search for usages of `usePagination` across all page files. Document which pages need to migrate to AntD Table's built-in pagination in Phase 3:
  ```
  grep -r "usePagination" src/ --include="*.tsx" --include="*.ts" -l
  ```
- [ ] 28.2 Search for usages of `portable/` imports:
  ```
  grep -r "portable" src/ --include="*.tsx" --include="*.ts" -l
  ```
- [ ] 28.3 If there are consumers of `usePagination` outside of `SettingsListPage`, note them as Phase 3 migration items. Do NOT delete yet if pages still import it. Instead, add a `@deprecated` JSDoc and keep the file. Delete only if the only consumer is `SettingsListPage` (which uses its own internal pagination).
- [ ] 28.4 Delete the `portable/` directory. If any Storybook config references portable components, update those references.
- [ ] 28.5 Run `npx tsc --noEmit`.
- [ ] 28.6 Commit: `chore(ds): delete portable/ directory, deprecate usePagination`

---

## Task 29: Update Barrel Export (index.ts)

**Files:**
- Modify: `src/components/ds/index.ts`

### Steps

- [ ] 29.1 Add new type exports:
  - `export type { DataTableColumn, DataTableProps } from "./DataTable"`
- [ ] 29.2 Verify that all existing exports still work (same names, same default/named split).
- [ ] 29.3 Remove the `usePagination` export if the file was deleted in Task 28. If deprecated but kept, add a comment.
- [ ] 29.4 Remove `portable` re-exports if any existed.
- [ ] 29.5 Run `npx tsc --noEmit`.
- [ ] 29.6 Commit: `chore(ds): update barrel export with new types, remove deleted exports`

---

## Task 30: Rebuild All Storybook Stories

After wiring up the theme, rebuild all Storybook stories to verify colours render correctly with the new token values. Every DS component story needs a visual check that it picks up the theme tokens rather than hardcoded Tailwind colour classes. If any story still shows old colour values, that component has hardcoded colours that need migrating to token references.

**Files:**
- Modify: all 43 files in `src/components/ds/stories/`
- Modify: Storybook config (`.storybook/preview.tsx` or equivalent) to wrap stories in `ThemeProvider`

### Steps

- [ ] 30.1 Update Storybook preview config to wrap all stories in AntD `ConfigProvider` with the Splose theme, matching how `layout.tsx` wraps the app. This ensures all stories render with the correct theme tokens.

- [ ] 30.2 Remove any Tailwind-specific Storybook configuration (PostCSS, Tailwind CSS imports in preview).

- [ ] 30.3 Walk through each of the 43 story files. For each:
  - Remove any Tailwind utility classes from story wrapper markup.
  - Replace Lucide icon imports with @ant-design/icons equivalents in story examples.
  - Ensure the story exercises all component variants/states.
  - Verify the story compiles without errors.

- [ ] 30.4 Run `npm run storybook` and visually check every story. Confirm:
  - Primary colour is `#8250FF` (violet-600), not any other purple.
  - Success colour is `#00C269` (success-600), not `#22c55e`.
  - Error colour is `#D00032` (critical-600), not `#ef4444`.
  - Warning colour is `#FFD232` (warning-600), not `#f59e0b`.
  - Info colour is `#5578FF` (info-600).
  - Border colour is `#e7e8e8` (cool-black-500).
  - Text colour is `#414549` (neutral-700).
  - Text secondary is `#6E6E64` (neutral-600).

- [ ] 30.5 Fix any component that still shows old colour values — trace back to hardcoded hex/Tailwind class and replace with AntD token reference.

- [ ] 30.6 Run `npx tsc --noEmit`.
- [ ] 30.7 Commit: `feat(ds): rebuild all 43 Storybook stories for AntD theme verification`

---

## Task 31: Build Verification

**Files:** (none modified — verification only)

### Steps

- [ ] 31.1 Run `npx tsc --noEmit` — must pass with zero errors.
- [ ] 31.2 Run `npx next build` — must succeed.
- [ ] 31.3 Run `npm run storybook -- --smoke-test` (if available) or manually verify Storybook builds: `npx storybook build`.
- [ ] 31.4 Grep for any remaining Tailwind classes in `src/components/ds/`:
  ```
  grep -rn "className=\"[^\"]*\b(bg-|text-|border-|rounded-|px-|py-|p-|m-|mt-|mb-|ml-|mr-|flex |gap-|items-|justify-|w-|h-|grid|space-|overflow-|hidden |block |inline-|shrink-|animate-|transition-|hover:|focus:|prose)" src/components/ds/ --include="*.tsx" -E
  ```
  Any matches are components that still have Tailwind — go back and fix them.
- [ ] 31.5 Grep for remaining `lucide-react` imports in `src/components/ds/`:
  ```
  grep -rn "lucide-react" src/components/ds/ --include="*.tsx"
  ```
  Must return zero results.
- [ ] 31.6 Commit: `chore(ds): Phase 2 build verification — zero Tailwind, zero Lucide in DS`

---

## Phase 2 Complete Checklist

Before marking Phase 2 as done, confirm every item:

- [ ] All 25 wrapper components (Spinner, Avatar, Checkbox, RadioGroup, Collapse, Button, Badge, Alert, Card, Toggle, Modal, FormInput, FormSelect, FormTextarea, Select, AsyncSelect, Dropdown, Tab, SearchBar, Pagination, List, Stat, DateRangeFilter, Filter, DataTable) use AntD internally.
- [ ] All 18 custom components (Chip, ColorDot, EmailPreview, EmptyState, FileUpload, FormColorPicker, HintIcon, IconText, Navbar, OnOffBadge, PageHeader, RichTextEditor, ReorderModal, SettingsListPage, SideNav, Status, Text, TopNav) use AntD tokens + CSS Modules, zero Tailwind.
- [ ] Zero `lucide-react` imports in `src/components/ds/`.
- [ ] Zero Tailwind utility classes in `src/components/ds/` component files.
- [ ] Barrel export (`index.ts`) is stable — all existing named exports still exist.
- [ ] `DataTableColumn` and `DataTableProps` types are exported.
- [ ] Legacy DataTable sub-components (`TableHead`, `Th`, `TableBody`, `Td`, `Tr`, `LinkCell`, `ActionsCell`, `ExpandableRow`) are exported with `@deprecated` JSDoc for Phase 3 transition.
- [ ] `usePagination` is either deleted or deprecated with JSDoc.
- [ ] `portable/` directory is deleted.
- [ ] All 43 Storybook stories render correctly with AntD theme tokens.
- [ ] Colour values match the canonical token reference (`docs/superpowers/specs/2026-03-30-colour-tokens-reference.md`).
- [ ] `npx tsc --noEmit` passes.
- [ ] `npx next build` passes.
- [ ] Storybook builds successfully.

### Breaking Changes for Phase 3

Document these for the page migration phase:

| Component | Change | Pages Affected |
|-----------|--------|---------------|
| DataTable | Column definition API replaces inline JSX `.map()` | All 25+ table pages |
| FormSelect | `onChange` is now `(value: string) => void` instead of `(e: ChangeEvent) => void` | All pages using FormSelect |
| Text | `color` prop now takes CSS values instead of Tailwind classes | Pages using `<Text color="text-...">` |
| DateRangeFilter | Now uses `dayjs` via AntD RangePicker | Pages that pass/read date values |
| Checkbox | API now uses AntD `CheckboxChangeEvent` instead of native `InputHTMLAttributes` | Pages using Checkbox onChange |

### Dependencies Added This Phase

| Package | Reason |
|---------|--------|
| `dayjs` (explicit) | Required by AntD DatePicker, added as direct dependency |

### Dependencies to Remove in Phase 4

| Package | Reason |
|---------|--------|
| `lucide-react` | Fully replaced by `@ant-design/icons` |
