"use client";

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
  return (
    <Modal open={open} onClose={onClose} title="Email Preview" maxWidth="lg">
      <div className="overflow-hidden rounded-lg border border-border">
        {/* Email header */}
        <div className="space-y-1 bg-gray-50 px-4 py-3">
          <p className="text-body-sm text-text-secondary">
            <span className="text-label-sm text-text">From:</span> {senderName}
          </p>
          <p className="text-body-sm text-text-secondary">
            <span className="text-label-sm text-text">To:</span> {recipientName}
          </p>
          <p className="text-body-sm text-text-secondary">
            <span className="text-label-sm text-text">Subject:</span> {subject}
          </p>
        </div>

        <hr className="border-border" />

        {/* Email body */}
        <div className="bg-white px-4 py-4">
          <div className="whitespace-pre-line text-body-md text-text">{body}</div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-gray-50 px-4 py-2 text-center">
          <p className="text-caption text-text-tertiary">Sent via Splose</p>
        </div>
      </div>
    </Modal>
  );
}
