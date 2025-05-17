
import { PremiumFeature } from "../types";
import { toast } from "sonner";

export const getDefaultFeatures = (): PremiumFeature[] => {
  return [
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
    },
    {
      id: "6",
      name: "Plánování cest",
      description: "Optimalizace dojíždění a plánování cest",
      isEnabled: true,
      key: "travel-planning"
    },
    {
      id: "7",
      name: "Právní asistent",
      description: "Průvodce právními dokumenty a poradenství",
      isEnabled: true,
      key: "legal-assistant"
    },
    {
      id: "8",
      name: "Daňový poradce",
      description: "Interaktivní průvodce daňovým přiznáním a daňová optimalizace",
      isEnabled: true,
      key: "tax-advisor"
    }
  ];
};

export const loadFeaturesFromStorage = (): PremiumFeature[] => {
  try {
    const storedFeatures = JSON.parse(localStorage.getItem("premiumFeatures") || "[]");
    
    // If no features stored, return default features
    if (!storedFeatures || storedFeatures.length === 0) {
      const defaultFeatures = getDefaultFeatures();
      localStorage.setItem("premiumFeatures", JSON.stringify(defaultFeatures));
      return defaultFeatures;
    }
    
    // Check for updates needed to the stored features
    const updatedFeatures = updateStoredFeatures(storedFeatures);
    return updatedFeatures;
  } catch (error) {
    console.error("Chyba při načítání prémiových funkcí:", error);
    toast.error("Nepodařilo se načíst prémiové funkce");
    return [];
  }
};

export const updateStoredFeatures = (storedFeatures: PremiumFeature[]): PremiumFeature[] => {
  // Fix any legal_assistant keys to legal-assistant
  const updatedFeatures = storedFeatures.map((feature: PremiumFeature) => {
    if (feature.key === "legal_assistant") {
      return { ...feature, key: "legal-assistant" };
    }
    return feature;
  });
  
  // Check if we need to add the tax-advisor feature
  const hasTaxAdvisor = updatedFeatures.some((f: PremiumFeature) => f.key === "tax-advisor");
  
  if (!hasTaxAdvisor) {
    updatedFeatures.push({
      id: String(updatedFeatures.length + 1),
      name: "Daňový poradce",
      description: "Interaktivní průvodce daňovým přiznáním a daňová optimalizace",
      isEnabled: true,
      key: "tax-advisor"
    });
  }
  
  // Update localStorage with any changes
  localStorage.setItem("premiumFeatures", JSON.stringify(updatedFeatures));
  
  return updatedFeatures;
};

export const saveFeaturesToStorage = (features: PremiumFeature[]): void => {
  localStorage.setItem("premiumFeatures", JSON.stringify(features));
};

export const toggleFeatureStatus = (
  features: PremiumFeature[], 
  featureId: string
): PremiumFeature[] => {
  const updatedFeatures = features.map(feature => {
    if (feature.id === featureId) {
      return { ...feature, isEnabled: !feature.isEnabled };
    }
    return feature;
  });
  
  saveFeaturesToStorage(updatedFeatures);
  
  const feature = updatedFeatures.find(f => f.id === featureId);
  if (feature) {
    toast.success(`Funkce "${feature.name}" je nyní ${feature.isEnabled ? 'prémiová' : 'dostupná všem uživatelům'}`);
  }
  
  return updatedFeatures;
};

export const resetToDefaultFeatures = (): PremiumFeature[] => {
  const defaultFeatures = getDefaultFeatures();
  saveFeaturesToStorage(defaultFeatures);
  toast.success("Nastavení prémiových funkcí bylo obnoveno na výchozí hodnoty");
  return defaultFeatures;
};
