
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OptimizationPreferenceProps {
  preference: string;
  onPreferenceChange: (value: string) => void;
}

const OptimizationPreference = ({ preference, onPreferenceChange }: OptimizationPreferenceProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="preference">Preferovat</Label>
      <Select 
        value={preference} 
        onValueChange={onPreferenceChange}
      >
        <SelectTrigger id="preference">
          <SelectValue placeholder="Vyberte preferenci" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="time">Nejrychlejší trasa</SelectItem>
          <SelectItem value="cost">Nejlevnější trasa</SelectItem>
          <SelectItem value="eco">Ekologická trasa</SelectItem>
          <SelectItem value="balance">Vyvážená optimalizace</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OptimizationPreference;
