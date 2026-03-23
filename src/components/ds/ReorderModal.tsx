"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

export interface ReorderItem {
  id: string;
  label: string;
}

interface ReorderModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  items: ReorderItem[];
  onReorder: (items: ReorderItem[]) => void;
}

function SortableRow({ item }: { item: ReorderItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border border-border bg-white px-3 py-2.5 ${isDragging ? "z-10 shadow-lg opacity-90" : "hover:bg-gray-50"}`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-text-secondary hover:text-text active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="text-body-md text-text">{item.label}</span>
    </div>
  );
}

export default function ReorderModal({
  open,
  onClose,
  title = "Reorder items",
  items: initialItems,
  onReorder,
}: ReorderModalProps) {
  const [items, setItems] = useState<ReorderItem[]>(initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  // Reset when modal opens with new items
  if (open && JSON.stringify(items.map((i) => i.id)) !== JSON.stringify(initialItems.map((i) => i.id))) {
    setItems(initialItems);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { onReorder(items); onClose(); }}>Save order</Button>
        </div>
      }
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {items.map((item) => (
              <SortableRow key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Modal>
  );
}
