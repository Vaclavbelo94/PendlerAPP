
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { useAuth } from "@/hooks/useAuth";
import VocabularySection from "@/components/language/VocabularySection";
import OfflineIndicator from "@/components/offlineMode/OfflineIndicator";
import OfflineDownloadCard from "@/components/language/OfflineDownloadCard";
import LanguageManager, { useLanguageContext } from "@/components/language/LanguageManager";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Languages } from "lucide-react";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { germanCourseDescription } from "@/data/germanCourseDescription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LanguageContent = () => {
  const { isPremium } = useAuth();
  const { isOffline } = useOfflineStatus();
  const { activeTab, setActiveTab, offlineStatus, saveForOffline } = useLanguageContext();
  
  // Optimalizovaný hook pro mobilní zařízení
  const isMobile = useIsMobile();
  
  // Simulace postupu v kurzu (v produkci by toto bylo načítáno z dat uživatele)
  const [courseProgress, setCourseProgress] = useState({
    basics: 40,
    packaging: 20,
    numbers: 10,
    directions: 0,
    practice: 30
  });

  return (
    <ResponsiveContainer>
      {/* Úvodní sekce s popisem kurzu */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">{germanCourseDescription.title}</CardTitle>
          <CardDescription>{germanCourseDescription.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{germanCourseDescription.description}</p>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Celkový postup v kurzu</span>
              <span>20%</span>
            </div>
            <Progress value={20} className="h-2" />
          </div>
          
          {/* Navigační tlačítka pro mobilní verzi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
            <Button
              variant={activeTab === "grammar" ? "default" : "outline"}
              size={isMobile ? "sm" : "default"}
              className="flex items-center justify-center sm:justify-start gap-1 h-12"
              onClick={() => setActiveTab("grammar")}
            >
              <BookOpen className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className={isMobile ? "text-xs" : ""}>Gramatika</span>
                <span className="text-[10px] text-muted-foreground">Základní pravidla</span>
              </div>
            </Button>
            <Button
              variant={activeTab === "vocabulary" ? "default" : "outline"}
              size={isMobile ? "sm" : "default"}
              className="flex items-center justify-center sm:justify-start gap-1 h-12"
              onClick={() => setActiveTab("vocabulary")}
            >
              <FileText className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className={isMobile ? "text-xs" : ""}>Slovíčka</span>
                <span className="text-[10px] text-muted-foreground">Práce v centru</span>
              </div>
            </Button>
            <Button
              variant={activeTab === "phrases" ? "default" : "outline"}
              size={isMobile ? "sm" : "default"}
              className="flex items-center justify-center sm:justify-start gap-1 h-12"
              onClick={() => setActiveTab("phrases")}
            >
              <Languages className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className={isMobile ? "text-xs" : ""}>Fráze</span>
                <span className="text-[10px] text-muted-foreground">Užitečné výrazy</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Výuka jazyka - obsah */}
      <div className="w-full space-y-3 sm:space-y-4">
        {/* Indikátor offline režimu */}
        {!isOffline && (
          <OfflineDownloadCard 
            activeTab={activeTab} 
            offlineStatus={offlineStatus}
            saveForOffline={saveForOffline}
          />
        )}
        
        {activeTab === "vocabulary" && <VocabularySection />}
        
        {activeTab === "grammar" && (
          <Card>
            <CardHeader>
              <CardTitle>Gramatika němčiny</CardTitle>
              <CardDescription>
                Základní gramatická pravidla němčiny pro začátečníky
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <p className="text-muted-foreground">
                  Sekce gramatiky je momentálně ve vývoji.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeTab === "phrases" && (
          <Card>
            <CardHeader>
              <CardTitle>Užitečné fráze</CardTitle>
              <CardDescription>
                Fráze a konverzační obraty pro každodenní situace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <p className="text-muted-foreground">
                  Sekce s frázemi je momentálně ve vývoji.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Indikátor offline režimu */}
      <OfflineIndicator />
    </ResponsiveContainer>
  );
};

const Language = () => {
  return (
    <LanguageManager>
      <LanguageContent />
    </LanguageManager>
  );
};

export default Language;
