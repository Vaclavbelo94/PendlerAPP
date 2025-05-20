
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface TranslationInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: React.ReactNode;
  placeholder: string;
  readOnly?: boolean;
  className?: string;
  onTextToSpeech: () => void;
  actions?: React.ReactNode;
}

const TranslationInput: React.FC<TranslationInputProps> = ({
  value,
  onChange,
  label,
  placeholder,
  readOnly = false,
  className = "min-h-[200px] resize-none",
  onTextToSpeech,
  actions
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={readOnly ? "targetLanguage" : "sourceLanguage"}>{label}</Label>
        {actions}
      </div>
      <Textarea
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full sm:w-auto"
        onClick={onTextToSpeech}
        disabled={!value.trim()}
      >
        <Volume2 className="mr-2 h-4 w-4" />
        Přečíst
      </Button>
    </div>
  );
};

export default TranslationInput;
