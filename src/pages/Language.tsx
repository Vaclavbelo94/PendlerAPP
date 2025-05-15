
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { grammarExercises } from "@/data/germanExercises";
import EnhancedGrammarExercise from "@/components/language/EnhancedGrammarExercise";
import VocabularySection from "@/components/language/VocabularySection";
import InteractiveQuiz from "@/components/language/InteractiveQuiz";
import { GrammarCategory } from "@/data/germanExercises";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScrollArea } from "@/components/ui/scroll-area";

const Language = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [activeTab, setActiveTab] = useState("grammar");
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  
  // Use media query to detect mobile screens
  const isMobile = useMediaQuery("xs");

  // Add console log to verify grammar exercises data structure
  console.log("Grammar Exercises:", grammarExercises);

  // Handle tab changes safely to prevent crashes from rapid clicking
  const handleTabChange = (value: string) => {
    // If we're already switching tabs, ignore additional clicks
    if (isTabSwitching) {
      return;
    }
    
    // Set flag to ignore additional clicks
    setIsTabSwitching(true);
    
    // Update the active tab
    setActiveTab(value);
    
    // Reset the flag after a short delay to prevent rapid clicks
    setTimeout(() => {
      setIsTabSwitching(false);
    }, 300);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    
    // Prohledávání všech kategorií a pravidel
    const results: any[] = [];
    
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
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Výuka německého jazyka</h1>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Hledání v gramatice</CardTitle>
            <CardDescription>
              Hledejte gramatická pravidla nebo příklady
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
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
              <Button onClick={handleSearch}>Hledat</Button>
            </div>
            
            {searchPerformed && searchResults.length === 0 && (
              <div className="mt-4 p-4 bg-slate-50 rounded-md text-center">
                Nebyly nalezeny žádné výsledky pro "{searchTerm}"
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Výsledky hledání:</h3>
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
        <TabsList className="w-full overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="grammar" className="flex-shrink-0">Gramatika</TabsTrigger>
          <TabsTrigger value="vocabulary" className="flex-shrink-0">Slovní zásoba</TabsTrigger>
          <TabsTrigger value="phrases" className="flex-shrink-0">Fráze</TabsTrigger>
          <TabsTrigger value="interactive" className="flex-shrink-0">Interaktivní cvičení</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grammar" className="space-y-8">
          {grammarExercises && grammarExercises.length > 0 ? (
            grammarExercises.map((category) => (
              <section key={category.id} id={`category-${category.id}`}>
                <EnhancedGrammarExercise category={category} />
              </section>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Nejsou k dispozici žádná gramatická cvičení.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="vocabulary">
          <VocabularySection />
        </TabsContent>
        
        <TabsContent value="phrases">
          <Card>
            <CardHeader>
              <CardTitle>Užitečné fráze</CardTitle>
              <CardDescription>
                Fráze pro běžné životní situace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Pozdravy a představení</h3>
                  <ScrollArea className={isMobile ? "max-w-full" : undefined}>
                    <div className={isMobile ? "min-w-[280px]" : undefined}>
                      <Table className="w-full">
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Guten Morgen!</TableCell>
                            <TableCell>Dobré ráno!</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Guten Tag!</TableCell>
                            <TableCell>Dobrý den!</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Guten Abend!</TableCell>
                            <TableCell>Dobrý večer!</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Ich heiße...</TableCell>
                            <TableCell>Jmenuji se...</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Wie heißt du?</TableCell>
                            <TableCell>Jak se jmenuješ?</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">V restauraci</h3>
                  <ScrollArea className={isMobile ? "max-w-full" : undefined}>
                    <div className={isMobile ? "min-w-[280px]" : undefined}>
                      <Table className="w-full">
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Ich möchte bestellen.</TableCell>
                            <TableCell>Chtěl/a bych si objednat.</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Die Speisekarte, bitte.</TableCell>
                            <TableCell>Jídelní lístek, prosím.</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Ein Glas Wasser, bitte.</TableCell>
                            <TableCell>Sklenici vody, prosím.</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Zahlen, bitte!</TableCell>
                            <TableCell>Platit, prosím!</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Das schmeckt sehr gut.</TableCell>
                            <TableCell>To je velmi chutné.</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">V práci</h3>
                  <ScrollArea className={isMobile ? "max-w-full" : undefined}>
                    <div className={isMobile ? "min-w-[280px]" : undefined}>
                      <Table className="w-full">
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Können Sie mir bitte helfen?</TableCell>
                            <TableCell>Můžete mi prosím pomoci?</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Ich verstehe nicht.</TableCell>
                            <TableCell>Nerozumím.</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Können Sie das wiederholen?</TableCell>
                            <TableCell>Můžete to zopakovat?</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Na nákupech</h3>
                  <ScrollArea className={isMobile ? "max-w-full" : undefined}>
                    <div className={isMobile ? "min-w-[280px]" : undefined}>
                      <Table className="w-full">
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Wie viel kostet das?</TableCell>
                            <TableCell>Kolik to stojí?</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Ich suche...</TableCell>
                            <TableCell>Hledám...</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Haben Sie das in einer anderen Größe?</TableCell>
                            <TableCell>Máte to v jiné velikosti?</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Ich nehme das.</TableCell>
                            <TableCell>Vezmu si to.</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interactive">
          <InteractiveQuiz />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Language;
