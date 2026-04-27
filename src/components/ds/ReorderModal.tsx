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
import { HolderOutlined } from "@ant-design/icons";
import { Button, theme, Flex } from "antd";
import Modal from "./Modal";

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
  const { token } = theme.useToken();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderRadius: token.borderRadius,
    border: `1px solid ${token.colorBorder}`,
    backgroundColor: token.colorBgContainer,
    padding: "10px 12px",
    ...(isDragging ? { zIndex: 10, boxShadow: token.boxShadowSecondary, opacity: 0.9 } : {}),
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button
        type="button"
        style={{ cursor: "grab", color: token.colorTextSecondary, background: "none", border: "none", padding: 0, touchAction: "none" }}
        {...attributes}
        {...listeners}
      >
        <HolderOutlined style={{ fontSize: 14 }} />
      </button>
      <span style={{ fontSize: 14 }}>{item.label}</span>
    </div>
  );
}

export default function ReorderModal({ open, onClose, title = "Reorder items", items: initialItems, onReorder }: ReorderModalProps) {
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
        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={() => { onReorder(items); onClose(); }}>Save order</Button>
        </Flex>
      }
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <Flex vertical gap={6}>
            {items.map((item) => (
              <SortableRow key={item.id} item={item} />
            ))}
          </Flex>
        </SortableContext>
      </DndContext>
    </Modal>
  );
}
