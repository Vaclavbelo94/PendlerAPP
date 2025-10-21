
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Trash2, Bot, Zap, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAITranslator } from '@/hooks/useAITranslator';
import ChatMessage from './ChatMessage';
import AITypingIndicator from './AITypingIndicator';

interface AIChatInterfaceProps {
  onTextToSpeech?: (text: string, language: string) => void;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ onTextToSpeech }) => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, isLoading, currentService, sendMessage, clearConversation, loadHistory } = useAITranslator();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Auto-scroll to end of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getServiceBadge = () => {
    switch (currentService) {
      case 'lovable-ai':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Bot className="h-3 w-3" />
            Lovable AI
          </Badge>
        );
      case 'google-translate':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            Google Translate (záloha)
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Připojuji...
          </Badge>
        );
    }
  };

  const quickActions = [
    "Přelož mi: Kde je nejbližší nemocnice?",
    "Jak se řekne 'děkuji' formálně a neformálně?",
    "Pomoz mi s rozhovorem na úřadě",
    "Vysvětli mi němčí člen der, die, das",
    "Nauč mě základní fráze pro nákupy"
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Překladač
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Váš inteligentní asistent pro češtinu a němčinu
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-[400px]">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Vítejte u AI překladače!</h3>
              <p className="text-muted-foreground mb-4">
                Zeptejte se mě na překlad, gramatiku nebo praktické rady pro komunikaci v němčině.
              </p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Zkuste například:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickActions.slice(0, 3).map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(action)}
                      className="text-xs"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onTextToSpeech={onTextToSpeech}
            />
          ))}
          
          {isLoading && <AITypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        {messages.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(action)}
                  className="text-xs whitespace-nowrap flex-shrink-0"
                  disabled={isLoading}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Napište svou otázku nebo text k překladu..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearConversation}
                  className="px-3"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Stiskněte Enter pro odeslání, Shift+Enter pro nový řádek
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatInterface;
