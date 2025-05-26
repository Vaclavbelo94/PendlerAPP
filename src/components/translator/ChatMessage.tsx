
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Volume2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ChatMessage as ChatMessageType } from '@/hooks/useAITranslator';

interface ChatMessageProps {
  message: ChatMessageType;
  onTextToSpeech?: (text: string, language: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onTextToSpeech }) => {
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Zkopírováno",
        description: "Text byl zkopírován do schránky"
      });
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleSpeak = () => {
    if (onTextToSpeech) {
      // Detekce jazyka pro TTS
      const language = /[áčďéěíňóřšťúůýž]/i.test(message.content) ? 'cs' : 'de';
      onTextToSpeech(message.content, language);
    }
  };

  const formatContent = (content: string) => {
    // Základní formátování pro AI odpovědi
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/🔄|📝|💡|📚|🎯|⚡|🌟/g, '<span class="text-lg">$&</span>');
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div 
          className={`rounded-lg px-4 py-3 ${
            isUser 
              ? 'bg-primary text-primary-foreground ml-4' 
              : 'bg-muted mr-4'
          }`}
        >
          <div 
            className="text-sm leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ 
              __html: isUser ? message.content : formatContent(message.content) 
            }}
          />
          
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/20">
            <span className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString('cs-CZ', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
              </Button>
              
              {onTextToSpeech && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSpeak}
                  className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
