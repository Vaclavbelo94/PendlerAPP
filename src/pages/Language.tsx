
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Language, ArrowRight } from "lucide-react";

const LanguagePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <Language className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Výuka němčiny</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Zlepšete své znalosti němčiny pomocí praktických frází, odborné slovní zásoby
              a užitečné gramatiky zaměřené na potřeby pendlerů.
            </p>
          </div>
        </section>
        
        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="phrases" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="phrases">Fráze a slovní zásoba</TabsTrigger>
                <TabsTrigger value="work">Pracovní němčina</TabsTrigger>
                <TabsTrigger value="grammar">Gramatika</TabsTrigger>
              </TabsList>
              
              {/* Phrases Tab */}
              <TabsContent value="phrases">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Každodenní konverzace",
                      description: "Základní fráze pro běžnou komunikaci.",
                      examples: ["Dobrý den = Guten Tag", "Jak se máte? = Wie geht es Ihnen?", "Děkuji = Danke"]
                    },
                    {
                      title: "V obchodě",
                      description: "Užitečné výrazy pro nakupování.",
                      examples: ["Kolik to stojí? = Was kostet das?", "Hledám... = Ich suche...", "Platit budu kartou = Ich bezahle mit Karte"]
                    },
                    {
                      title: "Na cestách",
                      description: "Fráze pro cestování a dopravu.",
                      examples: ["Kde je zastávka? = Wo ist die Haltestelle?", "Jak se dostanu do...? = Wie komme ich nach...?", "Je tento vlak do...? = Fährt dieser Zug nach...?"]
                    },
                    {
                      title: "Nouzové situace",
                      description: "Důležité fráze pro nouzové situace.",
                      examples: ["Potřebuji pomoc = Ich brauche Hilfe", "Zavolejte lékaře = Rufen Sie einen Arzt", "Měl/a jsem nehodu = Ich hatte einen Unfall"]
                    },
                    {
                      title: "Čísla a čas",
                      description: "Výrazy pro vyjádření času a čísel.",
                      examples: ["Jedna, dva, tři = Eins, zwei, drei", "Kolik je hodin? = Wie spät ist es?", "V kolik hodin? = Um wie viel Uhr?"]
                    },
                    {
                      title: "Volný čas",
                      description: "Fráze pro volnočasové aktivity.",
                      examples: ["Co děláte rád/a? = Was machen Sie gern?", "Rád/a bych... = Ich würde gerne...", "Kde je restaurace? = Wo ist ein Restaurant?"]
                    }
                  ].map((category, i) => (
                    <Card key={i} className="h-full feature-card hover-scale">
                      <CardHeader>
                        <CardTitle>{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                          {category.examples.map((example, j) => (
                            <li key={j}>{example}</li>
                          ))}
                        </ul>
                        <Button variant="link" className="mt-4 p-0 flex items-center">
                          Více příkladů <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Work Tab */}
              <TabsContent value="work">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pracovní rozhovor</CardTitle>
                      <CardDescription>Klíčové fráze pro pohovor v němčině</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-3">
                        <li>Guten Tag, ich bin hier für das Vorstellungsgespräch. <br /><span className="text-muted-foreground">(Dobrý den, jsem zde na pohovor.)</span></li>
                        <li>Ich habe X Jahre Erfahrung als... <br /><span className="text-muted-foreground">(Mám X let zkušeností jako...)</span></li>
                        <li>Meine Stärken sind... <br /><span className="text-muted-foreground">(Moje silné stránky jsou...)</span></li>
                        <li>Ich kann gut im Team arbeiten. <br /><span className="text-muted-foreground">(Umím dobře pracovat v týmu.)</span></li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>V práci</CardTitle>
                      <CardDescription>Běžné fráze používané na pracovišti</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-3">
                        <li>Guten Morgen, wie geht's? <br /><span className="text-muted-foreground">(Dobré ráno, jak se máte?)</span></li>
                        <li>Könnten Sie mir bitte helfen? <br /><span className="text-muted-foreground">(Mohl/a byste mi prosím pomoci?)</span></li>
                        <li>Ich habe eine Frage zu... <br /><span className="text-muted-foreground">(Mám otázku ohledně...)</span></li>
                        <li>Wann ist die Deadline? <br /><span className="text-muted-foreground">(Kdy je uzávěrka?)</span></li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Odborná slovní zásoba</CardTitle>
                      <CardDescription>Dle nejčastějších oborů českých pendlerů</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Průmyslová výroba</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>die Maschine (stroj)</li>
                            <li>die Werkzeuge (nástroje)</li>
                            <li>die Schicht (směna)</li>
                            <li>die Sicherheitsvorschriften (bezpečnostní předpisy)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Zdravotnictví</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>der Patient (pacient)</li>
                            <li>die Pflege (péče)</li>
                            <li>die Untersuchung (vyšetření)</li>
                            <li>die Medikamente (léky)</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Administrativa a komunikace</CardTitle>
                      <CardDescription>Slovník pro formální komunikaci</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-3">
                        <li>Sehr geehrte Damen und Herren<br /><span className="text-muted-foreground">(Vážené dámy a pánové)</span></li>
                        <li>Mit freundlichen Grüßen<br /><span className="text-muted-foreground">(S přátelským pozdravem)</span></li>
                        <li>Ich möchte einen Termin vereinbaren.<br /><span className="text-muted-foreground">(Rád bych si domluvil schůzku.)</span></li>
                        <li>Vielen Dank für Ihre Unterstützung.<br /><span className="text-muted-foreground">(Děkuji Vám za Vaši podporu.)</span></li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-8 text-center">
                  <Button size="lg">
                    Kompletní slovník pro pendlery
                  </Button>
                </div>
              </TabsContent>
              
              {/* Grammar Tab */}
              <TabsContent value="grammar">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle>Základy německé gramatiky</CardTitle>
                    <CardDescription>
                      Přehled základních gramatických pravidel v němčině zaměřených na praktické použití
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Členy (die Artikel)</h3>
                        <div className="bg-slate-50 p-4 rounded-md mb-4">
                          <p className="mb-2">V němčině existují tři rody:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>der</strong> - mužský rod (der Mann - muž)</li>
                            <li><strong>die</strong> - ženský rod (die Frau - žena)</li>
                            <li><strong>das</strong> - střední rod (das Kind - dítě)</li>
                          </ul>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-3">Přítomný čas (Präsens)</h3>
                        <div className="bg-slate-50 p-4 rounded-md">
                          <p className="mb-2">Příklad časování slovesa "arbeiten" (pracovat):</p>
                          <ul className="space-y-1">
                            <li>ich arbeite (pracuji)</li>
                            <li>du arbeitest (pracuješ)</li>
                            <li>er/sie/es arbeitet (on/ona/ono pracuje)</li>
                            <li>wir arbeiten (pracujeme)</li>
                            <li>ihr arbeitet (pracujete)</li>
                            <li>sie/Sie arbeiten (oni pracují / Vy pracujete)</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Pády (die Fälle)</h3>
                        <div className="bg-slate-50 p-4 rounded-md mb-4">
                          <p className="mb-2">Němčina má čtyři pády:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Nominativ</strong> - 1. pád (kdo, co)</li>
                            <li><strong>Genitiv</strong> - 2. pád (koho, čeho)</li>
                            <li><strong>Dativ</strong> - 3. pád (komu, čemu)</li>
                            <li><strong>Akkusativ</strong> - 4. pád (koho, co)</li>
                          </ul>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-3">Modální slovesa</h3>
                        <div className="bg-slate-50 p-4 rounded-md">
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>können</strong> - moci, umět</li>
                            <li><strong>dürfen</strong> - smět</li>
                            <li><strong>müssen</strong> - muset</li>
                            <li><strong>sollen</strong> - mít (povinnost)</li>
                            <li><strong>wollen</strong> - chtít</li>
                            <li><strong>mögen</strong> - mít rád</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                      <Button size="lg">
                        Interaktivní gramatická cvičení
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Learning resources */}
        <section className="bg-slate-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Doporučené studijní zdroje</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Online kurzy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Duolingo - bezplatná aplikace pro učení jazyků</li>
                    <li>Babbel - placené kurzy zaměřené na konverzaci</li>
                    <li>Deutsche Welle - bezplatné kurzy od německé mediální společnosti</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Učebnice a příručky</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Němčina pro samouky</li>
                    <li>Themen aktuell - oblíbená učebnice němčiny</li>
                    <li>Langenscheidt kapesní slovník</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Jazykové výměny</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Tandem - najděte si partnera pro výměnu jazyka</li>
                    <li>Meetup - skupiny pro konverzaci v němčině</li>
                    <li>HelloTalk - aplikace pro jazykovou výměnu</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LanguagePage;
