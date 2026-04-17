import { EditOutlined, CopyOutlined, HistoryOutlined, DeleteOutlined, StopOutlined, LockOutlined, LogoutOutlined } from "@ant-design/icons";
import type { DropdownItem } from "@/components/ds";

/** Edit, Duplicate, Change log, ---, Archive */
export const STANDARD_SETTINGS: DropdownItem[] = [
  { label: "Edit", value: "edit", icon: <EditOutlined /> },
  { label: "Duplicate", value: "duplicate", icon: <CopyOutlined /> },
  { label: "Change log", value: "change-log", icon: <HistoryOutlined /> },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true, icon: <DeleteOutlined /> },
];

/** Edit, Delete */
export const SIMPLE_CRUD: DropdownItem[] = [
  { label: "Edit", value: "edit", icon: <EditOutlined /> },
  { label: "Delete", value: "delete", danger: true, icon: <DeleteOutlined /> },
];

/** Edit, Deactivate, Reset password, Log out everywhere, Change log */
export const USER_ADMIN: DropdownItem[] = [
  { label: "Edit", value: "edit", icon: <EditOutlined /> },
  { label: "", value: "divider-1", divider: true },
  { label: "Deactivate", value: "deactivate", danger: true, icon: <StopOutlined /> },
  { label: "Reset password", value: "reset-password", icon: <LockOutlined /> },
  { label: "Log out everywhere", value: "logout-everywhere", icon: <LogoutOutlined /> },
  { label: "Change log", value: "change-log", icon: <HistoryOutlined /> },
];
