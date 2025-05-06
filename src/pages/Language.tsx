import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Languages, ArrowRight } from "lucide-react";

const LanguagePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <Languages className="w-12 h-12 text-primary mx-auto mb-4" />
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
                      examples: [
                        "Dobrý den = Guten Tag", 
                        "Jak se máte? = Wie geht es Ihnen?", 
                        "Děkuji = Danke", 
                        "Dobré ráno = Guten Morgen", 
                        "Dobrý večer = Guten Abend", 
                        "Na shledanou = Auf Wiedersehen", 
                        "Ahoj = Hallo", 
                        "Prosím = Bitte", 
                        "Omlouvám se = Entschuldigung",
                        "Promiňte = Verzeihen Sie"
                      ]
                    },
                    {
                      title: "V obchodě",
                      description: "Užitečné výrazy pro nakupování.",
                      examples: [
                        "Kolik to stojí? = Was kostet das?", 
                        "Hledám... = Ich suche...", 
                        "Platit budu kartou = Ich bezahle mit Karte",
                        "Máte toto ve větší velikosti? = Haben Sie das in einer größeren Größe?",
                        "Kde najdu...? = Wo finde ich...?", 
                        "Chtěl/a bych tohle = Ich hätte gern das",
                        "Můžete mi pomoci? = Können Sie mir helfen?",
                        "Je to ve slevě? = Ist das im Angebot?",
                        "To je všechno = Das ist alles",
                        "Máte účtenku? = Haben Sie den Kassenbon?"
                      ]
                    },
                    {
                      title: "Na cestách",
                      description: "Fráze pro cestování a dopravu.",
                      examples: [
                        "Kde je zastávka? = Wo ist die Haltestelle?", 
                        "Jak se dostanu do...? = Wie komme ich nach...?", 
                        "Je tento vlak do...? = Fährt dieser Zug nach...?",
                        "Kdy přijede další autobus? = Wann kommt der nächste Bus?",
                        "Kolik stojí jízdenka? = Was kostet die Fahrkarte?",
                        "Můžete mi ukázat na mapě? = Können Sie mir auf der Karte zeigen?",
                        "Jsem ztracen/á = Ich habe mich verlaufen",
                        "Kde je nejbližší stanice metra? = Wo ist die nächste U-Bahn Station?",
                        "Je to daleko? = Ist es weit entfernt?",
                        "Mohu si zde koupit lístek? = Kann ich hier eine Fahrkarte kaufen?"
                      ]
                    },
                    {
                      title: "Nouzové situace",
                      description: "Důležité fráze pro nouzové situace.",
                      examples: [
                        "Potřebuji pomoc = Ich brauche Hilfe", 
                        "Zavolejte lékaře = Rufen Sie einen Arzt", 
                        "Měl/a jsem nehodu = Ich hatte einen Unfall",
                        "Zavolejte policii = Rufen Sie die Polizei",
                        "Kde je nejbližší nemocnice? = Wo ist das nächste Krankenhaus?",
                        "Je zde někdo, kdo mluví česky? = Spricht hier jemand Tschechisch?",
                        "Jsem alergický/á na... = Ich bin allergisch gegen...",
                        "Ztratil/a jsem své doklady = Ich habe meine Dokumente verloren",
                        "Ukradli mi peněženku = Meine Geldbörse wurde gestohlen",
                        "Potřebuji lék na... = Ich brauche ein Medikament gegen..."
                      ]
                    },
                    {
                      title: "Čísla a čas",
                      description: "Výrazy pro vyjádření času a čísel.",
                      examples: [
                        "Jedna, dva, tři = Eins, zwei, drei", 
                        "Kolik je hodin? = Wie spät ist es?", 
                        "V kolik hodin? = Um wie viel Uhr?",
                        "Čtyři, pět, šest = Vier, fünf, sechs",
                        "Sedm, osm, devět = Sieben, acht, neun",
                        "Deset, jedenáct, dvanáct = Zehn, elf, zwölf",
                        "Dvacet, třicet = Zwanzig, dreißig",
                        "Čtvrt hodiny = Viertelstunde",
                        "Půl hodiny = Halbe Stunde",
                        "Tři čtvrtě hodiny = Dreiviertelstunde"
                      ]
                    },
                    {
                      title: "Volný čas",
                      description: "Fráze pro volnočasové aktivity.",
                      examples: [
                        "Co děláte rád/a? = Was machen Sie gern?", 
                        "Rád/a bych... = Ich würde gerne...", 
                        "Kde je restaurace? = Wo ist ein Restaurant?",
                        "Kolik stojí vstupné? = Wie viel kostet der Eintritt?",
                        "Můžete doporučit nějakou kavárnu? = Können Sie ein Café empfehlen?",
                        "Rád/a sportuji = Ich treibe gern Sport",
                        "Rád/a čtu knihy = Ich lese gern Bücher",
                        "Zajímám se o umění = Ich interessiere mich für Kunst",
                        "Kdy začíná film? = Wann beginnt der Film?",
                        "Je zde wifi? = Gibt es hier WLAN?"
                      ]
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
                      <CardDescription>Klíčové fráze pro pohovor v němčině</CardHeader>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-3">
                        <li>Guten Tag, ich bin hier für das Vorstellungsgespräch. <br /><span className="text-muted-foreground">(Dobrý den, jsem zde na pohovor.)</span></li>
                        <li>Ich habe X Jahre Erfahrung als... <br /><span className="text-muted-foreground">(Mám X let zkušeností jako...)</span></li>
                        <li>Meine Stärken sind... <br /><span className="text-muted-foreground">(Moje silné stránky jsou...)</span></li>
                        <li>Ich kann gut im Team arbeiten. <br /><span className="text-muted-foreground">(Umím dobře pracovat v týmu.)</span></li>
                        <li>Ich bin flexibel und lernbereit. <br /><span className="text-muted-foreground">(Jsem flexibilní a ochotný/á se učit.)</span></li>
                        <li>Ich möchte mich beruflich weiterentwickeln. <br /><span className="text-muted-foreground">(Chci se profesně rozvíjet.)</span></li>
                        <li>Wann könnte ich anfangen? <br /><span className="text-muted-foreground">(Kdy bych mohl/a nastoupit?)</span></li>
                        <li>Wie hoch ist das Gehalt? <br /><span className="text-muted-foreground">(Jaká je výše platu?)</span></li>
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
                        <li>Ich brauche Urlaub. <br /><span className="text-muted-foreground">(Potřebuji dovolenou.)</span></li>
                        <li>Das ist erledigt. <br /><span className="text-muted-foreground">(To je hotovo.)</span></li>
                        <li>Ich arbeite heute von zu Hause. <br /><span className="text-muted-foreground">(Dnes pracuji z domova.)</span></li>
                        <li>Wir haben heute eine Besprechung. <br /><span className="text-muted-foreground">(Dnes máme poradu.)</span></li>
                        <li>Ich bin krank und kann nicht zur Arbeit kommen. <br /><span className="text-muted-foreground">(Jsem nemocný/á a nemohu přijít do práce.)</span></li>
                        <li>Bitte unterschreiben Sie hier. <br /><span className="text-muted-foreground">(Prosím, podepište se zde.)</span></li>
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
                            <li>der Arbeitsschutz (ochrana práce)</li>
                            <li>die Produktion (výroba)</li>
                            <li>die Qualitätskontrolle (kontrola kvality)</li>
                            <li>das Fließband (montážní linka)</li>
                            <li>die Arbeitskleidung (pracovní oděv)</li>
                            <li>das Ersatzteil (náhradní díl)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Zdravotnictví</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>der Patient (pacient)</li>
                            <li>die Pflege (péče)</li>
                            <li>die Untersuchung (vyšetření)</li>
                            <li>die Medikamente (léky)</li>
                            <li>das Krankenhaus (nemocnice)</li>
                            <li>die Sprechstunde (ordinační hodiny)</li>
                            <li>der Arzt / die Ärztin (lékař / lékařka)</li>
                            <li>die Krankenschwester (zdravotní sestra)</li>
                            <li>die Notaufnahme (pohotovost)</li>
                            <li>das Rezept (recept)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Služby a gastro</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>der Kunde / die Kundin (zákazník / zákaznice)</li>
                            <li>die Bestellung (objednávka)</li>
                            <li>die Rechnung (účet)</li>
                            <li>der Tisch (stůl)</li>
                            <li>die Speisekarte (jídelní lístek)</li>
                            <li>die Reservierung (rezervace)</li>
                            <li>die Bedienung (obsluha)</li>
                            <li>das Trinkgeld (spropitné)</li>
                            <li>die Öffnungszeiten (otevírací doba)</li>
                            <li>der Rabatt (sleva)</li>
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
                        <li>Im Anhang finden Sie...<br /><span className="text-muted-foreground">(V příloze naleznete...)</span></li>
                        <li>Ich bestätige hiermit den Erhalt Ihrer E-Mail.<br /><span className="text-muted-foreground">(Tímto potvrzuji přijetí Vašeho e-mailu.)</span></li>
                        <li>Ich bitte um eine Rückmeldung bis zum...<br /><span className="text-muted-foreground">(Prosím o zpětnou vazbu do...)</span></li>
                        <li>Bezugnehmend auf unser Telefonat...<br /><span className="text-muted-foreground">(S odkazem na náš telefonický rozhovor...)</span></li>
                        <li>Ich freue mich auf unsere Zusammenarbeit.<br /><span className="text-muted-foreground">(Těším se na naši spolupráci.)</span></li>
                        <li>Bei Fragen stehe ich Ihnen gerne zur Verfügung.<br /><span className="text-muted-foreground">(V případě dotazů jsem Vám rád k dispozici.)</span></li>
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
                          <p className="mt-4 mb-2">Další příklady:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><strong>der</strong> - Tisch (stůl), Wagen (vůz), Computer (počítač)</li>
                            <li><strong>die</strong> - Tür (dveře), Arbeit (práce), Tasche (taška)</li>
                            <li><strong>das</strong> - Haus (dům), Buch (kniha), Auto (auto)</li>
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
                          
                          <p className="mt-4 mb-2">Příklad časování slovesa "sein" (být):</p>
                          <ul className="space-y-1">
                            <li>ich bin (jsem)</li>
                            <li>du bist (jsi)</li>
                            <li>er/sie/es ist (on/ona/ono je)</li>
                            <li>wir sind (jsme)</li>
                            <li>ihr seid (jste)</li>
                            <li>sie/Sie sind (oni jsou / Vy jste)</li>
                          </ul>
                          
                          <p className="mt-4 mb-2">Příklad časování slovesa "haben" (mít):</p>
                          <ul className="space-y-1">
                            <li>ich habe (mám)</li>
                            <li>du hast (máš)</li>
                            <li>er/sie/es hat (on/ona/ono má)</li>
                            <li>wir haben (máme)</li>
                            <li>ihr habt (máte)</li>
                            <li>sie/Sie haben (oni mají / Vy máte)</li>
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
                          
                          <p className="mt-4 mb-2">Příklady změn členů v pádech:</p>
                          <table className="mt-3 w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left pb-2">Pád</th>
                                <th className="text-left pb-2">Mužský</th>
                                <th className="text-left pb-2">Ženský</th>
                                <th className="text-left pb-2">Střední</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-2">Nominativ</td>
                                <td>der Mann</td>
                                <td>die Frau</td>
                                <td>das Kind</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">Genitiv</td>
                                <td>des Mannes</td>
                                <td>der Frau</td>
                                <td>des Kindes</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">Dativ</td>
                                <td>dem Mann</td>
                                <td>der Frau</td>
                                <td>dem Kind</td>
                              </tr>
                              <tr>
                                <td className="py-2">Akkusativ</td>
                                <td>den Mann</td>
                                <td>die Frau</td>
                                <td>das Kind</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-3">Modální slovesa</h3>
                        <div className="bg-slate-50 p-4 rounded-md">
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>können</strong> - moci, umět
                              <p className="text-sm">Ich kann Deutsch sprechen. (Umím mluvit německy.)</p>
                            </li>
                            <li><strong>dürfen</strong> - smět
                              <p className="text-sm">Darf ich hier rauchen? (Smím zde kouřit?)</p>
                            </li>
                            <li><strong>müssen</strong> - muset
                              <p className="text-sm">Ich muss arbeiten. (Musím pracovat.)</p>
                            </li>
                            <li><strong>sollen</strong> - mít (povinnost)
                              <p className="text-sm">Du sollst pünktlich sein. (Měl bys být dochvilný.)</p>
                            </li>
                            <li><strong>wollen</strong> - chtít
                              <p className="text-sm">Ich will nach Deutschland fahren. (Chci jet do Německa.)</p>
                            </li>
                            <li><strong>mögen</strong> - mít rád
                              <p className="text-sm">Ich mag Kaffee. (Mám rád kávu.)</p>
                            </li>
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
                    <li>Memrise - aplikace s intenzivním učením slovní zásoby</li>
                    <li>Busuu - kurzy s komunitou rodilých mluvčích</li>
                    <li>Goethe-Institut - oficiální kurzy německého jazyka</li>
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
                    <li>Schritte international - učebnice zaměřená na komunikaci</li>
                    <li>Sprechen Sie Deutsch? - učebnice pro začátečníky</li>
                    <li>PONS slovník a gramatika v jednom</li>
                    <li>Menschen - moderní učební metoda</li>
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
                    <li>iTalki - najděte si online učitele nebo kamarády pro konverzaci</li>
                    <li>Speaky - sociální síť pro výměnu jazyků</li>
                    <li>ConversationExchange - platforma pro hledání konverzačních partnerů</li>
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
