
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from './components/LanguageSelector';
import TranslationInput from './components/TranslationInput';
import TranslationControls from './components/TranslationControls';

interface QuickTranslationProps {
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

const QuickTranslation: React.FC<QuickTranslationProps> = (props) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <span>{t('quickTranslations') || 'Rychlé překlady'}</span>
        </CardTitle>
        <CardDescription>
          {t('quickTranslationsDescription') || 'Klasický překladač pro rychlé překlady bez AI asistenta'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between">
              <LanguageSelector
                value={props.sourceLanguage}
                onValueChange={props.setSourceLanguage}
                id="sourceLanguage"
                languages={props.languagePairs}
              />
              
              <div className="hidden md:flex items-center self-center">
                <button 
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  onClick={props.handleSwapLanguages}
                >
                  ⇄
                </button>
              </div>
              
              <LanguageSelector
                value={props.targetLanguage}
                onValueChange={props.setTargetLanguage}
                id="targetLanguage"
                languages={props.languagePairs}
              />
            </div>
            
            <TranslationInput
              value={props.sourceText}
              onChange={(e) => props.setSourceText(e.target.value)}
              label={t('sourceLanguage') || 'Zdrojový jazyk'}
              placeholder={t('enterTextToTranslate') || 'Zadejte text k překladu...'}
              onTextToSpeech={() => props.handleTextToSpeech(props.sourceText, props.sourceLanguage)}
              actions={
                <button 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => props.setSourceText("")}
                >
                  {t('clear') || 'Vymazat'}
                </button>
              }
            />
          </div>
          
          <div className="w-full md:w-1/2 space-y-2">
            <TranslationInput
              value={props.translatedText}
              onChange={() => {}}
              label={t('targetLanguage') || 'Cílový jazyk'}
              placeholder={t('translatedText') || 'Přeložený text...'}
              readOnly={true}
              className="min-h-[200px] resize-none bg-muted/30"
              onTextToSpeech={() => props.handleTextToSpeech(props.translatedText, props.targetLanguage)}
              actions={
                <button 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => navigator.clipboard.writeText(props.translatedText)}
                  disabled={!props.translatedText.trim()}
                >
                  {t('copy') || 'Kopírovat'}
                </button>
              }
            />
          </div>
        </div>
        
        <TranslationControls
          autoTranslate={props.autoTranslate}
          setAutoTranslate={props.setAutoTranslate}
          isTranslating={props.isTranslating}
          onTranslate={props.handleTranslate}
          onSwapLanguages={props.handleSwapLanguages}
        />
      </CardContent>
    </Card>
  );
};

export default QuickTranslation;
