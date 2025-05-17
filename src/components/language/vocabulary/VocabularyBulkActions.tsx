
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit2, Save, XCircle } from 'lucide-react';

interface VocabularyBulkActionsProps {
  vocabularyItems: VocabularyItem[];
  onDeleteItems: (ids: string[]) => void;
  onUpdateItems: (items: VocabularyItem[]) => void;
}

const VocabularyBulkActions: React.FC<VocabularyBulkActionsProps> = ({ 
  vocabularyItems,
  onDeleteItems,
  onUpdateItems
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState<string>("");
  const [bulkDifficulty, setBulkDifficulty] = useState<string>("");
  const { toast } = useToast();
  
  // Select/deselect all items
  const toggleSelectAll = () => {
    if (selectedItems.length === vocabularyItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(vocabularyItems.map(item => item.id));
    }
  };
  
  // Toggle selection of a single item
  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    onDeleteItems(selectedItems);
    setSelectedItems([]);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Slovíčka smazána",
      description: `Úspěšně smazáno ${selectedItems.length} slovíček.`,
    });
  };
  
  // Handle bulk edit
  const handleBulkEdit = () => {
    const itemsToUpdate = vocabularyItems
      .filter(item => selectedItems.includes(item.id))
      .map(item => ({
        ...item,
        category: bulkCategory || item.category,
        difficulty: (bulkDifficulty || item.difficulty) as 'easy' | 'medium' | 'hard'
      }));
    
    onUpdateItems(itemsToUpdate);
    setIsBulkEditDialogOpen(false);
    setBulkCategory("");
    setBulkDifficulty("");
    
    toast({
      title: "Slovíčka upravena",
      description: `Úspěšně upraveno ${selectedItems.length} slovíček.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hromadná správa slovíček</CardTitle>
        <CardDescription>
          Vyberte slovíčka pro hromadnou úpravu nebo smazání
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSelectAll}
            >
              {selectedItems.length === vocabularyItems.length
                ? "Odznačit vše"
                : "Vybrat vše"}
            </Button>
            
            <Dialog open={isBulkEditDialogOpen} onOpenChange={setIsBulkEditDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedItems.length === 0}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Upravit vybrané ({selectedItems.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Hromadná úprava</DialogTitle>
                  <DialogDescription>
                    Upravte vlastnosti pro {selectedItems.length} vybraných slovíček.
                    Prázdné hodnoty ponechají původní hodnoty beze změny.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kategorie</label>
                    <Select value={bulkCategory} onValueChange={setBulkCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ponechat původní" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ponechat původní</SelectItem>
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
                    <label className="text-sm font-medium">Obtížnost</label>
                    <Select value={bulkDifficulty} onValueChange={setBulkDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ponechat původní" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ponechat původní</SelectItem>
                        <SelectItem value="easy">Lehká</SelectItem>
                        <SelectItem value="medium">Střední</SelectItem>
                        <SelectItem value="hard">Těžká</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBulkEditDialogOpen(false)}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Zrušit
                  </Button>
                  <Button onClick={handleBulkEdit}>
                    <Save className="h-4 w-4 mr-1" />
                    Uložit změny
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={selectedItems.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Smazat vybrané ({selectedItems.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Potvrzení smazání</DialogTitle>
                  <DialogDescription>
                    Opravdu chcete smazat {selectedItems.length} vybraných slovíček? 
                    Tuto akci nelze vrátit.
                  </DialogDescription>
                </DialogHeader>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Zrušit
                  </Button>
                  <Button variant="destructive" onClick={handleBulkDelete}>
                    Smazat
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox 
                      checked={vocabularyItems.length > 0 && selectedItems.length === vocabularyItems.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Slovíčko</TableHead>
                  <TableHead>Překlad</TableHead>
                  <TableHead className="hidden md:table-cell">Kategorie</TableHead>
                  <TableHead className="hidden md:table-cell">Obtížnost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vocabularyItems.length > 0 ? (
                  vocabularyItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="p-2">
                        <Checkbox 
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.word}</TableCell>
                      <TableCell>{item.translation}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.category || "Obecné"}</TableCell>
                      <TableCell className="hidden md:table-cell capitalize">
                        {item.difficulty === 'easy' ? 'Lehká' :
                         item.difficulty === 'medium' ? 'Střední' :
                         item.difficulty === 'hard' ? 'Těžká' : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      Žádná slovíčka k zobrazení
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VocabularyBulkActions;
