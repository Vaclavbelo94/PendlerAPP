import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox"
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { EmptyVocabularyState } from './vocabulary/EmptyVocabularyState';

const VocabularySection = () => {
  // State for managing vocabulary items
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [vocabularyItems, setVocabularyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useStandardizedToast();

  // Assuming we have a function to load vocabulary items
  useEffect(() => {
    // This is a placeholder - in a real implementation we would fetch from storage/database
    const loadVocabularyItems = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if we have items in local storage
        const storedItems = localStorage.getItem('vocabularyItems');
        if (storedItems) {
          setVocabularyItems(JSON.parse(storedItems));
        } else {
          setVocabularyItems([]);
        }
      } catch (error) {
        console.error('Error loading vocabulary items:', error);
        toast.error('Chyba při načítání slovíček');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVocabularyItems();
  }, [toast]);

  const handleAddNew = () => {
    // Implementation for adding a new vocabulary item
    console.log('Add new vocabulary item');
  };
  
  const handleImport = () => {
    // Implementation for importing vocabulary items
    console.log('Import vocabulary items');
  };
  
  const handleUseDefault = () => {
    // Load default vocabulary items
    import('@/data/defaultGermanVocabulary').then(module => {
      const defaultItems = module.default;
      setVocabularyItems(defaultItems);
      localStorage.setItem('vocabularyItems', JSON.stringify(defaultItems));
      toast.success('Základní slovník byl úspěšně načten');
    }).catch(err => {
      console.error('Failed to load default vocabulary:', err);
      toast.error('Chyba při načítání základního slovníku');
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (vocabularyItems.length === 0) {
    return (
      <EmptyVocabularyState 
        onAddNew={handleAddNew} 
        onImport={handleImport} 
        onUseDefault={handleUseDefault} 
      />
    );
  }

  // Function to add a new word to the vocabulary
  const addWord = () => {
    if (newWord && newTranslation) {
      const newItem = {
        id: Date.now(),
        word: newWord,
        translation: newTranslation,
        category: 'General',
        difficulty: 'Beginner',
        exampleSentence: '',
        isFavorite: false,
        isLearned: false,
      };
      setVocabularyItems([...vocabularyItems, newItem]);
      setNewWord('');
      setNewTranslation('');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Přidat nové slovíčko</CardTitle>
          <CardDescription>Zde můžete přidat nová slovíčka do svého slovníku</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="word">Slovo</Label>
              <Input
                type="text"
                id="word"
                placeholder="Nové slovo"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="translation">Překlad</Label>
              <Input
                type="text"
                id="translation"
                placeholder="Překlad slova"
                value={newTranslation}
                onChange={(e) => setNewTranslation(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={addWord">Přidat</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seznam slovíček</CardTitle>
          <CardDescription>Zde je seznam všech slovíček ve vašem slovníku</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Stav</TableHead>
                  <TableHead>Slovo</TableHead>
                  <TableHead>Překlad</TableHead>
                  <TableHead className="text-right">Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vocabularyItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <Checkbox id={item.id.toString()} />
                      <Label
                        htmlFor={item.id.toString()}
                        className="sr-only"
                      >
                        Souhlasím s podmínkami
                      </Label>
                    </TableCell>
                    <TableCell>{item.word}</TableCell>
                    <TableCell>{item.translation}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Otevřít menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Akce</DropdownMenuLabel>
                          <DropdownMenuItem>
                            Upravit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            Smazat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default VocabularySection;
