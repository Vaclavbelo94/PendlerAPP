
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Calendar, FileText, AlertTriangle, Info } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface TaxReminder {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'deadline' | 'info' | 'warning';
  priority: 'high' | 'medium' | 'low';
}

const TaxNotifications = () => {
  const [reminders, setReminders] = useState<TaxReminder[]>([]);
  const [showAllReminders, setShowAllReminders] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Simulace načtení připomínek - v reálné aplikaci by se načítaly z API
    const currentYear = new Date().getFullYear();
    const mockReminders: TaxReminder[] = [
      {
        id: '1',
        title: t('taxReturn') + ' za rok ' + (currentYear - 1),
        description: 'Termín pro podání daňového přiznání se blíží',
        date: `${currentYear}-07-31`,
        type: 'deadline',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Změny v daňových sazbách',
        description: 'Od ledna ' + currentYear + ' platí nové daňové sazby',
        date: `${currentYear}-01-01`,
        type: 'info',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Pendlerpauschale',
        description: 'Nezapomeňte si uplatnit náklady na dojíždění',
        date: `${currentYear}-12-31`,
        type: 'warning',
        priority: 'medium'
      },
      {
        id: '4',
        title: 'Freistellungsauftrag',
        description: 'Zkontrolujte své příkazy k osvobození od daně',
        date: `${currentYear}-11-30`,
        type: 'info',
        priority: 'low'
      },
      {
        id: '5',
        title: 'Sonderausgaben',
        description: 'Připravte si doklady o zvláštních výdajích',
        date: `${currentYear}-06-30`,
        type: 'warning',
        priority: 'low'
      }
    ];
    
    setReminders(mockReminders);
  }, [t]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Calendar className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariantForPriority = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return t('highPriority');
      case 'medium':
        return t('mediumPriority');
      case 'low':
        return t('lowPriority');
      default:
        return priority;
    }
  };

  const displayedReminders = showAllReminders ? reminders : reminders.slice(0, 3);

  const handleShowAllReminders = () => {
    setShowAllReminders(!showAllReminders);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t('taxNotificationsTitle')}
        </CardTitle>
        <CardDescription>
          {t('taxNotificationsSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedReminders.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t('noActiveReminders')}
              </AlertDescription>
            </Alert>
          ) : (
            displayedReminders.map((reminder) => (
              <Alert key={reminder.id} className="border-l-4">
                <div className="flex items-start gap-3">
                  {getIconForType(reminder.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium">{reminder.title}</h4>
                      <Badge variant={getVariantForPriority(reminder.priority)}>
                        {getPriorityLabel(reminder.priority)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {reminder.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('deadline')}: {new Date(reminder.date).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                </div>
              </Alert>
            ))
          )}
        </div>
        
        {reminders.length > 3 && (
          <div className="mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleShowAllReminders}
            >
              <FileText className="h-4 w-4 mr-2" />
              {showAllReminders ? t('showLessReminders') : t('showAllReminders')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxNotifications;
