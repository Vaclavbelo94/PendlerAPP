
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VocabularyItem } from '@/models/VocabularyItem';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface VocabularyEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentItem: VocabularyItem | null;
  onSave: (item: VocabularyItem) => void;
}

const VocabularyEdit: React.FC<VocabularyEditProps> = ({ open, onOpenChange, currentItem, onSave }) => {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [example, setExample] = useState('');
  const [category, setCategory] = useState('Obecné');
  const [difficulty, setDifficulty] = useState('medium');
  const { toast } = useToast();

  // Update state when currentItem changes
  React.useEffect(() => {
    if (currentItem) {
      setWord(currentItem.word);
      setTranslation(currentItem.translation);
      setExample(currentItem.example || '');
      setCategory(currentItem.category || 'Obecné');
      setDifficulty(currentItem.difficulty || 'medium');
    }
  }, [currentItem]);

  const handleSave = () => {
    if (currentItem && word.trim() && translation.trim()) {
      onSave({
        ...currentItem,
        word: word.trim(),
        translation: translation.trim(),
        example: example.trim() || undefined,
        category: category || 'Obecné',
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
      });
      
      toast({
        title: "Slovíčko upraveno",
        description: `Slovíčko "${word}" bylo úspěšně upraveno.`,
      });
      
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upravit slovíčko</DialogTitle>
          <DialogDescription>
            Upravte informace o slovíčku.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-word">Německé slovíčko *</Label>
            <Input
              id="edit-word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-translation">Český překlad *</Label>
            <Input
              id="edit-translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-example">Příklad použití</Label>
            <Textarea
              id="edit-example"
              value={example}
              onChange={(e) => setExample(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Kategorie</Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger id="edit-category">
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
              <Label htmlFor="edit-difficulty">Obtížnost</Label>
              <Select
                value={difficulty}
                onValueChange={setDifficulty}
              >
                <SelectTrigger id="edit-difficulty">
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zrušit
          </Button>
          <Button onClick={handleSave}>
            Uložit změny
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VocabularyEdit;
