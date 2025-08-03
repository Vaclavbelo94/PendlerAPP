import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Mail, Calendar, Clock, Brain, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ModernAutomationSettings = () => {
  const { t } = useTranslation('settings');
  const [emailReports, setEmailReports] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState(false);
  const [intelligentScheduling, setIntelligentScheduling] = useState(true);
  const [autoTimeTracking, setAutoTimeTracking] = useState(false);
  const [smartBreaks, setSmartBreaks] = useState(true);
  const [reportDay, setReportDay] = useState('sunday');
  const [reportTime, setReportTime] = useState('18:00');

  const handleSave = () => {
    const settings = {
      emailReports,
      weeklyReports,
      monthlyReports,
      intelligentScheduling,
      autoTimeTracking,
      smartBreaks,
      reportDay,
      reportTime
    };
    
    localStorage.setItem('automationSettings', JSON.stringify(settings));
    toast.success(t('settingsSaved'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t('emailReports')}
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Pro
            </Badge>
          </CardTitle>
          <CardDescription>
            Automatické e-mailové reporty a přehledy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('weeklyReports')}</Label>
              <p className="text-sm text-muted-foreground">
                Týdenní přehled odpracovaných hodin a směn
              </p>
            </div>
            <Switch
              checked={weeklyReports}
              onCheckedChange={setWeeklyReports}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('monthlyReports')}</Label>
              <p className="text-sm text-muted-foreground">
                Měsíční souhrn a statistiky práce
              </p>
            </div>
            <Switch
              checked={monthlyReports}
              onCheckedChange={setMonthlyReports}
            />
          </div>

          {(weeklyReports || monthlyReports) && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="reportDay">Den odeslání</Label>
                <Select value={reportDay} onValueChange={setReportDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Neděle</SelectItem>
                    <SelectItem value="monday">Pondělí</SelectItem>
                    <SelectItem value="friday">Pátek</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportTime">Čas odeslání</Label>
                <Select value={reportTime} onValueChange={setReportTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
                    <SelectItem value="20:00">20:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {t('intelligentScheduling')}
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              AI
            </Badge>
          </CardTitle>
          <CardDescription>
            Inteligentní automatizace na základě vašich zvyklostí
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Chytré plánování</Label>
              <p className="text-sm text-muted-foreground">
                AI optimalizuje vaše směny na základě preferencí
              </p>
            </div>
            <Switch
              checked={intelligentScheduling}
              onCheckedChange={setIntelligentScheduling}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatické sledování času</Label>
              <p className="text-sm text-muted-foreground">
                Automaticky začínat a končit směny podle polohy
              </p>
            </div>
            <Switch
              checked={autoTimeTracking}
              onCheckedChange={setAutoTimeTracking}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Chytré přestávky</Label>
              <p className="text-sm text-muted-foreground">
                Připomínky přestávek na základě intenzity práce
              </p>
            </div>
            <Switch
              checked={smartBreaks}
              onCheckedChange={setSmartBreaks}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 dark:text-amber-100">
                Premium funkce
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Některé automatizační funkce vyžadují Premium předplatné pro plné využití.
              </p>
              <Button size="sm" className="mt-3" variant="outline">
                Upgradovat na Premium
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          {t('saveChanges')}
        </Button>
      </div>
    </div>
  );
};

export default ModernAutomationSettings;