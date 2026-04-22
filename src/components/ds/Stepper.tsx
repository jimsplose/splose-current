"use client";

import { Steps as AntSteps } from "antd";
import type { ReactNode } from "react";

export type StepperStatus = "pending" | "current" | "complete" | "error";
export type StepperOrientation = "horizontal" | "vertical";
export type StepperSize = "sm" | "md" | "lg";

export interface StepperItem {
  id: string;
  label: string;
  description?: string;
  status?: StepperStatus;
  icon?: ReactNode;
  onClick?: () => void;
}

interface StepperPropsBase {
  items: StepperItem[];
  orientation?: StepperOrientation;
  size?: StepperSize;
  className?: string;
}

export interface StepperByStatusProps extends StepperPropsBase {
  current?: never;
}

export interface StepperByCurrentProps extends StepperPropsBase {
  /** Id of the active step. Earlier steps auto-mark complete; later auto-pending. */
  current: string;
}

export type StepperProps = StepperByStatusProps | StepperByCurrentProps;

const antSizeMap: Record<StepperSize, "small" | "default"> = {
  sm: "small",
  md: "default",
  lg: "default",
};

function statusToAnt(status: StepperStatus): "wait" | "process" | "finish" | "error" {
  if (status === "pending") return "wait";
  if (status === "current") return "process";
  if (status === "complete") return "finish";
  return "error";
}

/**
 * Numbered progress indicator for multi-step flows (batch invoice, NDIS
 * upload, onboarding wizards). Two API shapes: per-item `status` for
 * manual control, or a single `current` id that auto-marks earlier steps
 * complete and later steps pending. `orientation="vertical"` reveals
 * per-item descriptions for sidebar-style wizards.
 */
export default function Stepper(props: StepperProps) {
  const { items, orientation = "horizontal", size = "md", className } = props;

  let statuses: StepperStatus[];
  if ("current" in props && props.current !== undefined) {
    const idx = items.findIndex((i) => i.id === props.current);
    statuses = items.map((_, i) =>
      i < idx ? "complete" : i === idx ? "current" : "pending",
    );
  } else {
    statuses = items.map((i) => i.status ?? "pending");
  }

  const currentIndex = Math.max(0, statuses.findIndex((s) => s === "current"));

  return (
    <AntSteps
      className={className}
      direction={orientation}
      size={antSizeMap[size]}
      current={currentIndex}
      labelPlacement={orientation === "horizontal" ? "vertical" : undefined}
      items={items.map((item, i) => ({
        title: item.label,
        description: orientation === "vertical" ? item.description : undefined,
        icon: item.icon,
        status: statusToAnt(statuses[i]),
        onClick: item.onClick,
        style: item.onClick ? { cursor: "pointer" } : undefined,
      }))}
    />
  );
}
