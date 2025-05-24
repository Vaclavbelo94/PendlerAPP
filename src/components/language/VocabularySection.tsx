
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import VocabularyManager, { useVocabularyContext } from './vocabulary/VocabularyManager';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, BookOpen, Search, Brain, Trophy, RotateCw, Cpu, Wrench } from "lucide-react";

import {
  WarehouseBasicsTab,
  PackagingTermsTab,
  NumbersTab,
  DirectionsTab,
  TechnologyTab,
  PracticeTab
} from './vocabulary/GermanCourseContent';

const VocabularyContent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('basics');
  const isMobile = useIsMobile();
  const { isAdmin } = useAuth();
  
  // Get vocabulary context
  const vocabularyContext = useVocabularyContext();
  const dueItems = vocabularyContext?.dueItems || [];
  
  return (
    <div className="space-y-4">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Němčina pro práci v balíkovém centru</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tato sekce obsahuje rozšířenou slovní zásobu a fráze, které budete potřebovat při práci v německém balíkovém třídícím centru. 
            Začněte se základy a postupně se propracujte k pokročilejším tématům včetně moderní technologie.
          </p>
        </CardContent>
      </Card>
      
      {dueItems.length > 0 && (
        <Card className="mb-4 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <RotateCw className="h-5 w-5 text-amber-600 mr-2" />
              <div>
                <h3 className="font-medium text-amber-800">Máte {dueItems.length} slovíček k opakování</h3>
                <p className="text-sm text-amber-700">Pravidelné opakování pomáhá k lepšímu zapamatování</p>
              </div>
              <Button 
                variant="outline" 
                className="ml-auto border-amber-200 hover:bg-amber-100 text-amber-800"
                onClick={() => setSelectedTab('practice')}
              >
                Opakovat
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <Card className="border-b">
          <CardContent className="p-1">
            <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} w-full h-auto p-1 bg-muted/50`}>
              <TabsTrigger 
                value="basics" 
                className={`flex items-center justify-center ${isMobile ? 'py-2 px-1' : 'py-2 px-3'} data-[state=active]:bg-background data-[state=active]:shadow-sm`}
              >
                <div className="flex items-center flex-col gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-center leading-tight`}>
                    Základy
                  </span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="packaging" 
                className={`flex items-center justify-center ${isMobile ? 'py-2 px-1' : 'py-2 px-3'} data-[state=active]:bg-background data-[state=active]:shadow-sm`}
              >
                <div className="flex items-center flex-col gap-1">
                  <Search className="w-4 h-4" />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-center leading-tight`}>
                    Balíky
                  </span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="numbers" 
                className={`flex items-center justify-center ${isMobile ? 'py-2 px-1' : 'py-2 px-3'} data-[state=active]:bg-background data-[state=active]:shadow-sm`}
              >
                <div className="flex items-center flex-col gap-1">
                  <Brain className="w-4 h-4" />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-center leading-tight`}>
                    Čísla
                  </span>
                </div>
              </TabsTrigger>
              
              {!isMobile && (
                <>
                  <TabsTrigger 
                    value="directions" 
                    className="flex items-center justify-center py-2 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <div className="flex items-center flex-col gap-1">
                      <Wrench className="w-4 h-4" />
                      <span className="text-sm font-medium text-center leading-tight">
                        Pokyny
                      </span>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="technology" 
                    className="flex items-center justify-center py-2 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <div className="flex items-center flex-col gap-1">
                      <Cpu className="w-4 h-4" />
                      <span className="text-sm font-medium text-center leading-tight">
                        Technika
                      </span>
                    </div>
                  </TabsTrigger>
                </>
              )}
              
              <TabsTrigger 
                value="practice" 
                className={`flex items-center justify-center ${isMobile ? 'py-2 px-1' : 'py-2 px-3'} data-[state=active]:bg-background data-[state=active]:shadow-sm`}
              >
                <div className="flex items-center flex-col gap-1">
                  <Trophy className="w-4 h-4" />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-center leading-tight`}>
                    Procvičení
                  </span>
                </div>
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>
        
        <div className="mt-4">
          <TabsContent value="basics" className="mt-0">
            <WarehouseBasicsTab />
          </TabsContent>
          
          <TabsContent value="packaging" className="mt-0">
            <PackagingTermsTab />
          </TabsContent>
          
          <TabsContent value="numbers" className="mt-0">
            <NumbersTab />
          </TabsContent>
          
          <TabsContent value="directions" className="mt-0">
            <DirectionsTab />
          </TabsContent>
          
          <TabsContent value="technology" className="mt-0">
            <TechnologyTab />
          </TabsContent>
          
          <TabsContent value="practice" className="mt-0">
            <PracticeTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

const VocabularySection: React.FC = () => {
  return (
    <div className="py-2">
      <VocabularyManager>
        <VocabularyContent />
      </VocabularyManager>
    </div>
  );
};

export default VocabularySection;
