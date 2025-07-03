
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Copy, Volume2, ArrowRightLeft, Trash2, History } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAITranslator } from '@/hooks/useAITranslator';
import { supportedLanguages, getCommonPhrases, getWorkplacePhrases } from '@/data/translatorData';
import { useTranslation } from 'react-i18next';

interface SimpleAutoTranslatorProps {
  onTextToSpeech: (text: string, language: string) => void;
}

const SimpleAutoTranslator: React.FC<SimpleAutoTranslatorProps> = ({ onTextToSpeech }) => {
  const { t } = useTranslation('translator');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('cs');
  const [targetLanguage, setTargetLanguage] = useState('de');
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const {
    messages,
    isLoading,
    currentService,
    sendMessage,
    clearConversation,
    loadHistory
  } = useAITranslator();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Auto-translate effect
  useEffect(() => {
    if (autoTranslate && sourceText.trim().length > 0) {
      const timer = setTimeout(() => {
        handleTranslate();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [sourceText, autoTranslate, sourceLanguage, targetLanguage]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Zadejte text k překladu"
      });
      return;
    }

    console.log('🔍 SimpleAutoTranslator - Starting translation:', {
      sourceText: sourceText.trim(),
      sourceLanguage,
      targetLanguage,
      messageCount: messages.length
    });

    setIsTranslating(true);
    
    try {
      await sendMessage(sourceText.trim());
      
      // Get the latest translated message
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'assistant') {
          setTranslatedText(lastMessage.content);
          console.log('✅ Translation successful:', lastMessage.content);
        }
      }
      
    } catch (error) {
      console.error('❌ Translation failed:', error);
      toast({
        variant: "destructive",
        title: "Chyba při překladu",
        description: "Nepodařilo se přeložit text. Zkuste to prosím znovu."
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Zkopírováno",
      description: "Text byl zkopírován do schránky"
    });
  };

  const handleUsePhrase = (phrase: string) => {
    setSourceText(phrase);
    if (autoTranslate) {
      setTimeout(() => handleTranslate(), 500);
    }
  };

  const commonPhrases = getCommonPhrases();
  const workplacePhrases = getWorkplacePhrases();

  const currentSourcePhrases = commonPhrases[sourceLanguage as keyof typeof commonPhrases] || [];
  const currentWorkplacePhrases = workplacePhrases[sourceLanguage as keyof typeof workplacePhrases] || [];

  const getLanguageName = (code: string) => {
    const lang = supportedLanguages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  return (
    <div className="space-y-6">
      {/* Service Status */}
      {currentService && (
        <div className="text-center p-2 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground">
            {currentService === 'gemini' && '🤖 AI aktivní (Google Gemini)'}
            {currentService === 'google-translate' && '🔄 Záložní režim (Google Translate)'}
            {currentService === 'none' && '⚠️ Služby nedostupné'}
          </span>
        </div>
      )}

      {/* Main Translation Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {t('aiTranslator') || 'AI Překladač'}
              {isLoading && <span className="text-sm text-muted-foreground">(Překládá...)</span>}
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-translate"
                  checked={autoTranslate}
                  onCheckedChange={setAutoTranslate}
                />
                <Label htmlFor="auto-translate" className="text-sm">
                  {t('autoTranslate') || 'Automatický překlad'}
                </Label>
              </div>
              {messages.length > 0 && (
                <Button
                  onClick={clearConversation}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Vymazat
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Language Selection */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="source-lang" className="text-sm font-medium">
                {t('sourceLanguage') || 'Zdrojový jazyk'}
              </Label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger id="source-lang">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleSwapLanguages}
              size="sm"
              variant="outline"
              className="mt-6"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <Label htmlFor="target-lang" className="text-sm font-medium">
                {t('targetLanguage') || 'Cílový jazyk'}
              </Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger id="target-lang">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Translation Input/Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source-text" className="text-sm font-medium">
                {getLanguageName(sourceLanguage)}
              </Label>
              <div className="relative">
                <Textarea
                  id="source-text"
                  placeholder={t('enterTextToTranslate') || 'Zadejte text k překladu...'}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  className="min-h-32 resize-none"
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button
                    onClick={() => onTextToSpeech(sourceText, sourceLanguage)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    disabled={!sourceText.trim()}
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => handleCopyToClipboard(sourceText)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    disabled={!sourceText.trim()}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="translated-text" className="text-sm font-medium">
                {getLanguageName(targetLanguage)}
              </Label>
              <div className="relative">
                <Textarea
                  id="translated-text"
                  placeholder={t('translationWillAppearHere') || 'Překlad se zobrazí zde...'}
                  value={isLoading ? 'Překládá...' : (messages.length > 0 ? messages[messages.length - 1]?.content || '' : '')}
                  readOnly
                  className="min-h-32 resize-none bg-muted/50"
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button
                    onClick={() => onTextToSpeech(messages.length > 0 ? messages[messages.length - 1]?.content || '' : '', targetLanguage)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    disabled={!messages.length || isLoading}
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => handleCopyToClipboard(messages.length > 0 ? messages[messages.length - 1]?.content || '' : '')}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    disabled={!messages.length || isLoading}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Translate Button */}
          {!autoTranslate && (
            <div className="flex justify-center">
              <Button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isTranslating}
                className="min-w-32"
              >
                {isTranslating ? 'Překládá...' : (t('translate') || 'Přeložit')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Phrases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('commonPhrases') || 'Běžné fráze'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {currentSourcePhrases.map((phrase, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleUsePhrase(phrase)}
                  className="justify-start text-left h-auto py-2 px-3 whitespace-normal"
                >
                  {phrase}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('workplacePhrases') || 'Pracovní fráze'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {currentWorkplacePhrases.map((phrase, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleUsePhrase(phrase)}
                  className="justify-start text-left h-auto py-2 px-3 whitespace-normal"
                >
                  {phrase}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversation History */}
      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              {t('conversationHistory') || 'Historie konverzace'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary/10 ml-8'
                      : 'bg-muted/50 mr-8'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                        {message.service && ` • ${message.service}`}
                        {message.fallback && ' • Záložní'}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleCopyToClipboard(message.content)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 shrink-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimpleAutoTranslator;
