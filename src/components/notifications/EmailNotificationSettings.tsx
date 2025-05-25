
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from 'lucide-react';
import { toast } from "sonner";

export const EmailNotificationSettings = () => {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');

  const handleSave = () => {
    toast.success("E-mailová nastavení byla uložena");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          E-mailová oznámení
        </CardTitle>
        <CardDescription>
          Nastavení e-mailových notifikací a jejich frekvence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">E-mailová oznámení</Label>
            <p className="text-sm text-muted-foreground">
              Povolit zasílání oznámení e-mailem
            </p>
          </div>
          <Switch
            id="emailNotifications"
            checked={emailEnabled}
            onCheckedChange={setEmailEnabled}
          />
        </div>

        {emailEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="emailAddress">E-mailová adresa</Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="vas@email.cz"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="shiftReminders">Připomenutí směn</Label>
                <p className="text-sm text-muted-foreground">
                  Dostávat e-maily před začátkem směny
                </p>
              </div>
              <Switch
                id="shiftReminders"
                checked={shiftReminders}
                onCheckedChange={setShiftReminders}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weeklyReports">Týdenní přehledy</Label>
                <p className="text-sm text-muted-foreground">
                  Dostávat týdenní souhrn směn a statistik
                </p>
              </div>
              <Switch
                id="weeklyReports"
                checked={weeklyReports}
                onCheckedChange={setWeeklyReports}
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Uložit e-mailová nastavení
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
