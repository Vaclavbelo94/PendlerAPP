
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye, MousePointer, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface AdSenseSettings {
  enabled: boolean;
  publisherId: string;
  bannerAdSlots: {
    desktop: string;
    mobile: string;
    sidebar: string;
  };
  testMode: boolean;
}

export const AdSenseManagementPanel: React.FC = () => {
  const [settings, setSettings] = useState<AdSenseSettings>({
    enabled: true,
    publisherId: 'ca-pub-YOUR_PUBLISHER_ID',
    bannerAdSlots: {
      desktop: '0987654321',
      mobile: '1234567890',
      sidebar: '1122334455'
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
      const savedSettings = localStorage.getItem('adsense_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading AdSense settings:', error);
    }
  };

  const loadAdStats = () => {
    // Mock data - v reálné aplikaci by se načítalo z AdSense API
    setAdStats({
      totalViews: 1542,
      totalClicks: 23,
      ctr: 1.49,
      estimatedRevenue: 12.45
    });
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('adsense_settings', JSON.stringify(settings));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('adSenseSettingsChanged', { 
        detail: settings 
      }));
      
      toast.success('AdSense nastavení bylo uloženo');
    } catch (error) {
      console.error('Error saving AdSense settings:', error);
      toast.error('Nepodařilo se uložit nastavení');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AdSense Management</h1>
        <p className="text-muted-foreground">Správa Google AdSense reklam a nastavení</p>
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
            AdSense nastavení
          </CardTitle>
          <CardDescription>
            Konfigurace Google AdSense integrace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="adsense-enabled">Povolit AdSense reklamy</Label>
              <p className="text-sm text-muted-foreground">
                Globální zapnutí/vypnutí AdSense reklam
              </p>
            </div>
            <Switch
              id="adsense-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publisher-id">Publisher ID</Label>
            <Input
              id="publisher-id"
              value={settings.publisherId}
              onChange={(e) => 
                setSettings(prev => ({ ...prev, publisherId: e.target.value }))
              }
              placeholder="ca-pub-1234567890123456"
            />
            <p className="text-xs text-muted-foreground">
              Vaše Google AdSense Publisher ID
            </p>
          </div>

          <div className="space-y-4">
            <Label>Ad Slot IDs</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="desktop-slot">Desktop Banner</Label>
                <Input
                  id="desktop-slot"
                  value={settings.bannerAdSlots.desktop}
                  onChange={(e) => 
                    setSettings(prev => ({
                      ...prev,
                      bannerAdSlots: { ...prev.bannerAdSlots, desktop: e.target.value }
                    }))
                  }
                  placeholder="1234567890"
                />
              </div>

              <div>
                <Label htmlFor="mobile-slot">Mobile Banner</Label>
                <Input
                  id="mobile-slot"
                  value={settings.bannerAdSlots.mobile}
                  onChange={(e) => 
                    setSettings(prev => ({
                      ...prev,
                      bannerAdSlots: { ...prev.bannerAdSlots, mobile: e.target.value }
                    }))
                  }
                  placeholder="0987654321"
                />
              </div>

              <div>
                <Label htmlFor="sidebar-slot">Sidebar</Label>
                <Input
                  id="sidebar-slot"
                  value={settings.bannerAdSlots.sidebar}
                  onChange={(e) => 
                    setSettings(prev => ({
                      ...prev,
                      bannerAdSlots: { ...prev.bannerAdSlots, sidebar: e.target.value }
                    }))
                  }
                  placeholder="1122334455"
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
              <span>AdSense Script</span>
              <Badge variant="default">Načten</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Publisher ID</span>
              <Badge variant={settings.publisherId.startsWith('ca-pub-') ? 'default' : 'secondary'}>
                {settings.publisherId.startsWith('ca-pub-') ? 'Platný' : 'Neplatný'}
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
