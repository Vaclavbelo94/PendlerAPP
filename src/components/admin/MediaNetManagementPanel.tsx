import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye, MousePointer, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface MediaNetSettings {
  enabled: boolean;
  siteId: string;
  adSlots: {
    desktop: string;
    mobile: string;
    sidebar: string;
  };
  testMode: boolean;
}

export const MediaNetManagementPanel: React.FC = () => {
  const [settings, setSettings] = useState<MediaNetSettings>({
    enabled: true,
    siteId: 'YOUR_MEDIA_NET_SITE_ID',
    adSlots: {
      desktop: '123456789',
      mobile: '987654321',
      sidebar: '111222333'
    },
    testMode: false
  });

  const [adStats, setAdStats] = useState({
    totalViews: 0,
    totalClicks: 0,
    ctr: 0,
    estimatedRevenue: 0
  });

  useEffect(() => {
    loadSettings();
    loadAdStats();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('medianet_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading Media.net settings:', error);
    }
  };

  const loadAdStats = () => {
    // Mock data - v reálné aplikaci by se načítalo z Media.net API
    setAdStats({
      totalViews: 1234,
      totalClicks: 18,
      ctr: 1.46,
      estimatedRevenue: 8.92
    });
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('medianet_settings', JSON.stringify(settings));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('mediaNetSettingsChanged', { 
        detail: settings 
      }));
      
      toast.success('Media.net nastavení bylo uloženo');
    } catch (error) {
      console.error('Error saving Media.net settings:', error);
      toast.error('Nepodařilo se uložit nastavení');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Media.net Management</h1>
        <p className="text-muted-foreground">Správa Media.net reklam a nastavení</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Zobrazení
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adStats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Celkem za měsíc</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Kliky
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adStats.totalClicks}</div>
            <p className="text-xs text-muted-foreground">Celkem za měsíc</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adStats.ctr}%</div>
            <p className="text-xs text-muted-foreground">Click-through rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Příjmy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${adStats.estimatedRevenue}</div>
            <p className="text-xs text-muted-foreground">Odhad za měsíc</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Media.net nastavení
          </CardTitle>
          <CardDescription>
            Konfigurace Media.net integrace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="medianet-enabled">Povolit Media.net reklamy</Label>
              <p className="text-sm text-muted-foreground">
                Globální zapnutí/vypnutí Media.net reklam
              </p>
            </div>
            <Switch
              id="medianet-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-id">Site ID</Label>
            <Input
              id="site-id"
              value={settings.siteId}
              onChange={(e) => 
                setSettings(prev => ({ ...prev, siteId: e.target.value }))
              }
              placeholder="YOUR_MEDIA_NET_SITE_ID"
            />
            <p className="text-xs text-muted-foreground">
              Vaše Media.net Site ID
            </p>
          </div>

          <div className="space-y-4">
            <Label>Ad Slot IDs</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="desktop-slot">Desktop Banner</Label>
                <Input
                  id="desktop-slot"
                  value={settings.adSlots.desktop}
                  onChange={(e) => 
                    setSettings(prev => ({
                      ...prev,
                      adSlots: { ...prev.adSlots, desktop: e.target.value }
                    }))
                  }
                  placeholder="123456789"
                />
              </div>

              <div>
                <Label htmlFor="mobile-slot">Mobile Banner</Label>
                <Input
                  id="mobile-slot"
                  value={settings.adSlots.mobile}
                  onChange={(e) => 
                    setSettings(prev => ({
                      ...prev,
                      adSlots: { ...prev.adSlots, mobile: e.target.value }
                    }))
                  }
                  placeholder="987654321"
                />
              </div>

              <div>
                <Label htmlFor="sidebar-slot">Sidebar</Label>
                <Input
                  id="sidebar-slot"
                  value={settings.adSlots.sidebar}
                  onChange={(e) => 
                    setSettings(prev => ({
                      ...prev,
                      adSlots: { ...prev.adSlots, sidebar: e.target.value }
                    }))
                  }
                  placeholder="111222333"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="test-mode">Test Mode</Label>
              <p className="text-sm text-muted-foreground">
                Zobrazovat testovací reklamy místo skutečných
              </p>
            </div>
            <Switch
              id="test-mode"
              checked={settings.testMode}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, testMode: checked }))
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={loadSettings}>
              Obnovit
            </Button>
            <Button onClick={saveSettings}>
              Uložit nastavení
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status integrace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Media.net Script</span>
              <Badge variant="default">Načten</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Site ID</span>
              <Badge variant={settings.siteId !== 'YOUR_MEDIA_NET_SITE_ID' ? 'default' : 'secondary'}>
                {settings.siteId !== 'YOUR_MEDIA_NET_SITE_ID' ? 'Platný' : 'Nastavit'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Test Mode</span>
              <Badge variant={settings.testMode ? 'secondary' : 'default'}>
                {settings.testMode ? 'Aktivní' : 'Neaktivní'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};