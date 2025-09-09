import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Bell, 
  Send, 
  Users, 
  Building2, 
  UserCheck, 
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/auth';

export const NotificationsV2: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notificationType: 'info' as 'info' | 'warning' | 'success' | 'error',
    targetType: 'all' as 'all' | 'company' | 'user',
    targetCompanies: [] as string[],
    targetUserIds: [] as string[],
    language: 'cs' as 'cs' | 'de' | 'pl'
  });

  const [testUserId, setTestUserId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('Nejste přihlášeni');
      return;
    }

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Vyplňte název a zprávu');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-admin-notification', {
        body: {
          title: formData.title,
          message: formData.message,
          notificationType: formData.notificationType,
          targetType: formData.targetType,
          targetCompanies: formData.targetCompanies,
          targetUserIds: formData.targetUserIds,
          language: formData.language
        }
      });

      if (error) {
        console.error('Error sending notification:', error);
        toast.error('Chyba při odesílání notifikace: ' + error.message);
        return;
      }

      console.log('Notification sent successfully:', data);
      toast.success(`Notifikace úspěšně odeslána${data?.sent_count ? ` (${data.sent_count} příjemců)` : ''}`);
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        notificationType: 'info',
        targetType: 'all',
        targetCompanies: [],
        targetUserIds: [],
        language: 'cs'
      });
      setTestUserId('');
    } catch (error) {
      console.error('Error in notification submission:', error);
      toast.error('Chyba při odesílání notifikace');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async () => {
    if (!user?.id) {
      toast.error('Nejste přihlášeni');
      return;
    }

    const targetId = testUserId || user.id;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-admin-notification', {
        body: {
          title: 'Testovací notifikace',
          message: 'Toto je testovací notifikace pro ověření funkčnosti systému.',
          notificationType: 'info',
          targetType: 'user',
          targetUserIds: [targetId],
          language: 'cs'
        }
      });

      if (error) {
        console.error('Error sending test notification:', error);
        toast.error('Chyba při odesílání testovací notifikace: ' + error.message);
        return;
      }

      toast.success('Testovací notifikace odeslána');
    } catch (error) {
      console.error('Error in test notification:', error);
      toast.error('Chyba při odesílání testovací notifikace');
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Správa notifikací
        </h1>
        <p className="text-muted-foreground">
          Odesílání informačních notifikací uživatelům
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Test Notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Rychlý test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testUserId">ID uživatele (volitelné)</Label>
              <Input
                id="testUserId"
                placeholder="Ponechte prázdné pro test na sebe"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Pokud nevyplníte, notifikace se pošle vám
              </p>
            </div>
            <Button 
              onClick={handleTestNotification}
              disabled={isLoading}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Odeslat testovací notifikaci
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiky</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Celkem uživatelů</span>
              <Badge variant="outline">~</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Aktivní notifikace</span>
              <Badge variant="outline">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Odesláno dnes</span>
              <Badge variant="outline">0</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Nová notifikace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Název notifikace *</Label>
                <Input
                  id="title"
                  placeholder="Název notifikace"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notificationType">Typ notifikace</Label>
                <Select 
                  value={formData.notificationType}
                  onValueChange={(value: any) => setFormData({ ...formData, notificationType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        Informace
                      </div>
                    </SelectItem>
                    <SelectItem value="success">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Úspěch
                      </div>
                    </SelectItem>
                    <SelectItem value="warning">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        Upozornění
                      </div>
                    </SelectItem>
                    <SelectItem value="error">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        Chyba
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Zpráva *</Label>
              <Textarea
                id="message"
                placeholder="Text notifikace pro uživatele"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetType">Cíl notifikace</Label>
                <Select 
                  value={formData.targetType}
                  onValueChange={(value: any) => setFormData({ ...formData, targetType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Všichni uživatelé
                      </div>
                    </SelectItem>
                    <SelectItem value="company">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Podle firmy
                      </div>
                    </SelectItem>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Konkrétní uživatelé
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Jazyk</Label>
                <Select 
                  value={formData.language}
                  onValueChange={(value: any) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Čeština</SelectItem>
                    <SelectItem value="de">Němčina</SelectItem>
                    <SelectItem value="pl">Polština</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.targetType === 'company' && (
              <div className="space-y-2">
                <Label>Firmy</Label>
                <div className="text-sm text-muted-foreground">
                  Funkcionalita pro výběr firem bude dostupna brzy
                </div>
              </div>
            )}

            {formData.targetType === 'user' && (
              <div className="space-y-2">
                <Label htmlFor="userIds">ID uživatelů (oddělte čárkou)</Label>
                <Textarea
                  id="userIds"
                  placeholder="Vložte ID uživatelů oddělené čárkami"
                  onChange={(e) => {
                    const ids = e.target.value.split(',').map(id => id.trim()).filter(Boolean);
                    setFormData({ ...formData, targetUserIds: ids });
                  }}
                  rows={3}
                />
              </div>
            )}

            {/* Preview */}
            {formData.title && formData.message && (
              <div className="space-y-2">
                <Label>Náhled notifikace</Label>
                <Card className="p-4 border-dashed">
                  <div className="flex items-start gap-3">
                    {getNotificationTypeIcon(formData.notificationType)}
                    <div className="flex-1">
                      <h4 className="font-medium">{formData.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.message}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading || !formData.title.trim() || !formData.message.trim()}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Odesílám...' : 'Odeslat notifikaci'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};