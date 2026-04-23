import { SettingOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { EmptyState } from "@/components/ds";

export default function SettingsLandingPage() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '60vh' }}>
      <EmptyState
        icon={<Icon as={SettingOutlined} size="5xl" tone="secondary" />}
        title="All your settings in one place"
        message="Select a setting from the menu to get started."
      />
    </div>
  );
}
