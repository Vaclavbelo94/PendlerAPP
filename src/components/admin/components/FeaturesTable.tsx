
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PremiumFeature } from "../types";

interface FeaturesTableProps {
  features: PremiumFeature[];
  onToggleFeature: (featureId: string) => void;
}

export const FeaturesTable = ({ features, onToggleFeature }: FeaturesTableProps) => {
  if (features.length === 0) {
    return (
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium">Žádné funkce</h3>
        <p className="text-sm text-muted-foreground mt-2">
          V systému nejsou definovány žádné prémiové funkce.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Funkce</TableHead>
          <TableHead>Popis</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Premium</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((feature) => (
          <TableRow key={feature.id}>
            <TableCell className="font-medium">{feature.name}</TableCell>
            <TableCell>{feature.description}</TableCell>
            <TableCell>{feature.isEnabled ? "Prémiová" : "Pro všechny"}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Switch
                  id={`premium-${feature.id}`}
                  checked={feature.isEnabled}
                  onCheckedChange={() => onToggleFeature(feature.id)}
                />
                <Label htmlFor={`premium-${feature.id}`}>
                  {feature.isEnabled ? "Zapnuto" : "Vypnuto"}
                </Label>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
