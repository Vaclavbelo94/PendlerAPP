
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Plane, 
  Calculator, 
  FileText, 
  Euro,
  Clock,
  Home,
  Car,
  GraduationCap,
  Heart,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface PendlerTip {
  id: string;
  title: string;
  description: string;
  category: 'taxation' | 'insurance' | 'deductions' | 'legal';
  potentialSaving: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: React.ComponentType<any>;
  details: string[];
  requirements: string[];
  warnings?: string[];
}

const pendlerTips: PendlerTip[] = [
  {
    id: 'double-taxation',
    title: 'Vyhnutí se dvojímu zdanění',
    description: 'Jak správně využít smlouvu o zamezení dvojího zdanění mezi ČR a Německem',
    category: 'taxation',
    potentialSaving: '3000-8000€ ročně',
    difficulty: 'hard',
    icon: Calculator,
    details: [
      'Využijte článek 15 smlouvy o zamezení dvojího zdanění',
      'Zdaňování v zemi výkonu práce (Německo) při splnění podmínek',
      'Limit 183 dnů pobytu v kalendářním roce',
      'Zaměstnavatel nesmí být rezidentem ČR'
    ],
    requirements: [
      'Pravidelné vedení evidence pracovních dnů',
      'Daňové rezidentství v ČR',
      'Formální potvrzení od německého zaměstnavatele'
    ],
    warnings: [
      'Překročení 183 dnů znamená zdanění v ČR',
      'Nutné hlášení českému finančnímu úřadu'
    ]
  },
  {
    id: 'commute-optimization',
    title: 'Optimalizace dojíždění',
    description: 'Maximální využití odpočtů za dojíždění v obou zemích',
    category: 'deductions',
    potentialSaving: '2000-4000€ ročně',
    difficulty: 'medium',
    icon: Car,
    details: [
      'Německý odpočet: 0,30€/km (prvních 20 km), 0,38€/km (nad 20 km)',
      'Český odpočet za dopravu do zaměstnání',
      'Kombinace veřejné dopravy a vlastního vozidla',
      'Odpočet parkování v místě práce'
    ],
    requirements: [
      'Vedení knihy jízd',
      'Doklady o nákupu paliva',
      'Potvrzení o parkování'
    ]
  },
  {
    id: 'social-insurance',
    title: 'Sociální pojištění pro pendlery',
    description: 'Správné nastavení sociálního pojištění při práci v zahraničí',
    category: 'insurance',
    potentialSaving: '1500-3000€ ročně',
    difficulty: 'hard',
    icon: Heart,
    details: [
      'Formulář A1 pro zachování českého pojištění',
      'Výjimka z německého sociálního pojištění',
      'Zdravotní pojištění v ČR s kartou EHIC',
      'Optimalizace podle délky zahraniční práce'
    ],
    requirements: [
      'Žádost o formulář A1 před začátkem práce',
      'Potvrzení od českého zaměstnavatele',
      'Pravidelné prodlužování výjimky'
    ],
    warnings: [
      'Bez formuláře A1 platíte dvojí pojištění',
      'Zpětné vyřízení je složité a nákladné'
    ]
  },
  {
    id: 'language-courses',
    title: 'Jazykové kurzy jako odpočet',
    description: 'Odpočet nákladů na německé jazykové kurzy potřebné pro práci',
    category: 'deductions',
    potentialSaving: '500-2000€ ročně',
    difficulty: 'easy',
    icon: GraduationCap,
    details: [
      'Kurzy němčiny související s prací',
      'Odborné certifikace (Goethe, TestDaF)',
      'Online kurzy i prezenční výuka',
      'Učebnice a studijní materiály'
    ],
    requirements: [
      'Prokázání souvislosti s prací',
      'Uchování všech dokladů',
      'Certifikát o absolvování'
    ]
  },
  {
    id: 'second-home',
    title: 'Druhý byt v Německu',
    description: 'Daňové odpočty při pronájmu bytu v místě práce v Německu',
    category: 'deductions',
    potentialSaving: '4000-12000€ ročně',
    difficulty: 'medium',
    icon: Home,
    details: [
      'Náklady na pronájem jako výdaj na dosažení příjmu',
      'Odpočet zařízení a vybavení',
      'Cestovné mezi hlavním a druhým bydlištěm',
      'Limit podle velikosti a standardu bytu'
    ],
    requirements: [
      'Nájemní smlouva na jméno zaměstnance',
      'Doklad o hlavním bydlišti v ČR',
      'Evidence všech nákladů'
    ]
  },
  {
    id: 'tax-residency',
    title: 'Optimalizace daňového rezidentství',
    description: 'Strategické plánování daňového rezidentství pro minimalizaci daní',
    category: 'legal',
    potentialSaving: '5000-15000€ ročně',
    difficulty: 'hard',
    icon: MapPin,
    details: [
      'Test 183 dnů pro určení rezidentství',
      'Centrum životních zájmů',
      'Rodinné a ekonomické vazby',
      'Strategické časování změn rezidentství'
    ],
    requirements: [
      'Podrobná evidence pobytu',
      'Dokumentace rodinných a ekonomických vazeb',
      'Právní poradenství'
    ],
    warnings: [
      'Změna rezidentství má dlouhodobé důsledky',
      'Nutná konzultace s daňovým poradcem'
    ]
  }
];

const PendlerTipsTab = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTip, setSelectedTip] = useState<PendlerTip | null>(null);

  const filteredTips = selectedCategory === 'all' 
    ? pendlerTips 
    : pendlerTips.filter(tip => tip.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'taxation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'insurance': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'deductions': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'legal': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const categories = [
    { id: 'all', label: 'Všechny kategorie', icon: Info },
    { id: 'taxation', label: 'Zdanění', icon: Calculator },
    { id: 'insurance', label: 'Pojištění', icon: Heart },
    { id: 'deductions', label: 'Odpočty', icon: Euro },
    { id: 'legal', label: 'Právní', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Rady pro pendlery - Česko ↔ Německo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Tyto rady jsou určené pro osoby pracující v Německu s daňovým rezidentstvím v ČR. 
              Vždy se poraďte s daňovým poradcem pro vaši konkrétní situaci.
            </AlertDescription>
          </Alert>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-12">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <TabsTrigger 
                    key={category.id}
                    value={category.id} 
                    className="flex items-center gap-2 text-xs px-2 py-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden lg:inline">{category.label}</span>
                    <span className="lg:hidden">{category.label.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredTips.map((tip) => {
                  const IconComponent = tip.icon;
                  return (
                    <Card 
                      key={tip.id} 
                      className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer"
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
                            <Badge 
                              variant="outline"
                              className={`text-xs px-2 py-1 ${getCategoryColor(tip.category)}`}
                            >
                              {tip.category === 'taxation' ? 'Zdanění' :
                               tip.category === 'insurance' ? 'Pojištění' :
                               tip.category === 'deductions' ? 'Odpočty' : 'Právní'}
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
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Jak postupovat:
              </h4>
              <ul className="space-y-1">
                {selectedTip.details.map((detail, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Potřebné dokumenty:
              </h4>
              <ul className="space-y-1">
                {selectedTip.requirements.map((requirement, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>

            {selectedTip.warnings && selectedTip.warnings.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Upozornění:
                </h4>
                <ul className="space-y-1">
                  {selectedTip.warnings.map((warning, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={() => setSelectedTip(null)} variant="outline">
                Zavřít
              </Button>
              <Button>
                Konzultovat s poradcem
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PendlerTipsTab;
