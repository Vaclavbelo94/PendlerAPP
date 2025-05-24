
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookOpen, Brain, Trophy, ArrowRight, PlayCircle } from "lucide-react";
import EnhancedGrammarExercise from '../EnhancedGrammarExercise';
import { grammarExercises } from '@/data/germanExercises';

const GrammarTab = () => {
  const [selectedCategory, setSelectedCategory] = useState('basics');
  const isMobile = useIsMobile();

  const grammarSections = [
    {
      id: 'basics',
      title: 'Základy',
      description: 'Základní gramatická pravidla',
      icon: BookOpen,
      progress: 67,
      lessons: 12,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'articles',
      title: 'Členy',
      description: 'Der, die, das a jejich použití',
      icon: Brain,
      progress: 45,
      lessons: 8,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'cases',
      title: 'Pády',
      description: 'Nominativ, Akkusativ, Dativ, Genitiv',
      icon: Trophy,
      progress: 23,
      lessons: 16,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'verbs',
      title: 'Slovesa',
      description: 'Časování a nepravidelná slovesa',
      icon: PlayCircle,
      progress: 78,
      lessons: 20,
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Gramatika němčiny</CardTitle>
          <CardDescription>
            Naučte se základní gramatická pravidla německého jazyka krok za krokem
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <Card className="border-b">
          <CardContent className="p-1">
            <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} w-full h-auto p-1 bg-muted/50`}>
              {grammarSections.map((section) => {
                const Icon = section.icon;
                return (
                  <TabsTrigger 
                    key={section.id}
                    value={section.id}
                    className={`flex items-center justify-center ${isMobile ? 'py-2 px-1' : 'py-2 px-3'} data-[state=active]:bg-background data-[state=active]:shadow-sm`}
                  >
                    <div className="flex items-center flex-col gap-1">
                      <Icon className="w-4 h-4" />
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-center leading-tight`}>
                        {section.title}
                      </span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </CardContent>
        </Card>

        <div className="mt-4">
          {grammarSections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card className={`${section.color} mb-4`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <section.icon className="h-5 w-5" />
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                        </div>
                        <Badge variant="outline">{section.lessons} lekcí</Badge>
                      </div>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Pokrok</span>
                          <span>{section.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${section.progress}%` }}
                          ></div>
                        </div>
                        <Button className="w-full flex gap-1" size="sm">
                          <PlayCircle className="h-4 w-4" />
                          Začít procvičovat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Rychlý přehled</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Dokončené lekce</span>
                        <span>{Math.floor(section.lessons * section.progress / 100)}/{section.lessons}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Úspěšnost</span>
                        <span>{section.progress + 10}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Čas ke studiu</span>
                        <span>~{section.lessons * 5} min</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  {grammarExercises.find(cat => cat.id === section.id) && (
                    <EnhancedGrammarExercise 
                      category={grammarExercises.find(cat => cat.id === section.id)!} 
                    />
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default GrammarTab;
