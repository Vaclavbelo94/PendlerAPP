
import React from 'react';
import { Heading, Text, Label, Quote, Code } from '@/components/ui/design-system/Typography';
import { Logo } from '@/components/ui/design-system/Logo';
import { InfoCard } from '@/components/ui/design-system/InfoCard';
import { IconBox } from '@/components/ui/design-system/IconBox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CircleInfoIcon } from '@/components/ui/icons';
import { Mail, Phone, Globe, Map, Layout, Landmark, Book, Palette, Heart, Star } from 'lucide-react';
import { DESIGN_TOKENS } from '@/lib/design-system';

const DesignSystem = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="text-center mb-8">
        <Heading level={1} className="mb-2">PendlerHelfer Design System</Heading>
        <Text variant="muted" size="lg">Ucelený designový systém pro aplikaci PendlerHelfer</Text>
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
        
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <div className="text-center">
            <Logo size="sm" variant="full" />
            <Text className="mt-2" size="sm" variant="muted">Malé (sm)</Text>
          </div>
          <div className="text-center">
            <Logo size="md" variant="full" />
            <Text className="mt-2" size="sm" variant="muted">Střední (md)</Text>
          </div>
          <div className="text-center">
            <Logo size="lg" variant="full" />
            <Text className="mt-2" size="sm" variant="muted">Velké (lg)</Text>
          </div>
          <div className="text-center">
            <Logo size="xl" variant="full" />
            <Text className="mt-2" size="sm" variant="muted">Extra velké (xl)</Text>
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
            <Heading level={5}>Heading 5</Heading>
            <Heading level={6}>Heading 6</Heading>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Text size="xs">Text Extra Small (xs)</Text>
            <Text size="sm">Text Small (sm)</Text>
            <Text size="base">Text Base</Text>
            <Text size="lg">Text Large (lg)</Text>
            <Text size="xl">Text Extra Large (xl)</Text>
            <Text size="2xl">Text 2XL</Text>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Text weight="light">Text Light</Text>
            <Text weight="normal">Text Normal</Text>
            <Text weight="medium">Text Medium</Text>
            <Text weight="semibold">Text Semibold</Text>
            <Text weight="bold">Text Bold</Text>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Text variant="default">Text Default</Text>
            <Text variant="muted">Text Muted</Text>
            <Text variant="primary">Text Primary</Text>
            <Text variant="secondary">Text Secondary</Text>
            <Text variant="accent">Text Accent</Text>
            <Text variant="danger">Text Danger</Text>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Quote>Toto je ukázka citace v našem designovém systému, která může být použita pro zvýraznění důležitých informací.</Quote>
            <Text>Pro zvýraznění kódu používáme <Code>font-mono</Code> s pozadím.</Text>
          </div>
        </div>
      </section>
      
      {/* Sekce barvy */}
      <section className="space-y-6">
        <Heading level={2}>Barvy</Heading>
        <Separator />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(DESIGN_TOKENS.colors.primary).map(([key, value]) => (
            <div key={`primary-${key}`} className="flex flex-col">
              <div className="h-16 rounded-md mb-2" style={{ backgroundColor: value.toString() }}></div>
              <Label>Primary {key}</Label>
              <Text variant="muted" size="sm">{value.toString()}</Text>
            </div>
          ))}
          
          {Object.entries(DESIGN_TOKENS.colors.secondary).map(([key, value]) => (
            <div key={`secondary-${key}`} className="flex flex-col">
              <div className="h-16 rounded-md mb-2" style={{ backgroundColor: value.toString() }}></div>
              <Label>Secondary {key}</Label>
              <Text variant="muted" size="sm">{value.toString()}</Text>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {Object.entries(DESIGN_TOKENS.colors.neutral).slice(0, 10).map(([key, value]) => (
            <div key={`neutral-${key}`} className="flex flex-col">
              <div className="h-12 rounded-md mb-2" style={{ backgroundColor: value.toString() }}></div>
              <Label>Neutral {key}</Label>
              <Text variant="muted" size="sm">{value.toString()}</Text>
            </div>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex flex-col">
            <div className="h-12 w-24 rounded-md mb-2 bg-success"></div>
            <Label>Success</Label>
          </div>
          <div className="flex flex-col">
            <div className="h-12 w-24 rounded-md mb-2 bg-warning"></div>
            <Label>Warning</Label>
          </div>
          <div className="flex flex-col">
            <div className="h-12 w-24 rounded-md mb-2 bg-destructive"></div>
            <Label>Danger</Label>
          </div>
          <div className="flex flex-col">
            <div className="h-12 w-24 rounded-md mb-2 bg-info"></div>
            <Label>Info</Label>
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
          
          <div className="flex flex-col items-center">
            <IconBox icon={<Layout />} variant="danger" />
            <Label className="mt-2">Danger</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
          <div className="flex flex-col items-center">
            <IconBox icon={<Mail />} size="sm" />
            <Label className="mt-2">Small (sm)</Label>
          </div>
          
          <div className="flex flex-col items-center">
            <IconBox icon={<Mail />} size="md" />
            <Label className="mt-2">Medium (md)</Label>
          </div>
          
          <div className="flex flex-col items-center">
            <IconBox icon={<Mail />} size="lg" />
            <Label className="mt-2">Large (lg)</Label>
          </div>
          
          <div className="flex flex-col items-center">
            <IconBox icon={<Mail />} size="xl" />
            <Label className="mt-2">Extra Large (xl)</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
          <div className="flex flex-col items-center">
            <IconBox icon={<Mail />} shape="square" />
            <Label className="mt-2">Square</Label>
          </div>
          
          <div className="flex flex-col items-center">
            <IconBox icon={<Mail />} shape="circle" />
            <Label className="mt-2">Circle</Label>
          </div>
          
          <div className="flex flex-col items-center">
            <IconBox icon={<Mail />} gradient />
            <Label className="mt-2">Gradient</Label>
          </div>
          
          <div className="flex flex-col items-center">
            <IconBox icon={<Mail />} border />
            <Label className="mt-2">Border</Label>
          </div>
          
          <div className="flex flex-col items-center">
            <IconBox icon={<Mail />} glow />
            <Label className="mt-2">Glow</Label>
          </div>
        </div>
      </section>
      
      {/* Sekce karty */}
      <section className="space-y-6">
        <Heading level={2}>Karty</Heading>
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <InfoCard 
            title="Základní karta" 
            description="Toto je ukázka základní karty v designovém systému"
            icon={<Landmark />}
          >
            <Text>
              Obsah karty můžete libovolně upravit podle potřeby. Toto je obsah základní karty.
            </Text>
          </InfoCard>
          
          <InfoCard 
            title="Karta s gradienty" 
            description="Tato karta používá pozadí s gradienty"
            icon={<Palette />}
            variant="secondary"
            gradient
          >
            <Text>
              Gradienty mohou vytvořit zajímavý vizuální efekt a upoutat pozornost uživatele.
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
              Klikněte na kartu pro zobrazení akce. Interaktivní karty jsou vhodné pro klikatelné prvky.
            </Text>
          </InfoCard>
          
          <InfoCard 
            title="Karta s patičkou" 
            description="Tato karta obsahuje dodatečné prvky v patičce"
            icon={<Book />}
            variant="muted"
            footer={
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm">Zrušit</Button>
                <Button size="sm">Potvrdit</Button>
              </div>
            }
          >
            <Text>
              Patička karty je ideální pro umístění akčních tlačítek nebo doplňkových informací.
            </Text>
          </InfoCard>
          
          <InfoCard 
            title="Upozornění" 
            description="Karta pro důležité informace a upozornění"
            icon={<Star />}
            variant="danger"
          >
            <Text>
              Tato karta je vhodná pro důležité zprávy, které potřebují upoutat pozornost uživatele.
            </Text>
            <div className="mt-4 flex gap-2">
              <Button size="sm">Další info</Button>
            </div>
          </InfoCard>
        </div>
      </section>
    </div>
  );
};

export default DesignSystem;
