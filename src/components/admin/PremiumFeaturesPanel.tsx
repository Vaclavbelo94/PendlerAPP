
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FeaturesTable } from "./components/FeaturesTable";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { PremiumFeature } from "./types";
import { 
  loadFeaturesFromStorage, 
  toggleFeatureStatus, 
  resetToDefaultFeatures 
} from "./services/featureService";
import { useTranslation } from "react-i18next";

export const PremiumFeaturesPanel = () => {
  const { t } = useTranslation('admin-premium');
  const [features, setFeatures] = useState<PremiumFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeFeatures = () => {
      setIsLoading(true);
      const loadedFeatures = loadFeaturesFromStorage();
      setFeatures(loadedFeatures);
      setIsLoading(false);
    };

    initializeFeatures();
  }, []);

  const handleToggleFeature = (featureId: string) => {
    const updatedFeatures = toggleFeatureStatus(features, featureId);
    setFeatures(updatedFeatures);
  };

  const handleResetToDefaults = () => {
    const defaultFeatures = resetToDefaultFeatures();
    setFeatures(defaultFeatures);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('title')}</h3>
        <Button variant="outline" onClick={handleResetToDefaults}>
          {t('resetButton')}
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FeaturesTable 
          features={features} 
          onToggleFeature={handleToggleFeature} 
        />
      )}
    </div>
  );
};
