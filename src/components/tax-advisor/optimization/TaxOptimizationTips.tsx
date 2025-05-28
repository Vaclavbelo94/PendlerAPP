import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  Car, 
  Home, 
  GraduationCap, 
  Heart, 
  Calculator,
  FileText,
  TrendingDown,
  Euro
} from 'lucide-react';

interface OptimizationTip {
  id: string;
  title: string;
  description: string;
  category: 'deductions' | 'income' | 'timing' | 'family';
  potentialSaving: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: React.ComponentType<any>;
  details: string[];
  requirements: string[];
}

const optimizationTips: OptimizationTip[] = [
  {
    id: 'commuting',
    title: 'Odpočet dojíždění do práce',
    description: 'Využijte odpočet nákladů na dojíždění (Entfernungspauschale)',
    category: 'deductions',
    potentialSaving: '500-2000€ ročně',
    difficulty: 'easy',
    icon: Car,
    details: [
      '0,30€ za km jednosměrně při vzdálenosti nad 20 km',
      'Od 21. km: 0,38€ za km',
      'Platí i pro veřejnou dopravu',
      'Maximálně 4500€ ročně (výjimka: vlastní auto)'
    ],
    requirements: [
      'Pravidelné dojíždění do práce',
      'Vzdálenost alespoň 15 km',
      'Dokumentace trasy'
    ]
  },
  {
    id: 'home-office',
    title: 'Odpočet domácí kanceláře',
    description: 'Odpočet nákladů na práci z domova (Homeoffice-Pauschale)',
    category: 'deductions',
    potentialSaving: '600€ ročně',
    difficulty: 'easy',
    icon: Home,
    details: [
      '6€ za den práce z domova',
      'Maximálně 1260€ ročně',
      'Alternativně: skutečné náklady při výhradním pracovním pokoji',
      'Kombinovatelné s dojížděním'
    ],
    requirements: [
      'Možnost práce z domova',
      'Dokumentace pracovních dnů',
      'Souhlas zaměstnavatele'
    ]
  },
  {
    id: 'education',
    title: 'Vzdělávací náklady',
    description: 'Odpočet nákladů na další vzdělávání (Fortbildungskosten)',
    category: 'deductions',
    potentialSaving: '1000-5000€ ročně',
    difficulty: 'medium',
    icon: GraduationCap,
    details: [
      'Kurzy, semináře, certifikace',
      'Jazykové kurzy pro práci',
      'Odborná literatura',
      'Cestovné na vzdělávací akce'
    ],
    requirements: [
      'Souvislost s prací',
      'Uchování dokladů',
      'Potvrzení od zaměstnavatele'
    ]
  },
  {
    id: 'health-insurance',
    title: 'Optimalizace zdravotního pojištění',
    description: 'Výběr správného zdravotního pojištění a doplňků',
    category: 'income',
    potentialSaving: '500-1500€ ročně',
    difficulty: 'medium',
    icon: Heart,
    details: [
      'Porovnání zákonných pojišťoven',
      'Dodatečné tarify',
      'Soukromé pojištění pro vysoké příjmy',
      'Odpočet příspěvků'
    ],
    requirements: [
      'Roční příjem nad 69300€ (2024)',
      'Analýza potřeb',
      'Srovnání nabídek'
    ]
  },
  {
    id: 'timing',
    title: 'Časování příjmů',
    description: 'Optimální načasování bonusů a jednorázových příjmů',
    category: 'timing',
    potentialSaving: '1000-3000€ ročně',
    difficulty: 'hard',
    icon: Calculator,
    details: [
      'Rozložení bonusů mezi roky',
      'Vánoční příspěvek v lednu',
      'Dovolená v naturáliích',
      'Firemní benefity'
    ],
    requirements: [
      'Flexibilní zaměstnavatel',
      'Plánování příjmů',
      'Daňové poradenství'
    ]
  },
  {
    id: 'family',
    title: 'Rodinné výhody',
    description: 'Využití všech rodinných odpočtů a příspěvků',
    category: 'family',
    potentialSaving: '2000-8000€ ročně',
    difficulty: 'easy',
    icon: Heart,
    details: [
      'Kindergeld: 250€ měsíčně na dítě',
      'Kinderfreibetrag: 9312€ ročně na dítě',
      'Betreuungsfreibetrag: 2928€ na péči',
      'Daňová třída optimalizace pro manžele'
    ],
    requirements: [
      'Děti do 18 let (nebo studující do 25)',
      'Trvalý pobyt v Německu',
      'Správná volba daňové třídy'
    ]
  }
];

const TaxOptimizationTips = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTip, setSelectedTip] = useState<OptimizationTip | null>(null);

  const filteredTips = selectedCategory === 'all' 
    ? optimizationTips 
    : optimizationTips.filter(tip => tip.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Snadné';
      case 'medium': return 'Střední';
      case 'hard': return 'Pokročilé';
      default: return 'Neznámé';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Daňové optimalizace pro 2024
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="mb-6">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Tipy jsou aktuální pro daňový rok 2024. Před implementací se vždy poraďte s daňovým poradcem.
            </AlertDescription>
          </Alert>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="w-full overflow-x-auto">
              <TabsList className="grid w-full min-w-fit grid-cols-5 h-auto p-1">
                <TabsTrigger value="all" className="text-xs px-2 py-2">Všechny</TabsTrigger>
                <TabsTrigger value="deductions" className="text-xs px-2 py-2">Odpočty</TabsTrigger>
                <TabsTrigger value="income" className="text-xs px-2 py-2">Příjmy</TabsTrigger>
                <TabsTrigger value="timing" className="text-xs px-2 py-2">Načasování</TabsTrigger>
                <TabsTrigger value="family" className="text-xs px-2 py-2">Rodina</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={selectedCategory} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredTips.map((tip) => {
                  const IconComponent = tip.icon;
                  return (
                    <Card 
                      key={tip.id} 
                      className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer min-h-[280px]"
                      onClick={() => setSelectedTip(tip)}
                    >
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm leading-tight mb-1">
                              {tip.title}
                            </h3>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-3">
                          {tip.description}
                        </p>
                        
                        <div className="space-y-3 mt-auto">
                          <div className="flex flex-wrap gap-1">
                            <Badge 
                              variant="secondary"
                              className={`text-xs px-2 py-1 ${getDifficultyColor(tip.difficulty)}`}
                            >
                              {getDifficultyText(tip.difficulty)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                              <Euro className="h-3 w-3" />
                              {tip.potentialSaving}
                            </Badge>
                            <Button variant="ghost" size="sm" className="text-xs h-7 px-3">
                              Detail →
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedTip && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <selectedTip.icon className="h-5 w-5" />
              {selectedTip.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Detaily implementace:</h4>
              <ul className="space-y-1">
                {selectedTip.details.map((detail, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <TrendingDown className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Požadavky:</h4>
              <ul className="space-y-1">
                {selectedTip.requirements.map((requirement, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setSelectedTip(null)} variant="outline">
                Zavřít
              </Button>
              <Button>
                Implementovat optimalizaci
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaxOptimizationTips;
