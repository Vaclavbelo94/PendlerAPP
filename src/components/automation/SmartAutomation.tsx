
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Bot, 
  Calendar, 
  Bell, 
  BookOpen, 
  Car, 
  DollarSign,
  Settings,
  Play,
  Pause,
  Trash2,
  Plus
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'time' | 'event' | 'condition';
    parameters: any;
  };
  action: {
    type: 'notification' | 'recommendation' | 'task' | 'update';
    parameters: any;
  };
  isActive: boolean;
  category: 'learning' | 'work' | 'finance' | 'general';
  lastExecuted?: Date;
  executionCount: number;
}

interface SmartAutomationProps {
  userId: string;
}

export const SmartAutomation: React.FC<SmartAutomationProps> = ({ userId }) => {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock automation rules
  useEffect(() => {
    const mockRules: AutomationRule[] = [
      {
        id: '1',
        name: 'Ranní připomenutí učení',
        description: 'Každý den v 7:00 připomene studium němčiny',
        trigger: {
          type: 'time',
          parameters: { time: '07:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }
        },
        action: {
          type: 'notification',
          parameters: { message: 'Čas na ranní lekci němčiny!', priority: 'medium' }
        },
        isActive: true,
        category: 'learning',
        executionCount: 23
      },
      {
        id: '2',
        name: 'Optimalizace směn',
        description: 'Automaticky doporučuje nejlepší směny na základě vzdálenosti',
        trigger: {
          type: 'event',
          parameters: { event: 'new_shift_available' }
        },
        action: {
          type: 'recommendation',
          parameters: { type: 'shift_optimization', autoApply: false }
        },
        isActive: true,
        category: 'work',
        executionCount: 8
      },
      {
        id: '3',
        name: 'Týdenní finanční přehled',
        description: 'Každou neděli zašle přehled týdenních výdajů a příjmů',
        trigger: {
          type: 'time',
          parameters: { time: '18:00', days: ['sunday'] }
        },
        action: {
          type: 'notification',
          parameters: { message: 'Týdenní finanční přehled je připraven', type: 'report' }
        },
        isActive: true,
        category: 'finance',
        executionCount: 12
      },
      {
        id: '4',
        name: 'Inteligentní procvičování',
        description: 'Automaticky připraví procvičování slov s nízkou úspěšností',
        trigger: {
          type: 'condition',
          parameters: { condition: 'accuracy_below_threshold', threshold: 70 }
        },
        action: {
          type: 'task',
          parameters: { task: 'create_practice_session', difficulty: 'targeted' }
        },
        isActive: true,
        category: 'learning',
        executionCount: 15
      },
      {
        id: '5',
        name: 'Úspora paliva',
        description: 'Navrhuje sdílení jízd při vysokých nákladech na palivo',
        trigger: {
          type: 'condition',
          parameters: { condition: 'fuel_cost_high', threshold: 100 }
        },
        action: {
          type: 'recommendation',
          parameters: { type: 'rideshare_suggestion', priority: 'high' }
        },
        isActive: false,
        category: 'finance',
        executionCount: 3
      }
    ];

    setAutomationRules(mockRules);
  }, []);

  const toggleRule = (ruleId: string) => {
    setAutomationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const deleteRule = (ruleId: string) => {
    setAutomationRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return <BookOpen className="h-4 w-4" />;
      case 'work': return <Calendar className="h-4 w-4" />;
      case 'finance': return <DollarSign className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'bg-blue-100 text-blue-800';
      case 'work': return 'bg-green-100 text-green-800';
      case 'finance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRules = selectedCategory === 'all' 
    ? automationRules 
    : automationRules.filter(rule => rule.category === selectedCategory);

  const AutomationRuleCard: React.FC<{ rule: AutomationRule }> = ({ rule }) => (
    <Card className={`${rule.isActive ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(rule.category)}
            <CardTitle className="text-base">{rule.name}</CardTitle>
            <Badge className={getCategoryColor(rule.category)}>
              {rule.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={rule.isActive}
              onCheckedChange={() => toggleRule(rule.id)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteRule(rule.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <CardDescription>{rule.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Spuštěno:</span>
            <span className="font-medium">{rule.executionCount}×</span>
          </div>
          {rule.lastExecuted && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Naposledy:</span>
              <span className="font-medium">
                {rule.lastExecuted.toLocaleDateString('cs-CZ')}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={rule.isActive ? 'default' : 'secondary'}>
              {rule.isActive ? 'Aktivní' : 'Neaktivní'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Inteligentní automatizace
          </h2>
          <p className="text-muted-foreground">
            Nastavte automatické akce pro zlepšení vašeho workflow
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nová automatizace
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {automationRules.filter(r => r.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Aktivní pravidla</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {automationRules.reduce((sum, r) => sum + r.executionCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Celkem spuštění</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {automationRules.filter(r => r.category === 'learning').length}
            </div>
            <p className="text-xs text-muted-foreground">Učební automatizace</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round((automationRules.filter(r => r.isActive).length / automationRules.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Míra aktivace</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Pravidla</TabsTrigger>
          <TabsTrigger value="templates">Šablony</TabsTrigger>
          <TabsTrigger value="settings">Nastavení</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Všechny
            </Button>
            <Button
              variant={selectedCategory === 'learning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('learning')}
            >
              Učení
            </Button>
            <Button
              variant={selectedCategory === 'work' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('work')}
            >
              Práce
            </Button>
            <Button
              variant={selectedCategory === 'finance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('finance')}
            >
              Finance
            </Button>
          </div>

          {/* Rules List */}
          <div className="grid gap-4">
            {filteredRules.map(rule => (
              <AutomationRuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Šablony automatizace</CardTitle>
              <CardDescription>
                Předpřipravené automatizace pro rychlé nastavení
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed border-2 hover:border-primary cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium">Denní studium</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatické připomínky pro pravidelné učení
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-dashed border-2 hover:border-primary cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <Car className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium">Optimalizace dojíždění</h3>
                    <p className="text-sm text-muted-foreground">
                      Inteligentní návrhy pro úsporu nákladů
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Obecná nastavení</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-automation">Povolit automatizace</Label>
                  <p className="text-sm text-muted-foreground">
                    Globální zapnutí/vypnutí všech automatizací
                  </p>
                </div>
                <Switch id="enable-automation" defaultChecked />
              </div>

              <div className="space-y-3">
                <Label>Frekvence kontroly (minuty)</Label>
                <Slider defaultValue={[5]} max={60} min={1} step={1} />
                <p className="text-sm text-muted-foreground">
                  Jak často se kontrolují podmínky automatizací
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smart-notifications">Inteligentní notifikace</Label>
                  <p className="text-sm text-muted-foreground">
                    AI určuje optimální čas pro notifikace
                  </p>
                </div>
                <Switch id="smart-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="learning-automation">Učební automatizace</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatické úpravy obtížnosti a obsahu
                  </p>
                </div>
                <Switch id="learning-automation" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartAutomation;
