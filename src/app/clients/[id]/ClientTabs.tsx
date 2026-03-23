"use client";

import { Tab } from "@/components/ds";
import type { TabItem } from "@/components/ds";

interface ClientTabsProps {
  tabs: TabItem[];
}

export default function ClientTabs({ tabs }: ClientTabsProps) {
  return <Tab items={tabs} value="" className="shrink-0 px-4 md:px-6" />;
}
