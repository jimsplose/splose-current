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
