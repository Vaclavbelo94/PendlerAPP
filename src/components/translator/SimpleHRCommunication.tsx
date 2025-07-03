import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, MicOff, Volume2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface SimpleHRCommunicationProps {
  onTextToSpeech?: (text: string, language: string) => void;
}

const SimpleHRCommunication: React.FC<SimpleHRCommunicationProps> = ({
  onTextToSpeech
}) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Automatický překlad při změně textu
  useEffect(() => {
    if (inputText.trim().length > 2) {
      const timer = setTimeout(() => {
        handleTranslate();
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setTranslatedText('');
    }
  }, [inputText]);

  // Detekce jazyka a překlad
  const detectLanguage = (text: string): 'cs' | 'pl' => {
    const czechChars = /[áčďéěíňóřšťúůýž]/i;
    const polishChars = /[ąćęłńóśźż]/i;
    
    if (polishChars.test(text)) {
      return 'pl';
    }
    return 'cs'; // default to Czech
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    try {
      const sourceLanguage = detectLanguage(inputText);
      
      const { data, error } = await supabase.functions.invoke('ai-translator', {
        body: {
          message: inputText.trim(),
          sourceLanguage,
          targetLanguage: 'de'
        }
      });

      if (error) throw error;
      
      if (data?.response) {
        setTranslatedText(data.response);
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        variant: "destructive",
        title: "Chyba překladu",
        description: "Nepodařilo se přeložit text. Zkuste to znovu.",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  // Hlasový vstup
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Nepodporováno",
        description: "Váš prohlížeč nepodporuje hlasové rozpoznávání",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'cs-CZ';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast({
        variant: "destructive",
        title: "Chyba rozpoznávání",
        description: "Nepodařilo se rozpoznat hlas. Zkuste to znovu.",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Vylepšené odeslání emailu s debug informacemi
  const handleSendToHR = async () => {
    console.log('[HR DEBUG] Starting email send process...');
    console.log('[HR DEBUG] Input validation:', {
      hasInputText: !!inputText.trim(),
      hasTranslatedText: !!translatedText.trim(),
      inputLength: inputText.trim().length,
      translatedLength: translatedText.trim().length
    });

    if (!inputText.trim() || !translatedText.trim()) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Nejdříve napište text a nechte ho přeložit",
      });
      return;
    }

    setIsSendingEmail(true);
    setDebugInfo('Připravuji email...');
    
    try {
      const sourceLanguage = detectLanguage(inputText);
      
      const emailPayload = {
        email: 'vaclavbelo9@gmail.com',
        originalText: inputText,
        translatedText: translatedText,
        sourceLanguage: sourceLanguage === 'cs' ? 'Čeština' : 'Polština',
        targetLanguage: 'Němčina'
      };

      console.log('[HR DEBUG] Calling supabase function with payload:', {
        ...emailPayload,
        originalText: emailPayload.originalText.substring(0, 50) + '...',
        translatedText: emailPayload.translatedText.substring(0, 50) + '...'
      });

      setDebugInfo('Volám email funkci...');

      const { data, error } = await supabase.functions.invoke('send-translation-email', {
        body: emailPayload
      });

      console.log('[HR DEBUG] Supabase function response:', {
        data,
        error,
        hasData: !!data,
        hasError: !!error
      });

      if (error) {
        console.error('[HR ERROR] Supabase function error:', error);
        setDebugInfo(`Chyba: ${error.message}`);
        throw new Error(`Chyba při volání funkce: ${error.message}`);
      }

      if (!data) {
        console.error('[HR ERROR] No data received from function');
        setDebugInfo('Chyba: Žádná odpověď od funkce');
        throw new Error('Žádná odpověď od email funkce');
      }

      if (!data.success) {
        console.error('[HR ERROR] Function returned failure:', data);
        setDebugInfo(`Chyba: ${data.error || 'Neznámá chyba'}`);
        throw new Error(data.error || 'Email se nepodařilo odeslat');
      }

      console.log('[HR SUCCESS] Email sent successfully:', data);
      setDebugInfo(`Úspěch: Email odeslán (ID: ${data.messageId})`);

      setEmailSent(true);
      toast({
        title: "Email odeslán",
        description: `Zpráva byla úspešně odeslána na HR oddělení (ID: ${data.messageId})`,
      });

      // Reset po 5 sekundách (delší čas pro debug)
      setTimeout(() => {
        setInputText('');
        setTranslatedText('');
        setEmailSent(false);
        setDebugInfo('');
      }, 5000);

    } catch (error) {
      console.error('[HR ERROR] Complete error:', error);
      const errorMessage = error.message || 'Nepodařilo se odeslat email';
      setDebugInfo(`Chyba: ${errorMessage}`);
      
      toast({
        variant: "destructive",
        title: "Chyba odeslání",
        description: errorMessage,
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handlePlayTranslation = () => {
    if (translatedText && onTextToSpeech) {
      onTextToSpeech(translatedText, 'de');
    }
  };

  if (emailSent) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Email odeslán!</h3>
        <p className="text-muted-foreground mb-4">
          Zpráva byla úspešně odeslána na HR oddělení
        </p>
        {debugInfo && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            {debugInfo}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Debug info panel */}
      {debugInfo && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Debug Info:</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {debugInfo}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Hlavní vstupní pole */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Napište zprávu pro HR</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  className={isListening ? "bg-red-50 border-red-200" : ""}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-1" />
                      Zastavit
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-1" />
                      Hlasem
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Textarea
              placeholder="Napište česky nebo polsky... (např. 'Potřebuję pomoc s harmonogramom směn')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[120px] text-lg resize-none"
              disabled={isListening}
            />

            {isListening && (
              <div className="flex items-center justify-center py-4 text-red-600">
                <div className="animate-pulse flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                  <span>Naslouchám...</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Německý překlad */}
      {(translatedText || isTranslating) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-700">Německý překlad</h3>
                {translatedText && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlayTranslation}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Přehrát
                  </Button>
                )}
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                {isTranslating ? (
                  <div className="flex items-center justify-center py-4 text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Překládám...
                  </div>
                ) : (
                  <p className="text-lg leading-relaxed">{translatedText}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tlačítko pro odeslání */}
      {translatedText && !isTranslating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={handleSendToHR}
            disabled={isSendingEmail}
            className="w-full h-14 text-lg font-semibold"
          >
            {isSendingEmail ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Odesílám na HR...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Odeslat na HR oddělení
              </>
            )}
          </Button>
          
          {/* Debug tlačítko pro test */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log('[HR DEBUG] Manual debug trigger');
              setDebugInfo(`Test debug: ${new Date().toISOString()}`);
            }}
            className="w-full mt-2 text-xs"
          >
            Debug Test
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default SimpleHRCommunication;
