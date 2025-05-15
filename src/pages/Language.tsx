
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

const Language = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Add console log to verify grammar exercises data structure
  console.log("Grammar Exercises:", grammarExercises);

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
      
      <Tabs defaultValue="grammar" className="space-y-8">
        <TabsList>
          <TabsTrigger value="grammar">Gramatika</TabsTrigger>
          <TabsTrigger value="vocabulary">Slovní zásoba</TabsTrigger>
          <TabsTrigger value="phrases">Fráze</TabsTrigger>
          <TabsTrigger value="interactive">Interaktivní cvičení</TabsTrigger>
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
                  <ul className="space-y-2">
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Guten Morgen!</div>
                        <div>Dobré ráno!</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Guten Tag!</div>
                        <div>Dobrý den!</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Guten Abend!</div>
                        <div>Dobrý večer!</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Ich heiße...</div>
                        <div>Jmenuji se...</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Wie heißt du?</div>
                        <div>Jak se jmenuješ?</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">V restauraci</h3>
                  <ul className="space-y-2">
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Ich möchte bestellen.</div>
                        <div>Chtěl/a bych si objednat.</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Die Speisekarte, bitte.</div>
                        <div>Jídelní lístek, prosím.</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Ein Glas Wasser, bitte.</div>
                        <div>Sklenici vody, prosím.</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Zahlen, bitte!</div>
                        <div>Platit, prosím!</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Das schmeckt sehr gut.</div>
                        <div>To je velmi chutné.</div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">V práci</h3>
                  <ul className="space-y-2">
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Können Sie mir bitte helfen?</div>
                        <div>Můžete mi prosím pomoci?</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Ich verstehe nicht.</div>
                        <div>Nerozumím.</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Können Sie das wiederholen?</div>
                        <div>Můžete to zopakovat?</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Na nákupech</h3>
                  <ul className="space-y-2">
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Wie viel kostet das?</div>
                        <div>Kolik to stojí?</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Ich suche...</div>
                        <div>Hledám...</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Haben Sie das in einer anderen Größe?</div>
                        <div>Máte to v jiné velikosti?</div>
                      </div>
                    </li>
                    <li className="p-2 bg-slate-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Ich nehme das.</div>
                        <div>Vezmu si to.</div>
                      </div>
                    </li>
                  </ul>
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
