import type { DropdownItem } from "@/components/ds";

/** Edit, Duplicate, Change log, ---, Archive */
export const STANDARD_SETTINGS: DropdownItem[] = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

/** Edit, Delete */
export const SIMPLE_CRUD: DropdownItem[] = [
  { label: "Edit", value: "edit" },
  { label: "Delete", value: "delete", danger: true },
];

/** Edit, Deactivate, Reset password, Log out everywhere, Change log */
export const USER_ADMIN: DropdownItem[] = [
  { label: "Edit", value: "edit" },
  { label: "", value: "divider-1", divider: true },
  { label: "Deactivate", value: "deactivate", danger: true },
  { label: "Reset password", value: "reset-password" },
  { label: "Log out everywhere", value: "logout-everywhere" },
  { label: "Change log", value: "change-log" },
];
