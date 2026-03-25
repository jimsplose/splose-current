import { Settings } from "lucide-react";
import { EmptyState } from "@/components/ds";

export default function SettingsLandingPage() {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <EmptyState
        icon={<Settings className="h-10 w-10 text-text-secondary" />}
        title="All your settings in one place"
        message="Select a setting from the menu to get started."
      />
    </div>
  );
}
