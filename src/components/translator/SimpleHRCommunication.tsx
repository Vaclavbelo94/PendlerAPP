
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Send, Volume2, MessageSquare, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAITranslator } from '@/hooks/useAITranslator';
import { supabase } from '@/integrations/supabase/client';

interface SimpleHRCommunicationProps {
  onTextToSpeech?: (text: string, language: string) => void;
}

const SimpleHRCommunication: React.FC<SimpleHRCommunicationProps> = ({ onTextToSpeech }) => {
  const { messages, isLoading, sendMessage, clearConversation } = useAITranslator();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Váš prohlížeč nepodporuje rozpoznávání řeči"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const newRecognition = new SpeechRecognition();
    
    newRecognition.continuous = false;
    newRecognition.interimResults = false;
    newRecognition.lang = 'cs-CZ';

    newRecognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Nahrávání",
        description: "Mluvte nyní..."
      });
    };

    newRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      toast({
        title: "Rozpoznáno",
        description: `"${transcript}"`
      });
    };

    newRecognition.onerror = (event) => {
      toast({
        variant: "destructive",
        title: "Chyba rozpoznávání",
        description: "Zkuste to znovu"
      });
      setIsListening(false);
    };

    newRecognition.onend = () => {
      setIsListening(false);
    };

    setRecognition(newRecognition);
    newRecognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    await sendMessage(inputText);
    setInputText('');
  };

  const handleSendToHR = async () => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Nejdříve si nechte text přeložit"
      });
      return;
    }

    const userMessage = messages[messages.length - 2];
    if (!userMessage || userMessage.role !== 'user') {
      toast({
        variant: "destructive",
        title: "Chyba", 
        description: "Nenalezen původní text"
      });
      return;
    }

    setIsSendingEmail(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-translation-email', {
        body: {
          email: 'vaclavbelo94@gmail.com',
          originalText: userMessage.content,
          translatedText: lastMessage.content,
          sourceLanguage: 'cs',
          targetLanguage: 'de'
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email odeslán",
        description: "Zpráva byla úspěšně odeslána na HR oddělení"
      });

      // Clear conversation history after successful email send
      clearConversation();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Chyba při odesílání",
        description: error.message || 'Nepodařilo se odeslat email'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handlePlayText = (text: string, language: string = 'de') => {
    if (onTextToSpeech) {
      onTextToSpeech(text, language);
    }
  };

  const getLanguageFromService = (service: string | undefined) => {
    if (service === 'gemini') return 'de';
    return 'de';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Napište nebo řekněte zprávu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Napište zprávu česky nebo polsky..."
            className="min-h-[100px] resize-none"
            disabled={isLoading}
          />
          
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "outline"}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isListening ? 'Zastavit' : 'Hlasem'}
            </Button>
            
            <Button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'Překládám...' : 'Přeložit'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={message.role === 'user' ? 'bg-blue-50 dark:bg-blue-950/20' : 'bg-green-50 dark:bg-green-950/20'}>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                      {message.role === 'user' ? 'Váš text' : 'Německý překlad'}
                    </Badge>
                    {message.service && (
                      <Badge variant="outline" className="text-xs">
                        {message.service}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.role === 'assistant' && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 border-t border-border/50">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlayText(message.content, getLanguageFromService(message.service))}
                        className="flex items-center gap-2 w-full sm:w-auto"
                      >
                        <Volume2 className="h-4 w-4" />
                        Přehrát
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={handleSendToHR}
                        disabled={isSendingEmail}
                        className="flex items-center gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90"
                      >
                        <Mail className="h-4 w-4" />
                        {isSendingEmail ? 'Odesílám...' : 'Odeslat na HR'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {messages.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Začněte komunikovat s HR</h3>
            <p className="text-muted-foreground">
              Napište nebo řekněte zprávu v češtině nebo polštině a my ji automaticky přeložíme do němčiny
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimpleHRCommunication;
