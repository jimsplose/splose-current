"use client";

import { Tag } from "antd";

type BadgeVariant = "green" | "red" | "blue" | "yellow" | "orange" | "gray" | "purple";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  solid?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const variantColorMap: Record<BadgeVariant, string> = {
  green: "success",
  red: "error",
  blue: "processing",
  yellow: "warning",
  orange: "warning",
  gray: "default",
  purple: "purple",
};

const solidColorMap: Record<BadgeVariant, { bg: string; text: string }> = {
  green: { bg: "#b4eb64", text: "#ffffff" },
  red: { bg: "#D00032", text: "#ffffff" },
  blue: { bg: "#5578FF", text: "#ffffff" },
  yellow: { bg: "#FFD232", text: "#ffffff" },
  orange: { bg: "#f97316", text: "#ffffff" },
  gray: { bg: "#a5a59e", text: "#ffffff" },
  purple: { bg: "#8250FF", text: "#ffffff" },
};

export default function Badge({ children, variant = "gray", solid = false, className, style: styleProp }: BadgeProps) {
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
          ...styleProp,
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
      style={{ borderRadius: 8, fontSize: 12, ...styleProp }}
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
