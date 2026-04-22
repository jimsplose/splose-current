"use client";

import { Modal } from "antd";
import {
  ExclamationCircleFilled,
  WarningFilled,
  QuestionCircleFilled,
} from "@ant-design/icons";
import type { ReactNode } from "react";

export type AlertDialogTone = "primary" | "danger" | "warning";

export interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: AlertDialogTone;
  icon?: ReactNode;
}

const toneIconMap: Record<AlertDialogTone, ReactNode> = {
  primary: <QuestionCircleFilled style={{ color: "var(--color-primary, #5578FF)" }} />,
  danger: <ExclamationCircleFilled style={{ color: "var(--color-danger, #D00032)" }} />,
  warning: <WarningFilled style={{ color: "var(--color-warning, #FFB020)" }} />,
};

/**
 * Imperative confirmation API for destructive or consequential actions.
 * Use for "Delete?", "Cancel invoice?", "Discard changes?" — questions
 * whose answer must resolve before the page continues. Resolves to
 * `true` (confirmed), `false` (cancelled), or `false` (escape/overlay).
 *
 *     const ok = await alertDialog.confirm({
 *       title: "Delete Harry Nguyen?",
 *       description: "This can't be undone.",
 *       confirmLabel: "Delete",
 *       tone: "danger",
 *     });
 *
 * For arbitrary content use `Modal`; for non-blocking notifications use
 * `toast`.
 */
export const alertDialog = {
  confirm(options: ConfirmOptions): Promise<boolean> {
    const {
      title,
      description,
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
      tone = "primary",
      icon,
    } = options;

    return new Promise<boolean>((resolve) => {
      Modal.confirm({
        title,
        content: description,
        icon: icon ?? toneIconMap[tone],
        okText: confirmLabel,
        cancelText: cancelLabel,
        okType: tone === "danger" ? "danger" : "primary",
        okButtonProps:
          tone === "danger"
            ? { danger: true, type: "primary" }
            : tone === "warning"
              ? { type: "primary" }
              : { type: "primary" },
        centered: true,
        maskClosable: false,
        autoFocusButton: "cancel",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  },
};

export default alertDialog;
