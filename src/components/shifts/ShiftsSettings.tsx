
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Calendar, Clock } from 'lucide-react';

const ShiftsSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nastavení směn</CardTitle>
          <CardDescription>
            Konfigurace notifikací a preferencí pro správu směn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifikace směn</Label>
                <p className="text-sm text-muted-foreground">
                  Zasílat připomínky o nadcházejících směnách
                </p>
              </div>
              <Switch id="notifications" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-reports">E-mailové reporty</Label>
                <p className="text-sm text-muted-foreground">
                  Měsíční přehledy směn e-mailem
                </p>
              </div>
              <Switch id="email-reports" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="calendar-sync">Synchronizace kalendáře</Label>
                <p className="text-sm text-muted-foreground">
                  Exportovat směny do externího kalendáře
                </p>
              </div>
              <Switch id="calendar-sync" />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Pokročilá nastavení</h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Nastavit výchozí časy směn
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Spravovat typy směn
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Konfigurace připomínek
              </Button>
            </div>
          </div>

          <div className="text-center py-4 text-muted-foreground">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Pokročilá nastavení budou k dispozici brzy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftsSettings;
