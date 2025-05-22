
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import VocabularyReview from './VocabularyReview';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { VocabularyItem } from '@/models/VocabularyItem';

const VocabularySection: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('review');
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCategory, setNewCategory] = useState('Obecné');
  const [newDifficulty, setNewDifficulty] = useState('medium');
  
  const { items, addVocabularyItem } = useSpacedRepetition();
  const { toast } = useToast();
  
  // Přidání nového slovíčka
  const handleAddWord = () => {
    if (newWord.trim() && newTranslation.trim()) {
      addVocabularyItem({
        word: newWord.trim(),
        translation: newTranslation.trim(),
        example: newExample.trim() || undefined,
        category: newCategory || 'Obecné',
        difficulty: newDifficulty as 'easy' | 'medium' | 'hard',
        repetitionLevel: 0,
        correctCount: 0,
        incorrectCount: 0
      });
      
      // Reset formuláře
      setNewWord('');
      setNewTranslation('');
      setNewExample('');
      setNewCategory('Obecné');
      setNewDifficulty('medium');
      
      toast({
        title: "Slovíčko přidáno",
        description: `Slovíčko "${newWord}" bylo úspěšně přidáno do vaší sbírky.`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="review">Opakování</TabsTrigger>
          <TabsTrigger value="browse">Prohlížet</TabsTrigger>
          <TabsTrigger value="add">Přidat</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <TabsContent value="review" className="pt-2">
            <VocabularyReview />
          </TabsContent>
          
          <TabsContent value="browse" className="pt-2">
            <Card>
              <CardHeader>
                <CardTitle>Slovní zásoba</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Zatím nemáte žádná slovíčka. Přidejte nějaká v záložce "Přidat".</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Německy</th>
                          <th className="text-left py-2">Česky</th>
                          <th className="text-left py-2 hidden sm:table-cell">Kategorie</th>
                          <th className="text-left py-2 hidden md:table-cell">Obtížnost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-muted/50">
                            <td className="py-2">{item.word}</td>
                            <td className="py-2">{item.translation}</td>
                            <td className="py-2 hidden sm:table-cell">{item.category || 'Obecné'}</td>
                            <td className="py-2 hidden md:table-cell">{item.difficulty || 'medium'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add" className="pt-2">
            <Card>
              <CardHeader>
                <CardTitle>Přidat nové slovíčko</CardTitle>
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
                    <Input
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
                    Přidat slovíčko
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default VocabularySection;
