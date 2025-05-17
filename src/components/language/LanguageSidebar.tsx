
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface LanguageSidebarProps {
  offlineStatus: {
    grammarSaved: boolean;
    vocabularySaved: boolean;
    phrasesSaved: boolean;
  };
  isOffline: boolean;
  saveForOffline: (type: 'grammar' | 'vocabulary' | 'phrases') => void;
}

const LanguageSidebar: React.FC<LanguageSidebarProps> = ({
  offlineStatus,
  isOffline,
  saveForOffline
}) => {
  return (
    <div className="w-full md:w-1/3 space-y-4">
      <Card className="overflow-hidden">
        <div className="bg-primary text-primary-foreground p-3 text-lg font-semibold">
          Studijní materiály
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <h3 className="font-medium">Doporučené učebnice</h3>
            <ul className="space-y-1 text-sm">
              <li>• Sprechen Sie Deutsch? 1</li>
              <li>• Moderní učebnice němčiny</li>
              <li>• Němčina pro samouky</li>
            </ul>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Online zdroje</h3>
            <ul className="space-y-1 text-sm">
              <li>• Duolingo</li>
              <li>• Deutsche Welle - Learn German</li>
              <li>• Memrise</li>
            </ul>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Jazykové úrovně</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-2 bg-muted rounded text-center">A1</div>
              <div className="p-2 bg-muted rounded text-center">A2</div>
              <div className="p-2 bg-muted rounded text-center">B1</div>
              <div className="p-2 bg-muted rounded text-center">B2</div>
              <div className="p-2 bg-muted rounded text-center">C1</div>
              <div className="p-2 bg-muted rounded text-center">C2</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="bg-primary text-primary-foreground p-3 text-lg font-semibold">
          Jazykový tip dne
        </div>
        <CardContent className="p-4">
          <p className="italic">
            "V němčině se podstatná jména píší vždy s velkým počátečním písmenem - 
            nejen vlastní jména, ale i obecná."
          </p>
          <div className="mt-3 text-sm space-y-1">
            <p><strong>Příklad:</strong></p>
            <p>das Haus (dům)</p>
            <p>die Straße (ulice)</p>
            <p>der Computer (počítač)</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Offline Status Card */}
      {!isOffline && (
        <OfflineStatusCard 
          offlineStatus={offlineStatus}
          saveForOffline={saveForOffline}
        />
      )}
    </div>
  );
};

// Extracted sub-component for offline status
const OfflineStatusCard: React.FC<{
  offlineStatus: {
    grammarSaved: boolean;
    vocabularySaved: boolean;
    phrasesSaved: boolean;
  };
  saveForOffline: (type: 'grammar' | 'vocabulary' | 'phrases') => void;
}> = ({ offlineStatus, saveForOffline }) => {
  return (
    <Card>
      <div className="bg-primary text-primary-foreground p-3 text-lg font-semibold">
        Offline dostupnost
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Gramatika:</span> 
            <span className={offlineStatus.grammarSaved ? "text-green-500" : "text-amber-500"}>
              {offlineStatus.grammarSaved ? "Staženo" : "Nestaženo"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Slovní zásoba:</span> 
            <span className={offlineStatus.vocabularySaved ? "text-green-500" : "text-amber-500"}>
              {offlineStatus.vocabularySaved ? "Staženo" : "Nestaženo"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Fráze:</span> 
            <span className={offlineStatus.phrasesSaved ? "text-green-500" : "text-amber-500"}>
              {offlineStatus.phrasesSaved ? "Staženo" : "Nestaženo"}
            </span>
          </div>
        </div>
        <Button 
          className="w-full"
          variant="outline"
          onClick={() => {
            saveForOffline('grammar');
            saveForOffline('vocabulary');
            saveForOffline('phrases');
          }}
          disabled={
            offlineStatus.grammarSaved && 
            offlineStatus.vocabularySaved && 
            offlineStatus.phrasesSaved
          }
        >
          <Download className="mr-2 h-4 w-4" />
          Stáhnout vše
        </Button>
        <p className="text-xs text-muted-foreground">
          Data budou uložena v paměti vašeho zařízení a budou dostupná i bez připojení k internetu.
        </p>
      </CardContent>
    </Card>
  );
};

export default LanguageSidebar;
