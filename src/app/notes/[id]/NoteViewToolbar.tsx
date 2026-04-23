"use client";

import { useState } from "react";
import Link from "next/link";
import { EditOutlined, LockOutlined, UndoOutlined, DownOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import { Icon } from "@/components/ds";
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
          <Icon as={SendOutlined} />
          Send
        </Button>
        {signed ? (
          <Button>
            <Icon as={UndoOutlined} size="lg" />
            Revert to draft
          </Button>
        ) : (
          <Button type="primary">
            {/* eslint-disable-next-line no-restricted-syntax -- Icon escape hatch inside primary Button (inherits white from Button) */}
            <Icon as={LockOutlined} style={{ color: 'inherit' }} />
            Sign &amp; lock
          </Button>
        )}
        <Button>
          <Link href={`/notes/${noteId}/edit`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Edit <Icon as={EditOutlined} />
          </Link>
        </Button>
        <Button>
          Actions <Icon as={DownOutlined} />
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
