"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Lock, RotateCcw, ChevronDown, Send } from "lucide-react";
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
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={() => setShowSendModal(true)}>
          <Send className="h-3.5 w-3.5" />
          Send
        </Button>
        {signed ? (
          <Button variant="secondary">
            <RotateCcw className="h-4 w-4" />
            Revert to draft
          </Button>
        ) : (
          <Button variant="primary">
            <Lock className="h-3.5 w-3.5" />
            Sign &amp; lock
          </Button>
        )}
        <Link
          href={`/notes/${noteId}/edit`}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50"
        >
          Edit <Pencil className="h-3.5 w-3.5" />
        </Link>
        <Button variant="secondary">
          Actions <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </div>

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
