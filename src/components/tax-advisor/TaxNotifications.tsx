
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Calendar, FileText, AlertTriangle, Info } from 'lucide-react';

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

  useEffect(() => {
    // Simulace načtení připomínek - v reálné aplikaci by se načítaly z API
    const currentYear = new Date().getFullYear();
    const mockReminders: TaxReminder[] = [
      {
        id: '1',
        title: 'Daňové přiznání za rok ' + (currentYear - 1),
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
      }
    ];
    
    setReminders(mockReminders);
  }, []);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Daňové připomínky
        </CardTitle>
        <CardDescription>
          Důležité termíny a upozornění pro daňové záležitosti
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Žádné aktivní připomínky
              </AlertDescription>
            </Alert>
          ) : (
            reminders.map((reminder) => (
              <Alert key={reminder.id} className="border-l-4">
                <div className="flex items-start gap-3">
                  {getIconForType(reminder.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium">{reminder.title}</h4>
                      <Badge variant={getVariantForPriority(reminder.priority)}>
                        {reminder.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {reminder.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Termín: {new Date(reminder.date).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                </div>
              </Alert>
            ))
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Zobrazit všechny připomínky
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxNotifications;
