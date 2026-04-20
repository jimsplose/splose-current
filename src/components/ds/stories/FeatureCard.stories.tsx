import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "antd";
import FeatureCard from "../FeatureCard";
import Text from "../Text";
import type { FeatureCardTone } from "../FeatureCard";

const meta: Meta<typeof FeatureCard> = {
  title: "Layout/FeatureCard",
  component: FeatureCard,
  argTypes: {
    tone: {
      control: "select",
      options: ["primary", "success", "neutral", "inverted"] satisfies FeatureCardTone[],
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

/* ── Playground ─────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    tone: "primary",
    children: "FeatureCard content",
  },
};

/* ── All tones ──────────────────────────────────────────────────────────── */

export const AllTones: Story = {
  name: "All Tones",
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
      {(["primary", "success", "neutral", "inverted"] as FeatureCardTone[]).map((tone) => (
        <FeatureCard key={tone} tone={tone}>
          <Text variant="label/lg" color={tone === "neutral" ? "text" : "inverted"} as="h3">
            {tone.charAt(0).toUpperCase() + tone.slice(1)} tone
          </Text>
          <Text variant="body/md" color={tone === "neutral" ? "secondary" : "inverted"}>
            Supporting detail text for the {tone} card.
          </Text>
        </FeatureCard>
      ))}
    </div>
  ),
};

/* ── Account balance recipe (real usage) ────────────────────────────────── */

export const AccountBalanceRecipe: Story = {
  name: "Recipe: Account Balance Card",
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <FeatureCard tone="primary">
        <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
          <Text variant="label/lg" as="h3" color="inverted">Account balance</Text>
        </Flex>
        <Flex justify="space-between" align="center">
          <Text variant="body/md" color="inverted">They owe</Text>
          <Text variant="body/md-strong" color="inverted">3,310.56</Text>
        </Flex>
        <Flex justify="space-between" align="center">
          <Text variant="body/md" color="inverted">Available credit balance</Text>
          <Text variant="body/md-strong" color="inverted">0.00</Text>
        </Flex>
      </FeatureCard>
    </div>
  ),
};
