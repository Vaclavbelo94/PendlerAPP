
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GrammarCategory } from "@/data/germanExercises";

interface SearchResult {
  categoryId: string;
  categoryName: string;
  ruleId: string;
  ruleName: string;
}

interface LanguageSearchBarProps {
  grammarExercises: GrammarCategory[];
}

const LanguageSearchBar: React.FC<LanguageSearchBarProps> = ({ grammarExercises }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    
    // Prohledávání všech kategorií a pravidel
    const results: SearchResult[] = [];
    
    // Treat grammarExercises as GrammarCategory[]
    grammarExercises.forEach(category => {
      category.rules.forEach(rule => {
        if (
          rule.name.toLowerCase().includes(term) || 
          rule.description.toLowerCase().includes(term)
        ) {
          results.push({
            categoryId: category.id,
            categoryName: category.name,
            ruleId: rule.id,
            ruleName: rule.name
          });
        }
        
        // Prohledávání příkladů
        rule.examples.forEach(example => {
          if (
            example.german.toLowerCase().includes(term) ||
            example.czech.toLowerCase().includes(term)
          ) {
            // Přidáme pouze pokud jsme ještě nepřidali toto pravidlo
            const exists = results.some(r => 
              r.categoryId === category.id && r.ruleId === rule.id
            );
            
            if (!exists) {
              results.push({
                categoryId: category.id,
                categoryName: category.name,
                ruleId: rule.id,
                ruleName: rule.name
              });
            }
          }
        });
      });
    });
    
    setSearchResults(results);
    setSearchPerformed(true);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults([]);
      setSearchPerformed(false);
    }
  }, [searchTerm]);

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Hledání v gramatice</CardTitle>
        <CardDescription>
          Hledejte gramatická pravidla nebo příklady
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Hledat pravidlo nebo příklad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button onClick={handleSearch} className="w-full sm:w-auto">Hledat</Button>
        </div>
        
        {searchPerformed && searchResults.length === 0 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-md text-center">
            Nebyly nalezeny žádné výsledky pro "{searchTerm}"
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Výsledky hledání:</h3>
            <ScrollArea className="max-h-[200px]">
              <ul className="space-y-1">
                {searchResults.map((result, index) => (
                  <li key={index}>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-left"
                      onClick={() => {
                        // Zde by bylo ideální přeskočit na konkrétní pravidlo
                        document.getElementById(`category-${result.categoryId}`)?.scrollIntoView({
                          behavior: "smooth"
                        });
                      }}
                    >
                      {result.categoryName} &rarr; {result.ruleName}
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguageSearchBar;
