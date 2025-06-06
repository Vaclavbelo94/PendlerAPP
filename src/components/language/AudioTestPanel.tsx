
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAudioSettings } from '@/hooks/useAudioSettings';
import { audioManager, diagnoseAudioSupport } from './utils/enhancedPronunciationHelper';
import AudioButton from './AudioButton';

const AudioTestPanel: React.FC = () => {
  const [testText, setTestText] = useState('Guten Tag, wie geht es Ihnen?');
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const { settings, availableVoices } = useAudioSettings();

  const runDiagnosis = () => {
    const result = diagnoseAudioSupport();
    setDiagnosis(result);
  };

  const testPhrases = [
    { text: 'Hallo', lang: 'de' as const, label: 'Němčina - Základní' },
    { text: 'Dobrý den', lang: 'cs' as const, label: 'Čeština - Základní' },
    { text: 'Dobrý deň', lang: 'sk' as const, label: 'Slovenština - Základní' },
    { text: 'Hello', lang: 'en' as const, label: 'Angličtina - Základní' },
  ];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Testování audio funkcí</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick diagnosis */}
        <div>
          <Button onClick={runDiagnosis} variant="outline" className="mb-2">
            Spustit diagnostiku
          </Button>
          {diagnosis && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>Podpora TTS: 
                  <Badge variant={diagnosis.speechSynthesisSupported ? "default" : "destructive"} className="ml-2">
                    {diagnosis.speechSynthesisSupported ? "Ano" : "Ne"}
                  </Badge>
                </div>
                <div>Dostupné hlasy: 
                  <Badge variant="outline" className="ml-2">
                    {diagnosis.voicesAvailable}
                  </Badge>
                </div>
                <div>Německé hlasy: 
                  <Badge variant="outline" className="ml-2">
                    {diagnosis.germanVoicesAvailable}
                  </Badge>
                </div>
                <div>Přehrává: 
                  <Badge variant={diagnosis.currentlyPlaying ? "default" : "outline"} className="ml-2">
                    {diagnosis.currentlyPlaying ? "Ano" : "Ne"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Custom text test */}
        <div>
          <label className="text-sm font-medium mb-2 block">Vlastní text:</label>
          <div className="flex gap-2">
            <Input
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Zadejte text pro test..."
              className="flex-1"
            />
            <AudioButton 
              text={testText}
              language="de"
              showText={false}
            />
          </div>
        </div>

        <Separator />

        {/* Predefined test phrases */}
        <div>
          <label className="text-sm font-medium mb-2 block">Testovací fráze:</label>
          <div className="grid gap-2">
            {testPhrases.map((phrase, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <span className="font-medium">{phrase.text}</span>
                  <span className="text-sm text-muted-foreground ml-2">({phrase.label})</span>
                </div>
                <AudioButton 
                  text={phrase.text}
                  language={phrase.lang}
                  variant="outline"
                  size="sm"
                  showText={false}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Voice information */}
        <div>
          <label className="text-sm font-medium mb-2 block">Dostupné hlasy:</label>
          <div className="max-h-32 overflow-y-auto">
            {availableVoices.length > 0 ? (
              availableVoices.map((voice, index) => (
                <div key={index} className="text-xs p-1 border-b">
                  {voice.name} ({voice.lang}) {voice.localService ? '(Local)' : '(Remote)'}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">Žádné hlasy nenalezeny</div>
            )}
          </div>
        </div>

        {/* Current settings */}
        <div>
          <label className="text-sm font-medium mb-2 block">Aktuální nastavení:</label>
          <div className="p-3 bg-muted rounded-lg text-sm">
            <div>Povoleno: {settings.enabled ? 'Ano' : 'Ne'}</div>
            <div>Rychlost: {settings.speed}</div>
            <div>Hlasitost: {settings.volume}</div>
            <div>Výška: {settings.pitch}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioTestPanel;
