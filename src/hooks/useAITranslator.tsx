
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  service?: 'lovable-ai' | 'google-translate' | 'none';
  fallback?: boolean;
}

export const useAITranslator = () => {
  const { t } = useTranslation('translator');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentService, setCurrentService] = useState<'lovable-ai' | 'google-translate' | 'none'>('lovable-ai');

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    console.log('🚀 useAITranslator - sendMessage called:', {
      message: userMessage.trim(),
      messageLength: userMessage.trim().length,
      currentService,
      timestamp: new Date().toISOString()
    });

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      console.log('📡 Calling supabase.functions.invoke...');
      
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-translator-v2', {
        body: {
          message: userMessage,
          conversationHistory
        }
      });

      console.log('📨 Supabase function response:', {
        data,
        error,
        hasData: !!data,
        hasError: !!error
      });

      if (error) {
        console.error('❌ Supabase function error:', error);
        
        // Handle rate limit error
        if (error.message?.includes('429') || data?.rateLimitExceeded) {
          toast({
            variant: "destructive",
            title: t('toastMessages.rateLimitTitle'),
            description: t('toastMessages.rateLimitDescription')
          });
          setIsLoading(false);
          return;
        }
        
        // Handle payment required error
        if (error.message?.includes('402') || data?.paymentRequired) {
          toast({
            variant: "destructive",
            title: t('toastMessages.creditsTitle'),
            description: t('toastMessages.creditsDescription')
          });
          setIsLoading(false);
          return;
        }
        
        throw error;
      }

      if (!data) {
        console.error('❌ No data received from function');
        throw new Error('noResponse');
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        service: data.service,
        fallback: data.fallback
      };

      console.log('✅ AI response processed:', {
        response: data.response,
        service: data.service,
        fallback: data.fallback,
        responseLength: data.response?.length
      });

      setMessages(prev => [...prev, aiMsg]);
      setCurrentService(data.service);

      // Show service status toast
      if (data.fallback) {
        toast({
          title: t('toastMessages.fallbackMode'),
          description: t('toastMessages.fallbackDescription'),
          variant: "default",
        });
      } else if (data.service === 'lovable-ai') {
        // Only show success toast on first successful call
        if (currentService !== 'lovable-ai') {
          toast({
            title: t('toastMessages.serviceActive'),
            description: t('toastMessages.serviceDescription'),
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
      console.error('💥 Complete error in sendMessage:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      const errorMessage = error.message === 'noResponse' 
        ? t('toastMessages.noResponse')
        : `${t('toastMessages.translationFailed')}: ${error.message || t('toastMessages.error')}`;
      
      toast({
        variant: "destructive",
        title: t('toastMessages.translationError'),
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    console.log('🗑️ Clearing conversation history');
    setMessages([]);
  };

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('aiTranslatorHistory');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        console.log('📚 Loading conversation history:', {
          historyLength: history.length,
          hasHistory: history.length > 0
        });
        setMessages(history.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        console.log('📚 No conversation history found');
      }
    } catch (error) {
      console.error('❌ Error loading history:', error);
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
