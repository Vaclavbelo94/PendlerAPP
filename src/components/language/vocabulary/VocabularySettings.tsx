
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Save, Crown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { usePremiumCheck } from '@/hooks/usePremiumCheck';
import PremiumFeatureAlert from '@/components/PremiumFeatureAlert';

interface VocabularySettingsProps {
  dailyGoal: number;
  onSaveSettings: (goal: number) => void;
}

const VocabularySettings: React.FC<VocabularySettingsProps> = ({ dailyGoal, onSaveSettings }) => {
  const [open, setOpen] = useState(false);
  const [newDailyGoal, setNewDailyGoal] = useState(dailyGoal);
  const [useSpacedRepetition, setUseSpacedRepetition] = useState(true);
  
  // Check if user has access to spaced repetition premium feature
  const { isLoading, canAccess, isPremiumFeature } = usePremiumCheck("language");

  // Update state when dailyGoal prop changes
  useEffect(() => {
    setNewDailyGoal(dailyGoal);
  }, [dailyGoal]);

  const handleSave = () => {
    onSaveSettings(newDailyGoal);
    setOpen(false);
  };

  // Render content based on premium status
  const renderSpacedRepetitionSetting = () => {
    if (isLoading) {
      return <div className="py-1">Načítání...</div>;
    }

    if (isPremiumFeature && !canAccess) {
      return (
        <div className="border border-amber-200 rounded-md p-3 bg-amber-50">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="font-medium text-amber-700">Prémiová funkce</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Pokročilé nastavení opakování je dostupné pouze pro Premium uživatele.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300"
            onClick={() => window.location.href = "/premium"}
          >
            <Crown className="mr-2 h-3 w-3" />
            Aktivovat Premium
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="spacedRepetition">Používat inteligentní opakování</Label>
            <p className="text-sm text-muted-foreground">
              Automaticky upraví frekvenci opakování podle vašeho výkonu
            </p>
          </div>
          <Switch
            id="spacedRepetition"
            checked={useSpacedRepetition}
            onCheckedChange={setUseSpacedRepetition}
          />
        </div>
        {useSpacedRepetition && (
          <div className="pl-4 border-l-2 border-muted mt-2">
            <p className="text-sm text-muted-foreground mb-2">
              Algoritmus určí optimální čas pro opakování každého slovíčka na základě vašeho výkonu.
            </p>
          </div>
        )}
      </div>
    );
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
          
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-base">Pokročilé nastavení</Label>
            {renderSpacedRepetitionSetting()}
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
