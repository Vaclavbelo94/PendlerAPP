
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Play, StopCircle, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GenerationConfig {
  prefix: string;
  count: number;
  discount: number;
  duration: number;
  validDays: number;
  maxUses: number | null;
  pattern: 'random' | 'sequential' | 'uuid';
  length: number;
}

interface GeneratedCode {
  code: string;
  created: boolean;
  error?: string;
}

const BulkPromoCodeGenerator: React.FC = () => {
  const [config, setConfig] = useState<GenerationConfig>({
    prefix: 'BULK',
    count: 10,
    discount: 10,
    duration: 1,
    validDays: 30,
    maxUses: 1,
    pattern: 'random',
    length: 8
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);
  const [previewCodes, setPreviewCodes] = useState<string[]>([]);

  const generateCodeString = (index: number): string => {
    const { prefix, pattern, length } = config;
    
    switch (pattern) {
      case 'sequential':
        return `${prefix}${String(index + 1).padStart(length, '0')}`;
      
      case 'uuid':
        return `${prefix}${crypto.randomUUID().substring(0, length).toUpperCase()}`;
      
      case 'random':
      default:
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = prefix;
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
  };

  const generatePreview = () => {
    const preview = [];
    for (let i = 0; i < Math.min(5, config.count); i++) {
      preview.push(generateCodeString(i));
    }
    setPreviewCodes(preview);
  };

  const startBulkGeneration = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedCodes([]);

    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + config.validDays);

      const codes: GeneratedCode[] = [];
      
      for (let i = 0; i < config.count; i++) {
        const codeString = generateCodeString(i);
        
        try {
          const { error } = await supabase
            .from('promo_codes')
            .insert({
              code: codeString,
              discount: config.discount,
              duration: config.duration,
              valid_until: validUntil.toISOString(),
              max_uses: config.maxUses,
              used_count: 0
            });

          codes.push({
            code: codeString,
            created: !error,
            error: error?.message
          });

        } catch (error) {
          codes.push({
            code: codeString,
            created: false,
            error: error instanceof Error ? error.message : 'Neznámá chyba'
          });
        }

        setProgress(((i + 1) / config.count) * 100);
        setGeneratedCodes([...codes]);
        
        // Krátká pauza pro aktualizaci UI
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const successCount = codes.filter(c => c.created).length;
      const errorCount = codes.filter(c => !c.created).length;

      toast.success(`Generování dokončeno! ${successCount} kódů vytvořeno, ${errorCount} chyb`);

    } catch (error) {
      console.error('Chyba při bulk generování:', error);
      toast.error('Chyba při generování kódů');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportCodes = () => {
    const successfulCodes = generatedCodes.filter(c => c.created);
    
    const csvContent = [
      'Code,Discount,Duration,Valid Until,Max Uses',
      ...successfulCodes.map(c => {
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + config.validDays);
        return `${c.code},${config.discount}%,${config.duration} months,${validUntil.toLocaleDateString('cs-CZ')},${config.maxUses || 'Unlimited'}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-promo-codes-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Kódy exportovány do CSV');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Bulk generátor promo kódů
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefix kódů</Label>
              <Input
                id="prefix"
                value={config.prefix}
                onChange={(e) => setConfig(prev => ({ ...prev, prefix: e.target.value.toUpperCase() }))}
                placeholder="BULK"
                disabled={isGenerating}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="count">Počet kódů</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="1000"
                value={config.count}
                onChange={(e) => setConfig(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Sleva (%)</Label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="100"
                value={config.discount}
                onChange={(e) => setConfig(prev => ({ ...prev, discount: parseInt(e.target.value) || 1 }))}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Délka (měsíce)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="12"
                value={config.duration}
                onChange={(e) => setConfig(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validDays">Platnost (dny)</Label>
              <Input
                id="validDays"
                type="number"
                min="1"
                max="365"
                value={config.validDays}
                onChange={(e) => setConfig(prev => ({ ...prev, validDays: parseInt(e.target.value) || 1 }))}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUses">Max. použití</Label>
              <Input
                id="maxUses"
                type="number"
                min="1"
                value={config.maxUses || ''}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  maxUses: e.target.value ? parseInt(e.target.value) : null 
                }))}
                placeholder="Neomezeno"
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pattern">Vzor generování</Label>
              <Select
                value={config.pattern}
                onValueChange={(value: 'random' | 'sequential' | 'uuid') => 
                  setConfig(prev => ({ ...prev, pattern: value }))
                }
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Náhodné</SelectItem>
                  <SelectItem value="sequential">Postupné</SelectItem>
                  <SelectItem value="uuid">UUID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">Délka kódu (bez prefixu)</Label>
              <Input
                id="length"
                type="number"
                min="4"
                max="20"
                value={config.length}
                onChange={(e) => setConfig(prev => ({ ...prev, length: parseInt(e.target.value) || 8 }))}
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generatePreview} variant="outline" disabled={isGenerating}>
              Náhled
            </Button>
            <Button onClick={startBulkGeneration} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <StopCircle className="h-4 w-4 mr-2" />
                  Generuji...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Spustit generování
                </>
              )}
            </Button>
          </div>

          {previewCodes.length > 0 && (
            <div className="space-y-2">
              <Label>Náhled kódů:</Label>
              <div className="flex flex-wrap gap-2">
                {previewCodes.map((code, index) => (
                  <Badge key={index} variant="outline">{code}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle>Průběh generování</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4" />
            <p className="text-sm text-muted-foreground">
              {Math.round(progress)}% dokončeno ({generatedCodes.length} / {config.count} kódů)
            </p>
          </CardContent>
        </Card>
      )}

      {generatedCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Vygenerované kódy
              <Button onClick={exportCodes} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {generatedCodes.map((code, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-mono">{code.code}</span>
                  <Badge variant={code.created ? "default" : "destructive"}>
                    {code.created ? "Vytvořen" : "Chyba"}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Úspěšně vytvořeno: {generatedCodes.filter(c => c.created).length} / {generatedCodes.length}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkPromoCodeGenerator;
