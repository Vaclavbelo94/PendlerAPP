
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface OfflineDownloadCardProps {
  activeTab: string;
  offlineStatus: {
    grammarSaved: boolean;
    vocabularySaved: boolean;
    phrasesSaved: boolean;
  };
  saveForOffline: (type: 'grammar' | 'vocabulary' | 'phrases') => void;
}

const OfflineDownloadCard: React.FC<OfflineDownloadCardProps> = ({ 
  activeTab, 
  offlineStatus, 
  saveForOffline 
}) => {
  return (
    <Card className="bg-muted/30 border-dashed">
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <div>
            <div className="font-medium">Offline dostupnost</div>
            <p className="text-sm text-muted-foreground">
              Stáhněte si materiály pro použití bez připojení k internetu
            </p>
          </div>
        </div>
        <Button
          onClick={() => saveForOffline(
            activeTab === 'grammar' ? 'grammar' : 
            activeTab === 'vocabulary' ? 'vocabulary' : 
            activeTab === 'phrases' ? 'phrases' : 'grammar'
          )}
          disabled={
            (activeTab === 'grammar' && offlineStatus.grammarSaved) ||
            (activeTab === 'vocabulary' && offlineStatus.vocabularySaved) ||
            (activeTab === 'phrases' && offlineStatus.phrasesSaved) ||
            activeTab === 'interactive' || 
            activeTab === 'gamification'
          }
          variant="outline"
          className="h-8"
        >
          <Download className="h-4 w-4 mr-2" />
          {(activeTab === 'grammar' && offlineStatus.grammarSaved) ||
           (activeTab === 'vocabulary' && offlineStatus.vocabularySaved) ||
           (activeTab === 'phrases' && offlineStatus.phrasesSaved) 
            ? "Staženo" 
            : "Stáhnout pro offline"
          }
        </Button>
      </CardContent>
    </Card>
  );
};

export default OfflineDownloadCard;
