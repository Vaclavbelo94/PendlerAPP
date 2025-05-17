
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, AlertCircle, FileJson, FileCsv } from 'lucide-react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';

interface VocabularyImportExportProps {
  vocabularyItems: VocabularyItem[];
  onImport: (items: VocabularyItem[]) => void;
}

const VocabularyImportExport: React.FC<VocabularyImportExportProps> = ({ vocabularyItems, onImport }) => {
  const { toast } = useToast();
  const [importError, setImportError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'json' | 'csv'>('json');

  // Export vocabulary items as JSON
  const handleExportJSON = () => {
    try {
      // Create a formatted JSON string with proper indentation
      const jsonData = JSON.stringify(vocabularyItems, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and click it
      const a = document.createElement('a');
      a.href = url;
      a.download = `german-vocabulary-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export úspěšný",
        description: `Exportováno ${vocabularyItems.length} slovíček ve formátu JSON.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Chyba exportu",
        description: "Při exportu slovíček došlo k chybě.",
        variant: "destructive",
      });
    }
  };

  // Export vocabulary items as CSV
  const handleExportCSV = () => {
    try {
      // Define CSV headers
      const headers = ['word', 'translation', 'example', 'category', 'difficulty', 'repetitionLevel', 'correctCount', 'incorrectCount'];
      
      // Convert items to CSV rows
      const rows = vocabularyItems.map(item => [
        item.word,
        item.translation,
        item.example || '',
        item.category || '',
        item.difficulty || '',
        item.repetitionLevel.toString(),
        item.correctCount.toString(),
        item.incorrectCount.toString()
      ].map(value => `"${value.replace(/"/g, '""')}"`).join(','));
      
      // Combine headers and rows
      const csvContent = [headers.join(','), ...rows].join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and click it
      const a = document.createElement('a');
      a.href = url;
      a.download = `german-vocabulary-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export úspěšný",
        description: `Exportováno ${vocabularyItems.length} slovíček ve formátu CSV.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Chyba exportu",
        description: "Při exportu slovíček došlo k chybě.",
        variant: "destructive",
      });
    }
  };

  // Import JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const items = JSON.parse(content);
        
        // Validate imported data
        if (!Array.isArray(items)) {
          throw new Error('Importovaný soubor nemá správný formát. Očekává se pole slovíček.');
        }
        
        // Basic validation of each item
        const validatedItems = items.map(item => {
          if (!item.word || !item.translation) {
            throw new Error('Některá slovíčka nemají vyplněné povinné pole (slovo nebo překlad).');
          }
          
          // Ensure all required properties exist
          return {
            id: item.id || `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            word: item.word,
            translation: item.translation,
            example: item.example || undefined,
            category: item.category || 'Obecné',
            difficulty: item.difficulty || undefined,
            repetitionLevel: parseInt(item.repetitionLevel) || 0,
            correctCount: parseInt(item.correctCount) || 0,
            incorrectCount: parseInt(item.incorrectCount) || 0,
            lastReviewed: item.lastReviewed || undefined,
            nextReviewDate: item.nextReviewDate || undefined
          };
        });
        
        onImport(validatedItems);
        
        toast({
          title: "Import úspěšný",
          description: `Importováno ${validatedItems.length} slovíček.`,
        });
        
        // Clear the input
        e.target.value = '';
      } catch (error: any) {
        console.error('Import failed:', error);
        setImportError(error.message || 'Při importu slovíček došlo k chybě.');
      }
    };
    
    reader.readAsText(file);
  };

  // Import CSV file
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const lines = content.split('\n');
        
        if (lines.length < 2) {
          throw new Error('CSV soubor je prázdný nebo obsahuje jen záhlaví.');
        }
        
        // Parse headers and check if they match expected format
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.+)"$/, '$1'));
        const requiredHeaders = ['word', 'translation'];
        
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          throw new Error(`CSV soubor nemá správný formát. Chybí sloupce: ${missingHeaders.join(', ')}`);
        }
        
        // Parse rows into vocabulary items
        const items: VocabularyItem[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          // Handle quoted CSV values properly
          let row: string[] = [];
          let inQuote = false;
          let currentValue = '';
          let line = lines[i];
          
          for (let j = 0; j < line.length; j++) {
            if (line[j] === '"' && (j === 0 || line[j-1] !== '\\')) {
              inQuote = !inQuote;
              if (!inQuote) {
                currentValue += line[j];
                row.push(currentValue.replace(/^"(.+)"$/, '$1').replace(/""/g, '"'));
                currentValue = '';
              } else {
                currentValue += line[j];
              }
            } else if (line[j] === ',' && !inQuote) {
              row.push(currentValue.replace(/^"(.+)"$/, '$1').replace(/""/g, '"'));
              currentValue = '';
            } else {
              currentValue += line[j];
            }
          }
          
          if (currentValue) {
            row.push(currentValue.replace(/^"(.+)"$/, '$1').replace(/""/g, '"'));
          }
          
          // Ensure row has the right number of columns
          while (row.length < headers.length) {
            row.push('');
          }
          
          // Map CSV values to object properties
          const item: any = {};
          headers.forEach((header, index) => {
            if (index < row.length) {
              item[header] = row[index];
            }
          });
          
          // Validate required fields
          if (!item.word || !item.translation) {
            continue; // Skip invalid rows
          }
          
          // Create a valid vocabulary item
          items.push({
            id: item.id || `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            word: item.word,
            translation: item.translation,
            example: item.example || undefined,
            category: item.category || 'Obecné',
            difficulty: item.difficulty as 'easy' | 'medium' | 'hard' | undefined,
            repetitionLevel: parseInt(item.repetitionLevel) || 0,
            correctCount: parseInt(item.correctCount) || 0,
            incorrectCount: parseInt(item.incorrectCount) || 0,
            lastReviewed: item.lastReviewed || undefined,
            nextReviewDate: item.nextReviewDate || undefined
          });
        }
        
        if (items.length === 0) {
          throw new Error('Nebylo nalezeno žádné platné slovíčko k importu.');
        }
        
        onImport(items);
        
        toast({
          title: "Import úspěšný",
          description: `Importováno ${items.length} slovíček.`,
        });
        
        // Clear the input
        e.target.value = '';
      } catch (error: any) {
        console.error('Import failed:', error);
        setImportError(error.message || 'Při importu slovíček došlo k chybě.');
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import a export slovíček</CardTitle>
        <CardDescription>
          Zálohujte svá slovíčka nebo importujte nová
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'json' | 'csv')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="json" className="flex items-center">
              <FileJson className="mr-2 h-4 w-4" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center">
              <FileCsv className="mr-2 h-4 w-4" />
              CSV
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="json" className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportJSON} 
                disabled={vocabularyItems.length === 0}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportovat jako JSON
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  id="json-import"
                  accept=".json"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImportJSON}
                />
                <Button asChild>
                  <label htmlFor="json-import" className="flex items-center cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Importovat JSON
                  </label>
                </Button>
              </div>
            </div>
            
            {importError && activeTab === 'json' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {importError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="text-sm text-muted-foreground">
              <p>JSON formát zachovává všechny informace o slovíčkách včetně údajů o učení.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="csv" className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportCSV} 
                disabled={vocabularyItems.length === 0}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportovat jako CSV
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  id="csv-import"
                  accept=".csv"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImportCSV}
                />
                <Button asChild>
                  <label htmlFor="csv-import" className="flex items-center cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Importovat CSV
                  </label>
                </Button>
              </div>
            </div>
            
            {importError && activeTab === 'csv' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {importError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="text-sm text-muted-foreground">
              <p>CSV formát je vhodný pro import/export slovíček z/do tabulkových editorů.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VocabularyImportExport;
