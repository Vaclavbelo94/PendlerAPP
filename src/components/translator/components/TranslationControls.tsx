
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Languages } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TranslationControlsProps {
  autoTranslate: boolean;
  setAutoTranslate: (auto: boolean) => void;
  isTranslating: boolean;
  onTranslate: () => void;
  onSwapLanguages: () => void;
  showSwapButton?: boolean;
}

const TranslationControls: React.FC<TranslationControlsProps> = ({
  autoTranslate,
  setAutoTranslate,
  isTranslating,
  onTranslate,
  onSwapLanguages,
  showSwapButton = true
}) => {
  return (
    <>
      {showSwapButton && (
        <div className="md:hidden flex justify-center my-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={onSwapLanguages}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <Separator />
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-translate"
            checked={autoTranslate}
            onCheckedChange={setAutoTranslate}
          />
          <Label htmlFor="auto-translate">Automatický překlad</Label>
        </div>
        
        <Button 
          onClick={onTranslate} 
          disabled={isTranslating}
          className="w-full sm:w-auto"
        >
          {isTranslating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
              Překládám...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-4 w-4" />
              Přeložit
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default TranslationControls;
