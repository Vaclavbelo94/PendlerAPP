
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

/**
 * Button component pro Pendlerův pomocník.
 * Podporuje různé varianty a velikosti.
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Tlačítko',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Sekundární',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Smazat',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Malé',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Velké',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: '🏠',
  },
};
