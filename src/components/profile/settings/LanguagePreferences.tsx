
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguagePreferencesProps {
  preferredLanguage: string;
  handleInputChange: (field: string, value: string) => void;
}

const LanguagePreferences = ({
  preferredLanguage,
  handleInputChange,
}: LanguagePreferencesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Předvolby</h3>
      
      <div className="space-y-2">
        <Label htmlFor="preferredLanguage">Preferovaný jazyk</Label>
        <Select 
          value={preferredLanguage} 
          onValueChange={(value) => handleInputChange('preferredLanguage', value)}
        >
          <SelectTrigger id="preferredLanguage" className="w-full">
            <SelectValue placeholder="Vyberte jazyk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cs">Čeština</SelectItem>
            <SelectItem value="de">Němčina</SelectItem>
            <SelectItem value="en">Angličtina</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LanguagePreferences;
