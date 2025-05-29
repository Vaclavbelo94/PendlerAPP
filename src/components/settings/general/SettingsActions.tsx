
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw, Save } from 'lucide-react';

interface SettingsActionsProps {
  onSave: () => void;
  onReset: () => void;
  loading: boolean;
}

const SettingsActions: React.FC<SettingsActionsProps> = ({ onSave, onReset, loading }) => {
  return (
    <div className="flex gap-3 pt-4">
      <Button onClick={onSave} disabled={loading} className="gap-2">
        <Save className="h-4 w-4" />
        {loading ? "Ukládám..." : "Uložit nastavení"}
      </Button>
      <Button onClick={onReset} variant="outline" className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Resetovat
      </Button>
    </div>
  );
};

export default SettingsActions;
