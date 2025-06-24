
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Volume2, Copy, Trash2, History, Languages, Sparkles, Mail } from 'lucide-react';
import { useAITranslator } from '@/hooks/useAITranslator';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { EmailDialog } from './EmailDialog';
import { supabase } from '@/integrations/supabase/client';

interface SimpleAutoTranslatorProps {
  onTextToSpeech?: (text: string, language: string) => void;
}

const SimpleAutoTranslator: React.FC<SimpleAutoTranslatorProps> = ({ onTextToSpeech }) => {
  const { t } = useTranslation(['translator', 'common']);
  const { messages, isLoading, currentService, sendMessage, clearConversation, loadHistory } = useAITranslator();
  const [inputText, setInputText] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: t('common:error'),
        description: t('translator:enterText')
      });
      return;
    }

    await sendMessage(inputText);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('common:success'),
      description: t('translator:copyTranslation')
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

  const handleSendEmail = async (email: string) => {
    const latestResponse = messages.length > 0 ? messages[messages.length - 1] : null;
    const originalText = messages.length > 1 ? messages[messages.length - 2]?.content : inputText;
    
    if (!latestResponse || latestResponse.role !== 'assistant') {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Nejprve vytvořte překlad"
      });
      return;
    }

    setIsEmailLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-translation-email', {
        body: {
          email,
          originalText,
          translatedText: latestResponse.content,
          sourceLanguage: 'cs/pl',
          targetLanguage: 'de'
        }
      });

      if (error) throw error;

      toast({
        title: "Email odeslán",
        description: `Překlad byl odeslán na ${email}`
      });
      
      setShowEmailDialog(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Nepodařilo se odeslat email"
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const getServiceBadge = () => {
    switch (currentService) {
      case 'gemini':
        return <Badge variant="default" className="bg-green-500"><Sparkles className="w-3 h-3 mr-1" />{t('translator:aiActive')}</Badge>;
      case 'google-translate':
        return <Badge variant="secondary"><Languages className="w-3 h-3 mr-1" />{t('translator:googleTranslate')}</Badge>;
      default:
        return <Badge variant="outline">{t('translator:offline')}</Badge>;
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
          {t('translator:history')}
        </Button>
      </div>

      {/* Main Translation Interface */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              {t('translator:enterText')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('translator:enterTextPlaceholder')}
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
                {isLoading ? t('translator:translating') : t('translator:translateToGerman')}
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
              {t('translator:germanTranslation')}
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
                    <span className="ml-2 text-sm text-muted-foreground">{t('translator:translating')}</span>
                  </motion.div>
                ) : isAIResponse ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-sm max-w-none"
                  >
                    <div className="whitespace-pre-wrap text-lg font-medium">{latestResponse.content}</div>
                  </motion.div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    {t('translator:translationPlaceholder')}
                  </div>
                )}
              </AnimatePresence>
            </div>
            
            {isAIResponse && (
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopy(latestResponse.content)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {t('translator:copy')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTextToSpeech(latestResponse.content, 'de')}
                  className="flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  {t('translator:play')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowEmailDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {t('translator:sendByEmail')}
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
                    {t('translator:translationHistory')}
                  </CardTitle>
                  {messages.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearConversation}>
                      {t('translator:clearHistory')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    {t('translator:noTranslationHistory')}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {messages.slice().reverse().map((message, index) => (
                      <div key={message.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                            {message.role === 'user' ? t('translator:input') : t('translator:germanTranslation')}
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

      {/* Email Dialog */}
      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSendEmail={handleSendEmail}
        isLoading={isEmailLoading}
      />
    </div>
  );
};

export default SimpleAutoTranslator;
