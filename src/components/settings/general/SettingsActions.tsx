
import React from 'react';
import { Button } from "@/components/ui/button";

interface SettingsActionsProps {
  onSave: () => void;
  onReset: () => void;
  loading: boolean;
}

const SettingsActions = ({ onSave, onReset, loading }: SettingsActionsProps) => {
  return (
    <div className="flex gap-3">
      <Button onClick={onSave} disabled={loading}>
        {loading ? "Ukládám..." : "Uložit nastavení"}
      </Button>
      <Button variant="outline" onClick={onReset}>
        Resetovat na výchozí
      </Button>
    </div>
  );
};

export default SettingsActions;
