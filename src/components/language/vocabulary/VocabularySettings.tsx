
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Save } from 'lucide-react';

interface VocabularySettingsProps {
  dailyGoal: number;
  onSaveSettings: (goal: number) => void;
}

const VocabularySettings: React.FC<VocabularySettingsProps> = ({ dailyGoal, onSaveSettings }) => {
  const [open, setOpen] = useState(false);
  const [newDailyGoal, setNewDailyGoal] = useState(dailyGoal);

  // Update state when dailyGoal prop changes
  useEffect(() => {
    setNewDailyGoal(dailyGoal);
  }, [dailyGoal]);

  const handleSave = () => {
    onSaveSettings(newDailyGoal);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Nastavení
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nastavení opakování</DialogTitle>
          <DialogDescription>
            Upravte si nastavení pro opakování slovíček
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dailyGoal">Denní cíl (počet slovíček)</Label>
            <Input
              id="dailyGoal"
              type="number"
              min={1}
              max={100}
              value={newDailyGoal}
              onChange={(e) => setNewDailyGoal(Number(e.target.value))}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Uložit nastavení
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VocabularySettings;
