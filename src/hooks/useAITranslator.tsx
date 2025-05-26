
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  service?: 'gemini' | 'google-translate' | 'none';
  fallback?: boolean;
}

export const useAITranslator = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentService, setCurrentService] = useState<'gemini' | 'google-translate' | 'none'>('gemini');

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-translator', {
        body: {
          message: userMessage,
          conversationHistory
        }
      });

      if (error) throw error;

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        service: data.service,
        fallback: data.fallback
      };

      setMessages(prev => [...prev, aiMsg]);
      setCurrentService(data.service);

      // Show service status toast
      if (data.fallback) {
        toast({
          title: "Záložní režim",
          description: "AI není dostupná, používám Google Translate",
          variant: "default",
        });
      } else if (data.service === 'gemini') {
        // Only show success toast on first successful Gemini call
        if (currentService !== 'gemini') {
          toast({
            title: "AI aktivní",
            description: "Používám Google Gemini AI asistenta",
            variant: "default",
          });
        }
      }

      // Save to localStorage
      const savedHistory = localStorage.getItem('aiTranslatorHistory') || '[]';
      const history = JSON.parse(savedHistory);
      history.push(userMsg, aiMsg);
      
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }
      
      localStorage.setItem('aiTranslatorHistory', JSON.stringify(history));

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Nepodařilo se odeslat zprávu. Zkuste to prosím znovu."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('aiTranslatorHistory');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        setMessages(history.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  return {
    messages,
    isLoading,
    currentService,
    sendMessage,
    clearConversation,
    loadHistory
  };
};
