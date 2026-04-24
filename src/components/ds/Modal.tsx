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
  sm: 384,
  md: 448,
  lg: 512,
  xl: 576,
};

export default function Modal({ open, onClose, title, children, footer, maxWidth = "lg" }: ModalProps) {
  return (
    <AntModal
      open={open}
      onCancel={onClose}
      title={title}
      footer={footer !== undefined ? footer : null}
      width={widthMap[maxWidth]}
      destroyOnHidden
      centered={false}
      style={{ top: 48 }}
    >
      {children}
    </AntModal>
  );
}
