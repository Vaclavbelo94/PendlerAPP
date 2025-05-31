
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';

/**
 * Card komponenta pro zobrazování strukturovaného obsahu
 * v Pendlerově pomocníkovi.
 */
const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Základní karta</CardTitle>
        <CardDescription>Jednoduchá karta s nadpisem a popisem.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Toto je obsah karty. Zde můžete umístit jakýkoliv obsah.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Karta s patičkou</CardTitle>
        <CardDescription>Karta obsahující tlačítka v patičce.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Obsah karty s akcemi v patičce.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Zrušit</Button>
        <Button>Potvrdit</Button>
      </CardFooter>
    </Card>
  ),
};

export const DashboardCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Směny tento týden</CardTitle>
        <CardDescription>Přehled pracovních směn</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">24 hodin</div>
        <p className="text-xs text-muted-foreground">+12% oproti minulému týdnu</p>
      </CardContent>
    </Card>
  ),
};
