
import React from 'react';
import { Heading, Text, Label, Quote, Code } from '@/components/ui/design-system/Typography';
import { Logo } from '@/components/ui/design-system/Logo';
import { InfoCard } from '@/components/ui/design-system/InfoCard';
import { IconBox } from '@/components/ui/design-system/IconBox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CircleInfoIcon } from '@/components/ui/icons';
import { Mail, Phone, Globe, Map, Layout, Landmark, Book, Palette, Heart, Star } from 'lucide-react';

const DesignSystem = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="text-center mb-8">
        <Heading level={1} className="mb-2">PendlerHelfer Design System</Heading>
        <Text variant="muted" size="lg">Základní designové komponenty aplikace</Text>
      </div>
      
      {/* Sekce loga */}
      <section className="space-y-6">
        <Heading level={2}>Logo</Heading>
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
            <Logo size="lg" variant="minimal" />
            <Text className="mt-4" variant="muted" align="center">Minimální logo</Text>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
            <Logo size="lg" variant="default" />
            <Text className="mt-4" variant="muted" align="center">Výchozí logo</Text>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
            <Logo size="lg" variant="full" />
            <Text className="mt-4" variant="muted" align="center">Plné logo</Text>
          </div>
        </div>
      </section>
      
      {/* Sekce typografie */}
      <section className="space-y-6">
        <Heading level={2}>Typografie</Heading>
        <Separator />
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2}>Heading 2</Heading>
            <Heading level={3}>Heading 3</Heading>
            <Heading level={4}>Heading 4</Heading>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Text size="sm">Text Small (sm)</Text>
            <Text size="base">Text Base</Text>
            <Text size="lg">Text Large (lg)</Text>
            <Text size="xl">Text Extra Large (xl)</Text>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Text variant="default">Text Default</Text>
            <Text variant="muted">Text Muted</Text>
            <Text variant="primary">Text Primary</Text>
            <Text variant="accent">Text Accent</Text>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Quote>Toto je ukázka citace v našem designovém systému.</Quote>
            <Text>Pro zvýraznění kódu používáme <Code>font-mono</Code> s pozadím.</Text>
          </div>
        </div>
      </section>
      
      {/* Sekce ikony */}
      <section className="space-y-6">
        <Heading level={2}>Ikony</Heading>
        <Separator />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div className="flex flex-col items-center">
            <IconBox icon={<Mail />} variant="primary" />
            <Label className="mt-2">Primary</Label>
          </div>
          
          <div className="flex flex-col items-center">
            <IconBox icon={<Phone />} variant="secondary" />
            <Label className="mt-2">Secondary</Label>
          </div>
          
          <div className="flex flex-col items-center">
            <IconBox icon={<Globe />} variant="accent" />
            <Label className="mt-2">Accent</Label>
          </div>
          
          <div className="flex flex-col items-center">
            <IconBox icon={<Map />} variant="muted" />
            <Label className="mt-2">Muted</Label>
          </div>
        </div>
      </section>
      
      {/* Sekce karty */}
      <section className="space-y-6">
        <Heading level={2}>Informační karty</Heading>
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard 
            title="Základní karta" 
            description="Ukázka základní karty"
            icon={<Landmark />}
          >
            <Text>
              Obsah karty můžete libovolně upravit podle potřeby.
            </Text>
          </InfoCard>
          
          <InfoCard 
            title="Interaktivní karta" 
            description="Karta reaguje na akce uživatele"
            icon={<Heart />}
            variant="accent"
            interactive
            onClick={() => alert('Kliknuto na kartu!')}
          >
            <Text>
              Klikněte na kartu pro zobrazení akce.
            </Text>
          </InfoCard>
        </div>
      </section>
    </div>
  );
};

export default DesignSystem;
