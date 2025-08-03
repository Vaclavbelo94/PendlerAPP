import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  document_id: string;
  reminder_type: 'expiry' | 'renewal' | 'submission' | 'review';
  reminder_date: string;
  is_sent: boolean;
  is_dismissed: boolean;
  notes?: string;
  created_at: string;
  document: {
    title: string;
    document_type: string;
    expiry_date?: string;
  };
}

interface DocumentRemindersProps {
  className?: string;
}

export const DocumentReminders: React.FC<DocumentRemindersProps> = ({ 
  className = '' 
}) => {
  const { t } = useTranslation('dhl-employee');
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadReminders();
      setupRealtimeSubscription();
    }
  }, [user]);

  const loadReminders = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('dhl_document_reminders')
        .select(`
          *,
          document:dhl_document_storage(title, document_type, expiry_date)
        `)
        .eq('user_id', user.id)
        .eq('is_dismissed', false)
        .gte('reminder_date', new Date().toISOString().split('T')[0])
        .order('reminder_date', { ascending: true });

      if (error) throw error;

      setReminders((data || []) as Reminder[]);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('reminder-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dhl_document_reminders',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          loadReminders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const dismissReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('dhl_document_reminders')
        .update({ is_dismissed: true })
        .eq('id', reminderId);

      if (error) throw error;

      setReminders(prev => prev.filter(r => r.id !== reminderId));
      
      toast({
        title: t('common.success'),
        description: 'Připomínka byla skryta',
      });
    } catch (error) {
      console.error('Error dismissing reminder:', error);
      toast({
        title: t('common.error'),
        description: 'Chyba při skrývání připomínky',
        variant: 'destructive'
      });
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'expiry':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'renewal':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'submission':
        return <Calendar className="h-4 w-4 text-green-600" />;
      case 'review':
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getReminderMessage = (reminder: Reminder) => {
    const docTitle = reminder.document.title;
    const daysUntil = Math.ceil(
      (new Date(reminder.reminder_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (reminder.reminder_type) {
      case 'expiry':
        return `Dokument "${docTitle}" vyprší za ${daysUntil} dní`;
      case 'renewal':
        return `Je čas obnovit dokument "${docTitle}"`;
      case 'submission':
        return `Deadline pro odeslání "${docTitle}" za ${daysUntil} dní`;
      case 'review':
        return `Dokument "${docTitle}" je třeba zkontrolovat`;
      default:
        return `Připomínka pro dokument "${docTitle}"`;
    }
  };

  const getReminderColor = (reminder: Reminder) => {
    const daysUntil = Math.ceil(
      (new Date(reminder.reminder_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil <= 0) return 'border-red-500 bg-red-50';
    if (daysUntil <= 7) return 'border-orange-500 bg-orange-50';
    if (daysUntil <= 30) return 'border-yellow-500 bg-yellow-50';
    return 'border-blue-500 bg-blue-50';
  };

  const getDocumentTypeLabel = (type: string) => {
    return t(`documents.categories.${type}`);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Připomínky dokumentů
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Připomínky dokumentů
          {reminders.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {reminders.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {reminders.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-medium mb-2">Žádné aktivní připomínky</h3>
            <p className="text-sm text-muted-foreground">
              Všechny vaše dokumenty jsou aktuální
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {reminders.map((reminder) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg border-l-4 ${getReminderColor(reminder)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getReminderIcon(reminder.reminder_type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {getReminderMessage(reminder)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getDocumentTypeLabel(reminder.document.document_type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(reminder.reminder_date).toLocaleDateString('cs-CZ')}
                          </span>
                        </div>
                        {reminder.notes && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {reminder.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissReminder(reminder.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentReminders;