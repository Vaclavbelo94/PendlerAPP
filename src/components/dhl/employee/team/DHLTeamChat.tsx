import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Users, 
  Clock,
  AlertCircle,
  Megaphone,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface TeamMessage {
  id: string;
  sender_id: string;
  team_id?: string;
  message_type: 'text' | 'shift_swap' | 'announcement' | 'emergency';
  content: string;
  metadata: any;
  is_read: boolean;
  reply_to_id?: string;
  expires_at?: string;
  created_at: string;
  sender?: {
    email: string;
    username?: string;
  };
}

interface DHLTeamChatProps {
  className?: string;
}

export const DHLTeamChat: React.FC<DHLTeamChatProps> = ({ 
  className = '' 
}) => {
  const { t } = useTranslation('dhl-employee');
  const { user } = useAuth();
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'shift_swap' | 'announcement' | 'emergency'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (user) {
      loadMessages();
      setupRealtimeSubscription();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('dhl_team_messages')
      .select(`
        *,
        sender:profiles(email, username)
      `)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages((data || []) as TeamMessage[]);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('team-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dhl_team_messages'
        },
        (payload) => {
          const newMessage = payload.new as TeamMessage;
          setMessages(prev => [...prev, newMessage]);
          
          // Show notification for new messages
          if (newMessage.sender_id !== user?.id) {
            toast({
              title: 'Nová zpráva',
              description: newMessage.content.substring(0, 100) + (newMessage.content.length > 100 ? '...' : ''),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    setIsLoading(true);
    try {
      const messageData = {
        sender_id: user.id,
        message_type: messageType,
        content: newMessage.trim(),
        metadata: {
          timestamp: new Date().toISOString(),
          urgent: messageType === 'emergency'
        }
      };

      const { error } = await supabase
        .from('dhl_team_messages')
        .insert(messageData);

      if (error) throw error;

      setNewMessage('');
      setMessageType('text');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t('common.error'),
        description: 'Chyba při odesílání zprávy',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'shift_swap':
        return <Clock className="h-3 w-3" />;
      case 'announcement':
        return <Megaphone className="h-3 w-3" />;
      case 'emergency':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getMessageBadgeColor = (type: string) => {
    switch (type) {
      case 'shift_swap':
        return 'bg-blue-100 text-blue-800';
      case 'announcement':
        return 'bg-purple-100 text-purple-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t('team.chat')}
          </div>
          <Badge variant="secondary" className="text-xs">
            {onlineUsers.length} online
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            <AnimatePresence>
              {messages.map((message) => {
                const isOwn = message.sender_id === user?.id;
                const senderName = message.sender?.username || message.sender?.email?.split('@')[0] || 'Uživatel';
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isOwn && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {senderName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex flex-col max-w-[80%] ${isOwn ? 'items-end' : 'items-start'}`}>
                      {!isOwn && (
                        <span className="text-xs text-muted-foreground mb-1">
                          {senderName}
                        </span>
                      )}
                      
                      <div
                        className={`px-3 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {/* Message Type Badge */}
                        {message.message_type !== 'text' && (
                          <div className="mb-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getMessageBadgeColor(message.message_type)}`}
                            >
                              {getMessageIcon(message.message_type)}
                              <span className="ml-1">
                                {t(`team.messageTypes.${message.message_type}`)}
                              </span>
                            </Badge>
                          </div>
                        )}
                        
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4 space-y-3">
          {/* Message Type Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['text', 'shift_swap', 'announcement', 'emergency'] as const).map((type) => (
              <Button
                key={type}
                variant={messageType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMessageType(type)}
                className="flex-shrink-0 text-xs"
              >
                {getMessageIcon(type)}
                <span className="ml-1">
                  {t(`team.messageTypes.${type}`)}
                </span>
              </Button>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('team.sendMessage')}
              className="flex-1 min-h-[40px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !newMessage.trim()}
              size="sm"
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DHLTeamChat;