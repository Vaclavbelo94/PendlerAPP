
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  HelpCircle, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Calculator,
  Clock,
  Euro,
  MapPin,
  Users,
  Briefcase,
  Home
} from 'lucide-react';

interface QuizStep {
  id: string;
  title: string;
  question: string;
  type: 'single' | 'multiple' | 'boolean';
  options?: { value: string; label: string; description?: string }[];
  icon: React.ComponentType<any>;
}

interface TaxStrategy {
  title: string;
  description: string;
  potentialSaving: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: string[];
  deadlines: Array<{ task: string; deadline: string }>;
}

const quizSteps: QuizStep[] = [
  {
    id: 'work-location',
    title: 'Místo práce',
    question: 'Kde převážně pracujete?',
    type: 'single',
    icon: MapPin,
    options: [
      { value: 'germany', label: 'V Německu', description: 'Zaměstnanec německé firmy' },
      { value: 'czechia', label: 'V České republice', description: 'Zaměstnanec české firmy' },
      { value: 'both', label: 'V obou zemích', description: 'Kombinace nebo častá změna' },
      { value: 'remote', label: 'Na dálku', description: 'Home office nebo digital nomad' }
    ]
  },
  {
    id: 'residency',
    title: 'Daňové rezidentství',
    question: 'Kde máte daňové rezidentství?',
    type: 'single',
    icon: Home,
    options: [
      { value: 'czechia', label: 'Česká republika', description: 'Střed životních zájmů v ČR' },
      { value: 'germany', label: 'Německo', description: 'Daňový rezident Německa' },
      { value: 'unclear', label: 'Nejsem si jistý', description: 'Potřebuji pomoc s určením' }
    ]
  },
  {
    id: 'family-status',
    title: 'Rodinný stav',
    question: 'Jaký je váš rodinný stav?',
    type: 'single',
    icon: Users,
    options: [
      { value: 'single', label: 'Svobodný/á', description: 'Bez dětí a partnera' },
      { value: 'married', label: 'Ženatý/vdaná', description: 'V manželství' },
      { value: 'children', label: 'S dětmi', description: 'Nezaopatřené děti' },
      { value: 'divorced', label: 'Rozvedený/á', description: 'Po rozvodu' }
    ]
  },
  {
    id: 'income-level',
    title: 'Výše příjmu',
    question: 'Jaká je vaše přibližná roční mzda?',
    type: 'single',
    icon: Euro,
    options: [
      { value: 'low', label: 'Do 30 000€', description: 'Nižší příjmy' },
      { value: 'medium', label: '30 000€ - 60 000€', description: 'Střední příjmy' },
      { value: 'high', label: '60 000€ - 100 000€', description: 'Vyšší příjmy' },
      { value: 'very-high', label: 'Nad 100 000€', description: 'Vysoké příjmy' }
    ]
  },
  {
    id: 'deductions',
    title: 'Odpočitatelné výdaje',
    question: 'Které z následujících výdajů máte?',
    type: 'multiple',
    icon: Calculator,
    options: [
      { value: 'commute', label: 'Dojíždění do práce', description: 'Náklady na dopravu' },
      { value: 'education', label: 'Vzdělávání', description: 'Kurzy a certifikace' },
      { value: 'second-home', label: 'Druhý byt', description: 'Ubytování v místě práce' },
      { value: 'work-equipment', label: 'Pracovní vybavení', description: 'Notebook, telefon, atd.' },
      { value: 'health', label: 'Zdravotní výdaje', description: 'Nad rámec pojištění' }
    ]
  }
];

const InteractiveTaxGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [completed, setCompleted] = useState(false);
  const [strategy, setStrategy] = useState<TaxStrategy | null>(null);

  const currentQuestion = quizSteps[currentStep];
  const progress = ((currentStep + 1) / quizSteps.length) * 100;

  const handleAnswer = (value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateStrategy();
      setCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateStrategy = () => {
    // Simple strategy generation based on answers
    const workLocation = answers['work-location'];
    const residency = answers['residency'];
    const incomeLevel = answers['income-level'];
    
    let generatedStrategy: TaxStrategy;

    if (workLocation === 'germany' && residency === 'czechia') {
      generatedStrategy = {
        title: 'Optimalizace pro pendlery',
        description: 'Maximalizujte odpočty při práci v Německu s českým rezidentstvím',
        potentialSaving: '3 000 - 8 000€ ročně',
        difficulty: 'medium',
        steps: [
          'Ověřte podmínky smlouvy o zamezení dvojího zdanění',
          'Vedejte evidenci pracovních dnů (max. 183 dnů)',
          'Využijte odpočty za dojíždění v Německu',
          'Zvažte formulář A1 pro sociální pojištění',
          'Dokumentujte všechny odpočitatelné výdaje'
        ],
        deadlines: [
          { task: 'Podání německého daňového přiznání', deadline: '31. července' },
          { task: 'Hlášení příjmů z Německa v ČR', deadline: '31. března' },
          { task: 'Žádost o formulář A1', deadline: 'Před začátkem práce' }
        ]
      };
    } else if (workLocation === 'czechia' && residency === 'czechia') {
      generatedStrategy = {
        title: 'Standardní optimalizace v ČR',
        description: 'Využijte všechny dostupné odpočty při práci v České republice',
        potentialSaving: '1 500 - 4 000€ ročně',
        difficulty: 'easy',
        steps: [
          'Uplatněte slevu na poplatníka',
          'Využijte odpočty za dojíždění',
          'Odpočítejte náklady na vzdělávání',
          'Zvažte doplňkové penzijní spoření',
          'Dokumentujte dary na charitu'
        ],
        deadlines: [
          { task: 'Podání daňového přiznání', deadline: '31. března' },
          { task: 'Doplatky daně', deadline: '31. května' },
          { task: 'Uzavření penzijního spoření', deadline: '31. prosince' }
        ]
      };
    } else {
      generatedStrategy = {
        title: 'Komplexní daňová strategie',
        description: 'Individuální přístup pro složitou daňovou situaci',
        potentialSaving: '2 000 - 10 000€ ročně',
        difficulty: 'hard',
        steps: [
          'Konzultace s daňovým poradcem',
          'Analýza daňového rezidentství',
          'Optimalizace struktury příjmů',
          'Mezinárodní daňové plánování',
          'Pravidelné sledování změn zákonů'
        ],
        deadlines: [
          { task: 'Konzultace s poradcem', deadline: 'Co nejdříve' },
          { task: 'Příprava dokumentace', deadline: 'Průběžně' },
          { task: 'Roční revize strategie', deadline: 'Každý prosinec' }
        ]
      };
    }

    setStrategy(generatedStrategy);
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setCompleted(false);
    setStrategy(null);
  };

  if (completed && strategy) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Vaša optimální daňová strategie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-lg mb-2">{strategy.title}</h3>
                <p className="text-muted-foreground mb-4">{strategy.description}</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    {strategy.potentialSaving}
                  </Badge>
                  <Badge 
                    variant={strategy.difficulty === 'easy' ? 'default' : 
                            strategy.difficulty === 'medium' ? 'secondary' : 'destructive'}
                  >
                    {strategy.difficulty === 'easy' ? 'Snadné' :
                     strategy.difficulty === 'medium' ? 'Střední' : 'Pokročilé'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Důležité termíny
                </h4>
                {strategy.deadlines.map((deadline, index) => (
                  <div key={index} className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                    <span>{deadline.task}</span>
                    <span className="font-medium">{deadline.deadline}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Doporučený postup
              </h4>
              <div className="space-y-2">
                {strategy.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Tato doporučení jsou obecná. Pro konkrétní situaci vždy konzultujte s kvalifikovaným daňovým poradcem.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={restart} variant="outline">
                Spustit znovu
              </Button>
              <Button>
                Kontaktovat poradce
              </Button>
              <Button variant="outline">
                Uložit strategii
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Interaktivní daňový průvodce
          </CardTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Krok {currentStep + 1} z {quizSteps.length}</span>
              <span>{Math.round(progress)}% dokončeno</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <currentQuestion.icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{currentQuestion.title}</h3>
              <p className="text-muted-foreground">{currentQuestion.question}</p>
            </div>
          </div>

          <div className="space-y-4">
            {currentQuestion.type === 'single' && (
              <RadioGroup 
                value={answers[currentQuestion.id] as string || ''}
                onValueChange={(value) => handleAnswer(value)}
              >
                {currentQuestion.options?.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      {option.description && (
                        <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'multiple' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                    <Checkbox 
                      id={option.value}
                      checked={(answers[currentQuestion.id] as string[] || []).includes(option.value)}
                      onCheckedChange={(checked) => {
                        const currentAnswers = answers[currentQuestion.id] as string[] || [];
                        if (checked) {
                          handleAnswer([...currentAnswers, option.value]);
                        } else {
                          handleAnswer(currentAnswers.filter(a => a !== option.value));
                        }
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      {option.description && (
                        <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Zpět
            </Button>
            
            <Button 
              onClick={nextStep}
              disabled={!answers[currentQuestion.id] || 
                       (Array.isArray(answers[currentQuestion.id]) && (answers[currentQuestion.id] as string[]).length === 0)}
              className="flex items-center gap-2"
            >
              {currentStep === quizSteps.length - 1 ? 'Dokončit' : 'Další'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveTaxGuide;
