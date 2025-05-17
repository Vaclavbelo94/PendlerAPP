
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { PremiumBadge } from '@/components/premium/PremiumBadge';

interface VocabularyAddProps {
  addVocabularyItem: (item: Omit<VocabularyItem, 'id'> & Partial<VocabularyItem>) => void;
}

const VocabularyAdd: React.FC<VocabularyAddProps> = ({ addVocabularyItem }) => {
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCategory, setNewCategory] = useState('Obecné');
  const [newDifficulty, setNewDifficulty] = useState('medium');
  const { toast } = useToast();
  const { isPremium } = useAuth();

  // Handle adding a new vocabulary item
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
      
      // Reset form
      setNewWord('');
      setNewTranslation('');
      setNewExample('');
      setNewCategory('Obecné');
      setNewDifficulty('medium');
      
      toast({
        title: "Slovíčko přidáno",
        description: `Slovíčko "${newWord}" bylo úspěšně přidáno.`,
      });
    }
  };

  return (
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
            <div className="flex items-center gap-2 mb-1">
              <Label htmlFor="example">Příklad použití</Label>
              {!isPremium && <PremiumBadge variant="compact" />}
            </div>
            <Textarea
              id="example"
              placeholder={isPremium ? "např. Der Hund bellt." : "Dostupné s Premium účtem"}
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              disabled={!isPremium}
              className={!isPremium ? "bg-amber-50 border-amber-200" : ""}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="category">Kategorie</Label>
                {!isPremium && <PremiumBadge variant="compact" />}
              </div>
              <Select
                value={isPremium ? newCategory : "Obecné"}
                onValueChange={setNewCategory}
                disabled={!isPremium}
              >
                <SelectTrigger className={!isPremium ? "bg-amber-50 border-amber-200" : ""}>
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
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="difficulty">Obtížnost</Label>
                {!isPremium && <PremiumBadge variant="compact" />}
              </div>
              <Select
                value={isPremium ? newDifficulty : "medium"}
                onValueChange={setNewDifficulty}
                disabled={!isPremium}
              >
                <SelectTrigger className={!isPremium ? "bg-amber-50 border-amber-200" : ""}>
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
  );
};

export default VocabularyAdd;
