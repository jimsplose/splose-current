"use client";

import { useState } from "react";
import Link from "next/link";
import { EditOutlined, LockOutlined, UndoOutlined, DownOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import SendNoteModal from "./SendNoteModal";

interface NoteViewToolbarProps {
  noteId: string;
  signed: boolean;
  clientName: string;
  clientEmail?: string;
  noteDate: string;
  practitionerName: string;
}

export default function NoteViewToolbar({
  noteId,
  signed,
  clientName,
  clientEmail,
  noteDate,
  practitionerName,
}: NoteViewToolbarProps) {
  const [showSendModal, setShowSendModal] = useState(false);

  return (
    <>
      <Flex align="center" gap={8}>
        <Button onClick={() => setShowSendModal(true)}>
          <SendOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
          Send
        </Button>
        {signed ? (
          <Button>
            <UndoOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
            Revert to draft
          </Button>
        ) : (
          <Button type="primary">
            <LockOutlined style={{ fontSize: 16, color: 'inherit' }} />
            Sign &amp; lock
          </Button>
        )}
        <Button>
          <Link href={`/notes/${noteId}/edit`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Edit <EditOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
          </Link>
        </Button>
        <Button>
          Actions <DownOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
        </Button>
      </Flex>

      <SendNoteModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        clientName={clientName}
        clientEmail={clientEmail}
        noteDate={noteDate}
        practitionerName={practitionerName}
      />
    </>
  );
}
