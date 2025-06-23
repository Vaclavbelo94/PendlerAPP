
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SettingsActionsProps {
  onSave: () => void;
  onReset: () => void;
  loading: boolean;
}

const SettingsActions = ({ onSave, onReset, loading }: SettingsActionsProps) => {
  const { t } = useTranslation('settings');

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button 
            variant="outline" 
            onClick={onReset}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t('resetToDefaults')}
          </Button>
          <Button 
            onClick={onSave}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? t('save') : t('saveSettings')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsActions;
