import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useCompanyModulesAdmin } from '@/hooks/useCompanyModulesAdmin';
import { Loader2 } from 'lucide-react';

interface ModuleToggleSwitchProps {
  id: string;
  isEnabled: boolean;
  type: 'module' | 'widget';
}

export const ModuleToggleSwitch: React.FC<ModuleToggleSwitchProps> = ({
  id,
  isEnabled,
  type
}) => {
  const {
    toggleModule,
    toggleWidget,
    isTogglingModule,
    isTogglingWidget
  } = useCompanyModulesAdmin();

  const isLoading = type === 'module' ? isTogglingModule : isTogglingWidget;

  const handleToggle = (checked: boolean) => {
    if (type === 'module') {
      toggleModule({ id, isEnabled: checked });
    } else {
      toggleWidget({ id, isEnabled: checked });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-11 h-6">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <Switch
      checked={isEnabled}
      onCheckedChange={handleToggle}
      aria-label={`${isEnabled ? 'Zakázat' : 'Povolit'} ${type === 'module' ? 'modul' : 'widget'}`}
    />
  );
};