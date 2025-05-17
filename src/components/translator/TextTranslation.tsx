
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRightLeft, Copy, Volume2, Languages } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface TextTranslationProps {
  sourceText: string;
  setSourceText: (text: string) => void;
  translatedText: string;
  sourceLanguage: string;
  setSourceLanguage: (language: string) => void;
  targetLanguage: string;
  setTargetLanguage: (language: string) => void;
  autoTranslate: boolean;
  setAutoTranslate: (auto: boolean) => void;
  isTranslating: boolean;
  handleTranslate: () => void;
  handleSwapLanguages: () => void;
  handleTextToSpeech: (text: string, language: string) => void;
  languagePairs: Array<{code: string, name: string}>;
}

const TextTranslation: React.FC<TextTranslationProps> = ({
  sourceText,
  setSourceText,
  translatedText,
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
  autoTranslate,
  setAutoTranslate,
  isTranslating,
  handleTranslate,
  handleSwapLanguages,
  handleTextToSpeech,
  languagePairs
}) => {
  const handleCopyTranslation = () => {
    if (!translatedText.trim()) return;
    
    navigator.clipboard.writeText(translatedText);
    toast({
      title: "Zkopírováno",
      description: "Překlad byl zkopírován do schránky",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          <span>Překlad textu</span>
        </CardTitle>
        <CardDescription>
          Přeložte text mezi češtinou, němčinou, angličtinou a dalšími jazyky
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="sourceLanguage">Zdrojový jazyk</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => setSourceText("")}
              >
                Vymazat
              </Button>
            </div>
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger id="sourceLanguage">
                <SelectValue placeholder="Vyberte jazyk" />
              </SelectTrigger>
              <SelectContent>
                {languagePairs.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Zadejte text k překladu..."
              className="min-h-[200px] resize-none"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => handleTextToSpeech(sourceText, sourceLanguage)}
              disabled={!sourceText.trim()}
            >
              <Volume2 className="mr-2 h-4 w-4" />
              Přečíst
            </Button>
          </div>
          
          <div className="hidden md:flex items-center self-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={handleSwapLanguages}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="targetLanguage">Cílový jazyk</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={handleCopyTranslation}
                disabled={!translatedText.trim()}
              >
                <Copy className="h-3 w-3 mr-1" />
                Kopírovat
              </Button>
            </div>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger id="targetLanguage">
                <SelectValue placeholder="Vyberte jazyk" />
              </SelectTrigger>
              <SelectContent>
                {languagePairs.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Přeložený text..."
              className="min-h-[200px] resize-none bg-muted/30"
              value={translatedText}
              readOnly
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => handleTextToSpeech(translatedText, targetLanguage)}
              disabled={!translatedText.trim()}
            >
              <Volume2 className="mr-2 h-4 w-4" />
              Přečíst
            </Button>
          </div>
        </div>
        
        <div className="md:hidden flex justify-center my-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={handleSwapLanguages}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator />
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-translate"
              checked={autoTranslate}
              onCheckedChange={setAutoTranslate}
            />
            <Label htmlFor="auto-translate">Automatický překlad</Label>
          </div>
          
          <Button 
            onClick={handleTranslate} 
            disabled={isTranslating || !sourceText.trim()}
            className="w-full sm:w-auto"
          >
            {isTranslating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                Překládám...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-4 w-4" />
                Přeložit
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextTranslation;
