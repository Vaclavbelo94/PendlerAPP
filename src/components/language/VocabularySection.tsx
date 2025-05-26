
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
import { MoreHorizontal } from "lucide-react"
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
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';
import FastLoadingFallback from '@/components/common/FastLoadingFallback';

// Lazy load with error handling
const EmptyVocabularyState = React.lazy(() => 
  import('./vocabulary/EmptyVocabularyState').then(module => ({ 
    default: module.EmptyVocabularyState 
  })).catch(err => {
    console.error('Failed to load EmptyVocabularyState:', err);
    return { 
      default: ({ onAddNew, onImport, onUseDefault }) => (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">Slovní zásoba se nenačetla</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={onAddNew}>Přidat slovíčko</Button>
            <Button variant="outline" onClick={onUseDefault}>Základní slovník</Button>
          </div>
        </div>
      )
    };
  })
);

const VocabularySection = () => {
  // State for managing vocabulary items
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [vocabularyItems, setVocabularyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useStandardizedToast();

  // Fast initialization with timeout
  useEffect(() => {
    const loadVocabularyItems = async () => {
      try {
        setIsLoading(true);
        
        // Quick check for stored items first
        const storedItems = localStorage.getItem('vocabularyItems');
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          setVocabularyItems(parsedItems);
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        // Simulate API call with timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 2000)
        );
        
        const loadPromise = new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          await Promise.race([loadPromise, timeoutPromise]);
          setVocabularyItems([]);
        } catch (timeoutError) {
          // Timeout - continue with empty state
          setVocabularyItems([]);
        }
        
      } catch (error) {
        console.error('Error loading vocabulary items:', error);
        setVocabularyItems([]);
        toast({
          title: 'Problém s načítáním',
          description: 'Slovní zásoba se načetla v režimu offline',
          variant: 'default'
        });
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    // Small delay to prevent flash
    const timer = setTimeout(loadVocabularyItems, 100);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleAddNew = () => {
    console.log('Add new vocabulary item');
  };
  
  const handleImport = () => {
    console.log('Import vocabulary items');
  };
  
  const handleUseDefault = async () => {
    try {
      setIsLoading(true);
      const module = await import('@/data/defaultGermanVocabulary');
      const defaultItems = module.defaultGermanVocabulary || [];
      setVocabularyItems(defaultItems);
      localStorage.setItem('vocabularyItems', JSON.stringify(defaultItems));
      toast({
        title: 'Základní slovník byl úspěšně načten',
        variant: 'success'
      });
    } catch (err) {
      console.error('Failed to load default vocabulary:', err);
      toast({
        title: 'Chyba při načítání základního slovníku',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading only if not initialized
  if (!isInitialized && isLoading) {
    return <FastLoadingFallback message="Načítám slovní zásobu..." />;
  }

  if (isInitialized && vocabularyItems.length === 0) {
    return (
      <ErrorBoundaryWithFallback>
        <React.Suspense fallback={<FastLoadingFallback message="Načítám možnosti..." />}>
          <EmptyVocabularyState 
            onAddNew={handleAddNew} 
            onImport={handleImport} 
            onUseDefault={handleUseDefault} 
          />
        </React.Suspense>
      </ErrorBoundaryWithFallback>
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
      const updatedItems = [...vocabularyItems, newItem];
      setVocabularyItems(updatedItems);
      localStorage.setItem('vocabularyItems', JSON.stringify(updatedItems));
      setNewWord('');
      setNewTranslation('');
      
      toast({
        title: 'Slovíčko bylo přidáno',
        variant: 'success'
      });
    }
  };

  return (
    <ErrorBoundaryWithFallback>
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
            <Button onClick={addWord} disabled={!newWord || !newTranslation}>
              Přidat
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seznam slovíček</CardTitle>
            <CardDescription>Zde je seznam všech slovíček ve vašem slovníku</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <FastLoadingFallback minimal />
            ) : (
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
                            Označit jako naučené
                          </Label>
                        </TableCell>
                        <TableCell>{item.word}</TableCell>
                        <TableCell>{item.translation}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Otevřít menu</span>
                                <MoreHorizontal className="h-4 w-4" />
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
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundaryWithFallback>
  );
};

export default VocabularySection;
