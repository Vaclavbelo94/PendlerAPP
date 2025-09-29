import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Info, 
  Shield,
  HardDrive,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const MobileSystemPage = () => {
  const { t } = useTranslation('settings');

  const systemActions = [
    {
      id: 'sync',
      label: t('syncNow'),
      description: t('syncDesc'),
      icon: RefreshCw,
      action: () => toast.success(t('syncCompleted'))
    },
    {
      id: 'export',
      label: t('exportData'),
      description: t('exportDataDesc'),
      icon: Download,
      action: () => toast.info(t('dataExportNotImplemented'))
    },
    {
      id: 'import',
      label: t('importData'),
      description: t('importDataDesc'),
      icon: Upload,
      action: () => toast.info(t('dataImportNotImplemented'))
    },
    {
      id: 'clear-cache',
      label: t('clearCache'),
      description: t('clearCacheDesc'),
      icon: Trash2,
      action: () => toast.success(t('cacheCleared'))
    }
  ];

  const infoItems = [
    {
      id: 'storage',
      label: t('storage'),
      description: t('storageDesc'),
      icon: HardDrive,
      action: () => console.log('Storage details')
    },
    {
      id: 'privacy',
      label: t('privacyPolicy'),
      description: t('privacyPolicyDesc'),
      icon: Shield,
      action: () => console.log('Privacy policy')
    },
    {
      id: 'about',
      label: t('about'),
      description: t('aboutDesc'),
      icon: Info,
      action: () => console.log('About app')
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* System Actions */}
      <div className="space-y-2">
        {systemActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="lg"
            onClick={action.action}
            className="w-full justify-between h-auto py-3 px-4"
          >
            <div className="flex items-center gap-3">
              <action.icon className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">{action.label}</div>
                <div className="text-sm text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        ))}
      </div>

      <Separator />

      {/* App Info */}
      <div className="bg-card border rounded-lg p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          {t('appInfo')}
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">{t('version')}</span>
            <Badge variant="secondary">v1.0.0</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">{t('lastSync')}</span>
            <span className="text-sm text-muted-foreground">{t('now')}</span>
          </div>
        </div>
      </div>

      {/* Info Actions */}
      <div className="space-y-2">
        {infoItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="lg"
            onClick={item.action}
            className="w-full justify-between h-auto py-3 px-4"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
        <h4 className="font-medium text-destructive mb-2">{t('dangerZone')}</h4>
        <Button
          variant="outline"
          className="w-full justify-start border-destructive/20 text-destructive hover:bg-destructive/10"
          onClick={() => toast.error(t('factoryResetConfirmation'))}
        >
          <Database className="h-4 w-4 mr-2" />
          {t('factoryReset')}
        </Button>
      </div>
    </div>
  );
};

export default MobileSystemPage;