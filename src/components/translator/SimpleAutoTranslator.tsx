
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Volume2, Copy, Trash2, History, Languages, Sparkles } from 'lucide-react';
import { useAITranslator } from '@/hooks/useAITranslator';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface SimpleAutoTranslatorProps {
  onTextToSpeech?: (text: string, language: string) => void;
}

const SimpleAutoTranslator: React.FC<SimpleAutoTranslatorProps> = ({ onTextToSpeech }) => {
  const { t } = useLanguage();
  const { messages, isLoading, currentService, sendMessage, clearConversation, loadHistory } = useAITranslator();
  const [inputText, setInputText] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('enterTextToTranslate')
      });
      return;
    }

    await sendMessage(inputText);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('success'),
      description: t('textCopied')
    });
  };

  const handleClear = () => {
    setInputText('');
    clearConversation();
  };

  const handleTextToSpeech = (text: string, lang: string = 'de') => {
    if (onTextToSpeech) {
      onTextToSpeech(text, lang);
    }
  };

  const getServiceBadge = () => {
    switch (currentService) {
      case 'gemini':
        return <Badge variant="default" className="bg-green-500"><Sparkles className="w-3 h-3 mr-1" />AI Aktivní</Badge>;
      case 'google-translate':
        return <Badge variant="secondary"><Languages className="w-3 h-3 mr-1" />Google Translate</Badge>;
      default:
        return <Badge variant="outline">Offline</Badge>;
    }
  };

  const latestResponse = messages.length > 0 ? messages[messages.length - 1] : null;
  const isAIResponse = latestResponse?.role === 'assistant';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Service Status */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getServiceBadge()}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2"
        >
          <History className="w-4 h-4" />
          {t('translationHistory')}
        </Button>
      </div>

      {/* Main Translation Interface */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              {t('enterText')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`${t('enterText')}...`}
              className="min-h-32 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleTranslate();
                }
              }}
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleTranslate} 
                disabled={isLoading || !inputText.trim()}
                className="flex-1"
              >
                {isLoading ? t('translating') : t('translate')}
              </Button>
              <Button variant="outline" size="icon" onClick={handleClear}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5" />
              {t('translatedText')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-32 p-4 bg-muted rounded-md border">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-24"
                  >
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">{t('translating')}</span>
                  </motion.div>
                ) : isAIResponse ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-sm max-w-none"
                  >
                    <div className="whitespace-pre-wrap">{latestResponse.content}</div>
                  </motion.div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    {t('translatedText')}...
                  </div>
                )}
              </AnimatePresence>
            </div>
            
            {isAIResponse && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopy(latestResponse.content)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {t('copyText')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTextToSpeech(latestResponse.content, 'de')}
                  className="flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  {t('playAudio')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* History Section */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    {t('translationHistory')}
                  </CardTitle>
                  {messages.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearConversation}>
                      {t('clearHistory')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    {t('noHistory')}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {messages.slice().reverse().map((message, index) => (
                      <div key={message.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                            {message.role === 'user' ? 'Vstup' : 'Překlad'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        {message.role === 'assistant' && (
                          <div className="mt-2 flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCopy(message.content)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleTextToSpeech(message.content, 'de')}
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimpleAutoTranslator;
