import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { useVocabularyProgress } from '@/hooks/useVocabularyProgress';
import VocabularyReview from './VocabularyReview';
import VocabularyStatistics from './VocabularyStatistics';
import VocabularyProgressDashboard from './VocabularyProgressDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Settings, BarChart2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VocabularyItem } from '@/models/VocabularyItem';

// Sample vocabulary items for demonstration
const sampleVocabularyItems: VocabularyItem[] = [
  {
    id: 'vocab_1',
    word: 'der Hund',
    translation: 'pes',
    example: 'Der Hund bellt.',
    category: 'Zvířata',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_2',
    word: 'die Katze',
    translation: 'kočka',
    example: 'Die Katze miaut.',
    category: 'Zvířata',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_3',
    word: 'das Haus',
    translation: 'dům',
    example: 'Das ist mein Haus.',
    category: 'Bydlení',
    difficulty: 'hard',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_4',
    word: 'der Tisch',
    translation: 'stůl',
    example: 'Der Tisch ist aus Holz.',
    category: 'Nábytek',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_5',
    word: 'sprechen',
    translation: 'mluvit',
    example: 'Ich spreche Deutsch.',
    category: 'Slovesa',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  }
];

const VocabularySection: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('review');
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCategory, setNewCategory] = useState('Obecné');
  const [newDifficulty, setNewDifficulty] = useState('medium');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newDailyGoal, setNewDailyGoal] = useState(10);
  
  const {
    items,
    dueItems,
    currentItem,
    dailyGoal,
    completedToday,
    addVocabularyItem,
    markCorrect,
    markIncorrect,
    goToNextItem,
    getStatistics,
    setDailyGoal
  } = useSpacedRepetition(sampleVocabularyItems);

  const { userProgress } = useVocabularyProgress(items);

  // Update newDailyGoal when dailyGoal changes
  useEffect(() => {
    setNewDailyGoal(dailyGoal);
  }, [dailyGoal]);

  // Handle adding a new vocabulary item
  const handleAddWord = () => {
    if (newWord.trim() && newTranslation.trim()) {
      addVocabularyItem({
        word: newWord.trim(),
        translation: newTranslation.trim(),
        example: newExample.trim() || undefined,
        category: newCategory || 'Obecné',
        difficulty: newDifficulty as 'easy' | 'medium' | 'hard' || undefined,
      });
      
      // Reset form
      setNewWord('');
      setNewTranslation('');
      setNewExample('');
      setNewCategory('Obecné');
      setNewDifficulty('medium');
    }
  };

  // Handle saving settings
  const handleSaveSettings = () => {
    setDailyGoal(newDailyGoal);
    setSettingsOpen(false);
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="review">Opakování</TabsTrigger>
          <TabsTrigger value="browse">Procházet</TabsTrigger>
          <TabsTrigger value="add">Přidat slovíčko</TabsTrigger>
          <TabsTrigger value="progress">
            <BarChart2 className="h-4 w-4 mr-2" />
            Pokrok
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="review" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <VocabularyReview
                currentItem={currentItem}
                dueItems={dueItems}
                completedToday={completedToday}
                dailyGoal={dailyGoal}
                onCorrect={markCorrect}
                onIncorrect={markIncorrect}
                onNext={goToNextItem}
              />
            </div>
            <div className="md:col-span-1">
              <VocabularyStatistics statistics={getStatistics()} />
              
              <div className="mt-4 flex justify-end">
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Nastavení
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nastavení opakování</DialogTitle>
                      <DialogDescription>
                        Upravte si nastavení pro opakování slovíček
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="dailyGoal">Denní cíl (počet slovíček)</Label>
                        <Input
                          id="dailyGoal"
                          type="number"
                          min={1}
                          max={100}
                          value={newDailyGoal}
                          onChange={(e) => setNewDailyGoal(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button onClick={handleSaveSettings}>
                        <Save className="mr-2 h-4 w-4" />
                        Uložit nastavení
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {dueItems.length === 0 && !currentItem && (
            <Alert className="mt-4">
              <AlertTitle>Žádná slovíčka k opakování</AlertTitle>
              <AlertDescription>
                Momentálně nemáte žádná slovíčka k opakování. Přidejte si nová slovíčka nebo se vraťte později.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        {/* Browse tab */}
        <TabsContent value="browse">
          <Card>
            <CardHeader>
              <CardTitle>Vaše slovíčka</CardTitle>
              <CardDescription>
                Procházejte a spravujte svou slovní zásobu
              </CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-6">
                  <p>Zatím nemáte žádná slovíčka.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setSelectedTab('add')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Přidat slovíčko
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.word}</div>
                        <div className="text-sm text-muted-foreground">{item.translation}</div>
                        {item.example && (
                          <div className="text-xs italic mt-1">{item.example}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                        <div className="text-xs mt-1">
                          Úroveň: {item.repetitionLevel}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Add vocabulary tab */}
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Přidat nové slovíčko</CardTitle>
              <CardDescription>
                Rozšiřte svou slovní zásobu přidáním nového slovíčka
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form 
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddWord();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="word">Německé slovíčko *</Label>
                  <Input
                    id="word"
                    placeholder="např. der Hund"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="translation">Český překlad *</Label>
                  <Input
                    id="translation"
                    placeholder="např. pes"
                    value={newTranslation}
                    onChange={(e) => setNewTranslation(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="example">Příklad použití</Label>
                  <Textarea
                    id="example"
                    placeholder="např. Der Hund bellt."
                    value={newExample}
                    onChange={(e) => setNewExample(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategorie</Label>
                    <Select
                      value={newCategory}
                      onValueChange={setNewCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte kategorii" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Obecné">Obecné</SelectItem>
                        <SelectItem value="Zvířata">Zvířata</SelectItem>
                        <SelectItem value="Jídlo">Jídlo</SelectItem>
                        <SelectItem value="Cestování">Cestování</SelectItem>
                        <SelectItem value="Práce">Práce</SelectItem>
                        <SelectItem value="Volný čas">Volný čas</SelectItem>
                        <SelectItem value="Rodina">Rodina</SelectItem>
                        <SelectItem value="Bydlení">Bydlení</SelectItem>
                        <SelectItem value="Slovesa">Slovesa</SelectItem>
                        <SelectItem value="Přídavná jména">Přídavná jména</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Obtížnost</Label>
                    <Select
                      value={newDifficulty}
                      onValueChange={setNewDifficulty}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte obtížnost" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Lehká</SelectItem>
                        <SelectItem value="medium">Střední</SelectItem>
                        <SelectItem value="hard">Těžká</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Přidat slovíčko
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* New Progress Dashboard Tab */}
        <TabsContent value="progress">
          <VocabularyProgressDashboard 
            userProgress={userProgress}
            items={items}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VocabularySection;
