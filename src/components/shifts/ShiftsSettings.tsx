
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Clock, Calendar } from 'lucide-react';

const ShiftsSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Nastavení směn
          </CardTitle>
          <CardDescription>
            Upravte si nastavení pro správu směn podle svých potřeb
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Upozornění na směny
                </Label>
                <p className="text-sm text-muted-foreground">
                  Dostávejte upozornění před začátkem směny
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Automatické směny
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automaticky vytvářet opakující se směny
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Synchronizace s kalendářem
                </Label>
                <p className="text-sm text-muted-foreground">
                  Synchronizovat směny s externím kalendářem
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Výchozí nastavení směn</CardTitle>
          <CardDescription>
            Nastavte výchozí hodnoty pro nové směny
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tato funkce bude dostupná v budoucí verzi aplikace.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftsSettings;
