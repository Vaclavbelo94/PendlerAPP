
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
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
  const { dueItems } = useVocabularyContext();
  
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
        <Card className="border-b p-1">
          <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} h-auto p-0.5`}>
            <TabsTrigger 
              value="basics" 
              onClick={() => setSelectedTab('basics')}
              className="flex items-center justify-center py-1 px-0.5"
            >
              <div className="flex items-center flex-col sm:flex-row sm:gap-1.5">
                <BookOpen className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                <span className={isMobile ? "text-[10px] mt-0.5" : "text-xs"}>
                  Základy
                </span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="packaging" 
              onClick={() => setSelectedTab('packaging')}
              className="flex items-center justify-center py-1 px-0.5"
            >
              <div className="flex items-center flex-col sm:flex-row sm:gap-1.5">
                <Search className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                <span className={isMobile ? "text-[10px] mt-0.5" : "text-xs"}>
                  Balíky
                </span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="numbers" 
              onClick={() => setSelectedTab('numbers')}
              className="flex items-center justify-center py-1 px-0.5"
            >
              <div className="flex items-center flex-col sm:flex-row sm:gap-1.5">
                <Brain className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                <span className={isMobile ? "text-[10px] mt-0.5" : "text-xs"}>
                  Čísla
                </span>
              </div>
            </TabsTrigger>
            
            {!isMobile && (
              <TabsTrigger 
                value="directions" 
                onClick={() => setSelectedTab('directions')}
                className="flex items-center justify-center py-1 px-0.5"
              >
                <div className="flex items-center flex-col sm:flex-row sm:gap-1.5">
                  <Wrench className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                  <span className={isMobile ? "text-[10px] mt-0.5" : "text-xs"}>
                    Pokyny
                  </span>
                </div>
              </TabsTrigger>
            )}
            
            {!isMobile && (
              <TabsTrigger 
                value="technology" 
                onClick={() => setSelectedTab('technology')}
                className="flex items-center justify-center py-1 px-0.5"
              >
                <div className="flex items-center flex-col sm:flex-row sm:gap-1.5">
                  <Cpu className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                  <span className={isMobile ? "text-[10px] mt-0.5" : "text-xs"}>
                    Technika
                  </span>
                </div>
              </TabsTrigger>
            )}
            
            <TabsTrigger 
              value="practice" 
              onClick={() => setSelectedTab('practice')}
              className="flex items-center justify-center py-1 px-0.5"
            >
              <div className="flex items-center flex-col sm:flex-row sm:gap-1.5">
                <Trophy className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                <span className={isMobile ? "text-[10px] mt-0.5" : "text-xs"}>
                  Procvičení
                </span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Card>
        
        <div className="mt-2">
          <TabsContent value="basics">
            <WarehouseBasicsTab />
          </TabsContent>
          
          <TabsContent value="packaging">
            <PackagingTermsTab />
          </TabsContent>
          
          <TabsContent value="numbers">
            <NumbersTab />
          </TabsContent>
          
          <TabsContent value="directions">
            <DirectionsTab />
          </TabsContent>
          
          <TabsContent value="technology">
            <TechnologyTab />
          </TabsContent>
          
          <TabsContent value="practice">
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
