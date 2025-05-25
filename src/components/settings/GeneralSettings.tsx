
import React, { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSyncSettings } from "@/hooks/useSyncSettings";
import BasicSettingsCard from './general/BasicSettingsCard';
import SyncSettingsCard from './general/SyncSettingsCard';
import SettingsActions from './general/SettingsActions';

const GeneralSettings = () => {
  const { settings: syncSettings, updateSettings: updateSyncSettings, loading: syncLoading } = useSyncSettings();
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [defaultView, setDefaultView] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load general settings from localStorage on mount
    const savedGeneralSettings = localStorage.getItem('generalSettings');
    if (savedGeneralSettings) {
      try {
        const parsed = JSON.parse(savedGeneralSettings);
        setAutoSave(parsed.autoSave ?? true);
        setCompactMode(parsed.compactMode ?? false);
        setAutoRefresh(parsed.autoRefresh ?? true);
        setDefaultView(parsed.defaultView ?? "dashboard");
      } catch (error) {
        console.error('Error loading general settings:', error);
      }
    }
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const generalSettings = {
        autoSave,
        compactMode,
        autoRefresh,
        defaultView
      };
      
      localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
      toast.success("Obecná nastavení byla uložena");
    } catch (error) {
      console.error('Error saving general settings:', error);
      toast.error("Chyba při ukládání nastavení");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    setAutoSave(true);
    setCompactMode(false);
    setAutoRefresh(true);
    setDefaultView("dashboard");
    localStorage.removeItem('generalSettings');
    toast.success("Nastavení byla resetována na výchozí hodnoty");
  };

  const formatLastSyncTime = (lastSyncTime?: string) => {
    if (!lastSyncTime) return 'Nikdy';
    try {
      return new Date(lastSyncTime).toLocaleString('cs-CZ');
    } catch (error) {
      return 'Neznámý';
    }
  };

  return (
    <div className="space-y-6">
      <BasicSettingsCard
        autoSave={autoSave}
        setAutoSave={setAutoSave}
        compactMode={compactMode}
        setCompactMode={setCompactMode}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        defaultView={defaultView}
        setDefaultView={setDefaultView}
      />

      <Separator />

      <SyncSettingsCard
        syncSettings={syncSettings}
        updateSyncSettings={updateSyncSettings}
        syncLoading={syncLoading}
        formatLastSyncTime={formatLastSyncTime}
      />

      <SettingsActions
        onSave={handleSaveSettings}
        onReset={handleResetSettings}
        loading={loading}
      />
    </div>
  );
};

export default GeneralSettings;
