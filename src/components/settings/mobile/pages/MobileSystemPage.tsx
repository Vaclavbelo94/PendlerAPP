import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  Info, 
  HardDrive, 
  Shield, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

const MobileSystemPage = () => {
  const { t } = useTranslation('settings');
  const { unifiedUser } = useAuth();

  const handleSyncNow = async () => {
    toast.loading('Synchronizace...', { id: 'sync' });
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Synchronizace dokončena', { id: 'sync' });
  };

  const handleExportData = async () => {
    if (!unifiedUser?.id) return;
    try {
      toast.loading('Exportování dat...', { id: 'export' });
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', unifiedUser.id).single();
      const { data: shifts } = await supabase.from('shifts').select('*').eq('user_id', unifiedUser.id);
      const exportData = { profile, shifts, exportDate: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `planner-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exportována', { id: 'export' });
    } catch (error) {
      toast.error('Chyba při exportu', { id: 'export' });
    }
  };

  const handleClearCache = () => {
    const keysToKeep = ['supabase.auth.token', 'app_language'];
    Object.keys(localStorage).forEach(key => {
      if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
        localStorage.removeItem(key);
      }
    });
    toast.success('Cache vymazána');
  };

  const handleFactoryReset = () => {
    if (!confirm(t('factoryResetConfirmation'))) return;
    localStorage.clear();
    toast.success('Tovární nastavení obnoveno');
    setTimeout(() => { supabase.auth.signOut(); window.location.reload(); }, 1500);
  };

  const systemActions = [
    { id: 'sync', label: t('syncNow'), description: t('syncNowDesc'), icon: RefreshCw, action: handleSyncNow },
    { id: 'export', label: t('exportData'), description: t('exportDataDesc'), icon: Download, action: handleExportData },
    { id: 'import', label: t('importData'), description: t('importDataDesc'), icon: Upload, action: () => toast.info('Import dat bude brzy k dispozici') },
    { id: 'cache', label: t('clearCache'), description: t('clearCacheDesc'), icon: Trash2, action: handleClearCache }
  ];

  const infoItems = [
    { id: 'storage', label: t('storage'), description: t('storageDesc'), icon: HardDrive },
    { id: 'privacy', label: t('privacyPolicy'), description: t('privacyPolicyDesc'), icon: Shield },
    { id: 'about', label: t('about'), description: t('aboutDesc'), icon: Info }
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
            <action.icon className="h-5 w-5 text-muted-foreground mr-3" />
            <div className="text-left flex-1">
              <div className="font-medium">{action.label}</div>
              <div className="text-sm text-muted-foreground">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>

      {/* App Info */}
      <div className="bg-card border rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">{t('appInfo')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{t('version')}</span>
            <Badge variant="secondary">1.0.0</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{t('lastSync')}</span>
            <span className="text-sm">{t('now')}</span>
          </div>
        </div>
      </div>

      {/* Info Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Informace</h3>
        {infoItems.map((item) => (
          <Button key={item.id} variant="ghost" size="lg" onClick={() => toast.info('Bude brzy k dispozici')} className="w-full justify-start h-auto py-3 px-4">
            <item.icon className="h-5 w-5 text-muted-foreground mr-3" />
            <div className="text-left flex-1">
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-muted-foreground">{item.description}</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h4 className="font-medium text-destructive">{t('dangerZone')}</h4>
        </div>
        <Button variant="outline" className="w-full justify-start border-destructive/20 text-destructive hover:bg-destructive/10" onClick={handleFactoryReset}>
          <FileText className="h-4 w-4 mr-2" />
          {t('factoryReset')}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">{t('factoryResetDesc')}</p>
      </div>
    </div>
  );
};

export default MobileSystemPage;