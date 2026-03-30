"use client";

import { useState } from "react";
import Link from "next/link";
import { EditOutlined, LockOutlined, UndoOutlined, DownOutlined, SendOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Button } from "@/components/ds";
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
        <Button variant="secondary" onClick={() => setShowSendModal(true)}>
          <SendOutlined style={{ fontSize: 14 }} />
          Send
        </Button>
        {signed ? (
          <Button variant="secondary">
            <UndoOutlined style={{ fontSize: 16 }} />
            Revert to draft
          </Button>
        ) : (
          <Button variant="primary">
            <LockOutlined style={{ fontSize: 14 }} />
            Sign &amp; lock
          </Button>
        )}
        <Button>
          <Link href={`/notes/${noteId}/edit`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Edit <EditOutlined style={{ fontSize: 14 }} />
          </Link>
        </Button>
        <Button variant="secondary">
          Actions <DownOutlined style={{ fontSize: 14 }} />
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
