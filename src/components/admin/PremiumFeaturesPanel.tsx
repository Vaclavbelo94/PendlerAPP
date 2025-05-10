
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean; // zda je funkce dostupná pouze jako premium
  key: string; // unikátní klíč pro identifikaci funkce v aplikaci
}

export const PremiumFeaturesPanel = () => {
  const [features, setFeatures] = useState<PremiumFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Načtení prémiových funkcí z localStorage
    const loadFeatures = () => {
      setIsLoading(true);
      try {
        const storedFeatures = JSON.parse(localStorage.getItem("premiumFeatures") || "[]");
        
        // Pokud nejsou žádné funkce, inicializujeme výchozí sadu
        if (!storedFeatures || storedFeatures.length === 0) {
          const defaultFeatures: PremiumFeature[] = [
            {
              id: "1",
              name: "Plánování směn",
              description: "Přidávání a správa směn v kalendáři",
              isEnabled: true,
              key: "shifts"
            },
            {
              id: "2",
              name: "Pokročilý překladač",
              description: "Překlad delších textů a dokumentů",
              isEnabled: true,
              key: "translator"
            },
            {
              id: "3",
              name: "Daňové kalkulačky",
              description: "Rozšířené kalkulačky pro výpočet daní a odvodů",
              isEnabled: true,
              key: "calculator"
            },
            {
              id: "4",
              name: "Rozšířené materiály k němčině",
              description: "Prémiové výukové materiály a cvičení",
              isEnabled: true,
              key: "language"
            },
            {
              id: "5",
              name: "Správa vozidla",
              description: "Rozšířené funkce pro správu vozidla a nákladů",
              isEnabled: true,
              key: "vehicle"
            }
          ];
          
          setFeatures(defaultFeatures);
          localStorage.setItem("premiumFeatures", JSON.stringify(defaultFeatures));
        } else {
          setFeatures(storedFeatures);
        }
      } catch (error) {
        console.error("Chyba při načítání prémiových funkcí:", error);
        toast.error("Nepodařilo se načíst prémiové funkce");
      } finally {
        setIsLoading(false);
      }
    };

    loadFeatures();
  }, []);

  const togglePremiumFeature = (featureId: string) => {
    const updatedFeatures = features.map(feature => {
      if (feature.id === featureId) {
        return { ...feature, isEnabled: !feature.isEnabled };
      }
      return feature;
    });
    
    setFeatures(updatedFeatures);
    localStorage.setItem("premiumFeatures", JSON.stringify(updatedFeatures));
    
    const feature = updatedFeatures.find(f => f.id === featureId);
    toast.success(`Funkce "${feature?.name}" je nyní ${feature?.isEnabled ? 'prémiová' : 'dostupná všem uživatelům'}`);
  };

  const resetToDefaults = () => {
    const defaultFeatures: PremiumFeature[] = [
      {
        id: "1",
        name: "Plánování směn",
        description: "Přidávání a správa směn v kalendáři",
        isEnabled: true,
        key: "shifts"
      },
      {
        id: "2",
        name: "Pokročilý překladač",
        description: "Překlad delších textů a dokumentů",
        isEnabled: true,
        key: "translator"
      },
      {
        id: "3",
        name: "Daňové kalkulačky",
        description: "Rozšířené kalkulačky pro výpočet daní a odvodů",
        isEnabled: true,
        key: "calculator"
      },
      {
        id: "4",
        name: "Rozšířené materiály k němčině",
        description: "Prémiové výukové materiály a cvičení",
        isEnabled: true,
        key: "language"
      },
      {
        id: "5",
        name: "Správa vozidla",
        description: "Rozšířené funkce pro správu vozidla a nákladů",
        isEnabled: true,
        key: "vehicle"
      }
    ];
    
    setFeatures(defaultFeatures);
    localStorage.setItem("premiumFeatures", JSON.stringify(defaultFeatures));
    toast.success("Nastavení prémiových funkcí bylo obnoveno na výchozí hodnoty");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Nastavení prémiových funkcí</h3>
        <Button variant="outline" onClick={resetToDefaults}>
          Obnovit výchozí nastavení
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Načítání funkcí...</p>
          </div>
        </div>
      ) : features.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium">Žádné funkce</h3>
          <p className="text-sm text-muted-foreground mt-2">
            V systému nejsou definovány žádné prémiové funkce.
          </p>
        </div>
      ) : (
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
                      onCheckedChange={() => togglePremiumFeature(feature.id)}
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
      )}
    </div>
  );
};

