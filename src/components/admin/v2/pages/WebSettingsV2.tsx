import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { 
  Settings, 
  Globe, 
  Palette, 
  Bell, 
  Shield,
  Database,
  Mail,
  Upload,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export const WebSettingsV2: React.FC = () => {
  const { systemConfig, updateSystemConfig, isUpdatingConfig } = useAdminV2();
  const [localSettings, setLocalSettings] = useState({
    siteName: 'PendlerApp',
    siteDescription: 'Aplikace pro správu směn a dojíždění',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    maxFileUploadSize: '10',
    theme: 'system',
    language: 'cs'
  });

  const handleSaveSetting = async (key: string, value: any) => {
    try {
      await updateSystemConfig({
        configKey: key,
        configValue: value,
        description: `System setting: ${key}`
      });
      toast.success(`Nastavení ${key} bylo uloženo`);
    } catch (error) {
      toast.error(`Nepodařilo se uložit nastavení ${key}`);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nastavení webu</h1>
        <p className="text-muted-foreground">
          Spravujte globální nastavení aplikace
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Obecné</TabsTrigger>
          <TabsTrigger value="appearance">Vzhled</TabsTrigger>
          <TabsTrigger value="notifications">Notifikace</TabsTrigger>
          <TabsTrigger value="security">Bezpečnost</TabsTrigger>
          <TabsTrigger value="advanced">Pokročilé</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Základní informace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Název webu</Label>
                  <Input
                    id="siteName"
                    value={localSettings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Výchozí jazyk</Label>
                  <select 
                    id="language"
                    className="w-full p-2 border border-input rounded-md"
                    value={localSettings.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                  >
                    <option value="cs">Čeština</option>
                    <option value="de">Němčina</option>
                    <option value="pl">Polština</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Popis webu</Label>
                <Textarea
                  id="siteDescription"
                  value={localSettings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={() => handleSaveSetting('site_info', {
                  name: localSettings.siteName,
                  description: localSettings.siteDescription,
                  language: localSettings.language
                })}
                disabled={isUpdatingConfig}
              >
                <Save className="mr-2 h-4 w-4" />
                Uložit základní informace
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Funkce aplikace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Režim údržby</h4>
                  <p className="text-sm text-muted-foreground">
                    Dočasně zakáže přístup pro uživatele
                  </p>
                </div>
                <Switch
                  checked={localSettings.maintenanceMode}
                  onCheckedChange={(checked) => {
                    handleInputChange('maintenanceMode', checked);
                    handleSaveSetting('maintenance_mode', checked);
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Registrace nových uživatelů</h4>
                  <p className="text-sm text-muted-foreground">
                    Povolit registraci nových účtů
                  </p>
                </div>
                <Switch
                  checked={localSettings.registrationEnabled}
                  onCheckedChange={(checked) => {
                    handleInputChange('registrationEnabled', checked);
                    handleSaveSetting('registration_enabled', checked);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Vzhled a téma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Výchozí téma</Label>
                <div className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'system'].map((theme) => (
                    <Button
                      key={theme}
                      variant={localSettings.theme === theme ? "default" : "outline"}
                      onClick={() => {
                        handleInputChange('theme', theme);
                        handleSaveSetting('default_theme', theme);
                      }}
                      className="h-auto p-4"
                    >
                      <div className="text-center">
                        <div className={`w-8 h-8 rounded mx-auto mb-2 ${
                          theme === 'light' ? 'bg-white border-2' :
                          theme === 'dark' ? 'bg-black' : 'bg-gradient-to-r from-white to-black'
                        }`} />
                        <span className="text-sm capitalize">
                          {theme === 'system' ? 'Systém' : theme === 'light' ? 'Světlé' : 'Tmavé'}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Nastavení notifikací
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">E-mailové notifikace</h4>
                  <p className="text-sm text-muted-foreground">
                    Globálně povolit odesílání e-mailů
                  </p>
                </div>
                <Switch
                  checked={localSettings.emailNotifications}
                  onCheckedChange={(checked) => {
                    handleInputChange('emailNotifications', checked);
                    handleSaveSetting('email_notifications_enabled', checked);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtpServer">SMTP Server</Label>
                <Input
                  id="smtpServer"
                  placeholder="smtp.gmail.com"
                  type="email"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Port</Label>
                  <Input
                    id="smtpPort"
                    placeholder="587"
                    type="number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Uživatelské jméno</Label>
                  <Input
                    id="smtpUser"
                    placeholder="user@example.com"
                    type="email"
                  />
                </div>
              </div>
              
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Otestovat e-mailové nastavení
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Bezpečnostní nastavení
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Časový limit session (minuty)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  placeholder="60"
                  defaultValue="60"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max. pokusů o přihlášení</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  placeholder="5"
                  defaultValue="5"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Vyžadovat potvrzení e-mailu</h4>
                  <p className="text-sm text-muted-foreground">
                    Nový uživatel musí potvrdit e-mail před aktivací
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Dvou-faktorové ověření</h4>
                  <p className="text-sm text-muted-foreground">
                    Povolit 2FA pro administrátory
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Pokročilá nastavení
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxUploadSize">Max. velikost uploadu (MB)</Label>
                <Input
                  id="maxUploadSize"
                  type="number"
                  value={localSettings.maxFileUploadSize}
                  onChange={(e) => handleInputChange('maxFileUploadSize', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cacheTimeout">Cache timeout (sekundy)</Label>
                <Input
                  id="cacheTimeout"
                  type="number"
                  placeholder="3600"
                  defaultValue="3600"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Debug režim</h4>
                  <p className="text-sm text-muted-foreground">
                    Zobrazit detailní chybové hlášky
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">API rate limiting</h4>
                  <p className="text-sm text-muted-foreground">
                    Omezit počet API requestů na uživatele
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Button 
                onClick={() => handleSaveSetting('advanced_settings', {
                  maxUploadSize: localSettings.maxFileUploadSize,
                  cacheTimeout: 3600,
                  debugMode: false,
                  rateLimiting: true
                })}
                disabled={isUpdatingConfig}
              >
                <Save className="mr-2 h-4 w-4" />
                Uložit pokročilá nastavení
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};