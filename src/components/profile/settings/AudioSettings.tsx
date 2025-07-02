
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2, VolumeX, RotateCcw, Play, Pause } from 'lucide-react';
import { useAudioSettings } from '@/hooks/useAudioSettings';

const AudioSettings: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    availableVoices, 
    getSelectedVoice, 
    resetToDefaults,
    isLoading,
    isSupported 
  } = useAudioSettings();
  
  const [testPlaying, setTestPlaying] = useState(false);
  const testPhrase = "Hallo, das ist ein Test der deutschen Aussprache.";

  const handleTestAudio = async () => {
    if (testPlaying) {
      // Stop audio if playing
      setTestPlaying(false);
    } else {
      // Simple test audio using Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(testPhrase);
        utterance.lang = 'de-DE';
        utterance.rate = settings.speed;
        utterance.volume = settings.volume;
        utterance.pitch = settings.pitch;
        
        utterance.onstart = () => setTestPlaying(true);
        utterance.onend = () => setTestPlaying(false);
        utterance.onerror = () => setTestPlaying(false);
        
        speechSynthesis.speak(utterance);
      }
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VolumeX className="h-5 w-5" />
            Audio nastavení
          </CardTitle>
          <CardDescription>
            Váš prohlížeč nepodporuje syntézu řeči
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audio nastavení</CardTitle>
          <CardDescription>Načítání hlasů...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Audio nastavení
        </CardTitle>
        <CardDescription>
          Přizpůsobte si výslovnost podle svých preferencí
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Audio */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Povolit audio</Label>
            <p className="text-sm text-muted-foreground">
              Zapnout/vypnout všechny audio funkce
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings({ enabled })}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Voice Selection */}
            <div className="space-y-2">
              <Label>Hlas</Label>
              <Select
                value={settings.selectedVoiceIndex.toString()}
                onValueChange={(value) => updateSettings({ selectedVoiceIndex: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte hlas" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Aktuální hlas: {getSelectedVoice()?.name || 'Není vybrán'}
              </p>
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Rychlost řeči</Label>
                <span className="text-sm text-muted-foreground">{settings.speed.toFixed(1)}x</span>
              </div>
              <Slider
                value={[settings.speed]}
                onValueChange={([speed]) => updateSettings({ speed })}
                min={0.5}
                max={1.5}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pomalé (0.5x)</span>
                <span>Rychlé (1.5x)</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Hlasitost</Label>
                <span className="text-sm text-muted-foreground">{Math.round(settings.volume * 100)}%</span>
              </div>
              <Slider
                value={[settings.volume]}
                onValueChange={([volume]) => updateSettings({ volume })}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Pitch Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Výška hlasu</Label>
                <span className="text-sm text-muted-foreground">{settings.pitch.toFixed(1)}</span>
              </div>
              <Slider
                value={[settings.pitch]}
                onValueChange={([pitch]) => updateSettings({ pitch })}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatické přehrávání</Label>
                  <p className="text-sm text-muted-foreground">
                    Automaticky přehrát při zobrazení fráze
                  </p>
                </div>
                <Switch
                  checked={settings.autoPlay}
                  onCheckedChange={(autoPlay) => updateSettings({ autoPlay })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Vizuální zpětná vazba</Label>
                  <p className="text-sm text-muted-foreground">
                    Zobrazit animace při přehrávání
                  </p>
                </div>
                <Switch
                  checked={settings.showVisualFeedback}
                  onCheckedChange={(showVisualFeedback) => updateSettings({ showVisualFeedback })}
                />
              </div>
            </div>

            {/* Test Audio */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <Label>Test audio</Label>
                  <p className="text-sm text-muted-foreground">
                    Vyzkoušejte současná nastavení
                  </p>
                </div>
                <Button
                  onClick={handleTestAudio}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={testPlaying}
                >
                  {testPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Zastavit
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Test
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Reset Button */}
        <div className="pt-4 border-t">
          <Button
            onClick={resetToDefaults}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Obnovit výchozí nastavení
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioSettings;
