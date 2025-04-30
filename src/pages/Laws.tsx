
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LawsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <svg className="w-12 h-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <h1 className="text-4xl font-bold mb-4">Přehled zákonů</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Srozumitelné informace o německém pracovním právu, daních, sociálním a zdravotním pojištění 
              a dalších tématech důležitých pro české pendlery.
            </p>
          </div>
        </section>
        
        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="work-law" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="work-law">Pracovní právo</TabsTrigger>
                <TabsTrigger value="insurance">Pojištění</TabsTrigger>
                <TabsTrigger value="taxes">Daně</TabsTrigger>
                <TabsTrigger value="family">Rodinné příspěvky</TabsTrigger>
              </TabsList>
              
              {/* Work Law Tab */}
              <TabsContent value="work-law">
                <Card>
                  <CardHeader>
                    <CardTitle>Německé pracovní právo</CardTitle>
                    <CardDescription>
                      Základní informace o pracovněprávních vztazích v Německu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Pracovní smlouva (Arbeitsvertrag)</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p>
                              Pracovní smlouva v Německu by měla obsahovat následující náležitosti:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Jméno a adresu zaměstnavatele a zaměstnance</li>
                              <li>Datum nástupu do práce</li>
                              <li>Popis pracovní činnosti</li>
                              <li>Místo výkonu práce</li>
                              <li>Výši mzdy a způsob jejího vyplácení</li>
                              <li>Pracovní dobu</li>
                              <li>Délku dovolené</li>
                              <li>Výpovědní lhůty</li>
                              <li>Odkaz na platné kolektivní smlouvy, pokud existují</li>
                            </ul>
                            <p>
                              Smlouva může být na dobu určitou (befristeter Arbeitsvertrag) nebo neurčitou (unbefristeter Arbeitsvertrag). 
                              Doporučuje se mít smlouvu v písemné podobě, i když ústní dohoda je také právně závazná.
                            </p>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                              <p className="font-medium">Důležité:</p>
                              <p>Vždy požadujte písemnou pracovní smlouvu a před podpisem si ji důkladně přečtěte nebo nechte přeložit, pokud nerozumíte německy dostatečně dobře.</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Pracovní doba a přesčasy</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p>
                              Podle německého zákona o pracovní době (Arbeitszeitgesetz) je stanoveno:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Maximální pracovní doba je 8 hodin denně, může být prodloužena až na 10 hodin, pokud v průměru za 6 měsíců nepřesáhne 8 hodin denně.</li>
                              <li>Minimální odpočinek mezi dvěma pracovními dny musí být 11 hodin.</li>
                              <li>Při pracovní době delší než 6 hodin musí být poskytnuta přestávka v délce nejméně 30 minut.</li>
                              <li>V neděli a o svátcích je práce obecně zakázána, existují však výjimky pro určitá odvětví.</li>
                            </ul>
                            <p>
                              Přesčasy (Überstunden) musí být buď zaplaceny nebo kompenzovány volnem. Konkrétní podmínky by měly být uvedeny v pracovní smlouvě nebo kolektivní dohodě.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Dovolená a volno</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p>
                              Podle německého zákona o dovolené (Bundesurlaubsgesetz) má každý zaměstnanec nárok na:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Minimálně 24 pracovních dnů placené dovolené za rok (při 6denním pracovním týdnu), což odpovídá 20 dnům při 5denním pracovním týdnu.</li>
                              <li>Plnou dovolenou může zaměstnanec čerpat po 6 měsících trvání pracovního poměru.</li>
                            </ul>
                            <p>
                              Mnoho zaměstnavatelů v Německu nabízí více než zákonné minimum, často 25-30 dnů dovolené ročně.
                            </p>
                            <p>
                              Kromě dovolené existují i další důvody pro placené volno:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Nemoc (Krankheit) - při prokázání lékařským potvrzením je zaměstnavatel povinen vyplácet mzdu po dobu až 6 týdnů</li>
                              <li>Mateřská dovolená (Mutterschutz) - 6 týdnů před a 8 týdnů po porodu</li>
                              <li>Rodičovská dovolená (Elternzeit) - až do 3 let věku dítěte</li>
                              <li>Osobní důvody jako svatba, úmrtí v rodině atd. (podle kolektivních smluv nebo firemních zvyklostí)</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-4">
                        <AccordionTrigger>Výpověď a ochrana zaměstnance</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p>
                              V Německu platí poměrně přísná pravidla pro ukončení pracovního poměru:
                            </p>
                            <h4 className="font-semibold mt-4">Výpovědní lhůty</h4>
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Základní zákonná výpovědní lhůta je 4 týdny k 15. dni nebo ke konci kalendářního měsíce.</li>
                              <li>S délkou zaměstnání se výpovědní lhůta pro zaměstnavatele prodlužuje (po 2 letech na 1 měsíc, po 5 letech na 2 měsíce, atd.).</li>
                              <li>Zkušební doba (Probezeit) obvykle trvá až 6 měsíců a během ní může být výpovědní lhůta zkrácena na 2 týdny.</li>
                            </ul>
                            
                            <h4 className="font-semibold mt-4">Ochrana proti výpovědi</h4>
                            <p>
                              Zaměstnavatel nemůže dát výpověď bezdůvodně. Důvody mohou být:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Provozní důvody (betriebsbedingt) - např. rušení pracovní pozice</li>
                              <li>Důvody spojené s chováním zaměstnance (verhaltensbedingt) - např. opakované porušování pracovních povinností</li>
                              <li>Osobní důvody (personenbedingt) - např. dlouhodobá neschopnost vykonávat práci</li>
                            </ul>
                            
                            <p>
                              Zvláštní ochranu proti výpovědi mají:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Těhotné ženy a matky až do 4 měsíců po porodu</li>
                              <li>Zaměstnanci na rodičovské dovolené</li>
                              <li>Členové podnikové rady (Betriebsrat)</li>
                              <li>Těžce zdravotně postižení</li>
                            </ul>
                            
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                              <p className="font-medium">Důležité pro pendlery:</p>
                              <p>Pokud dostanete výpověď, máte pouze 3 týdny na to, abyste podali žalobu na neplatnost výpovědi (Kündigungsschutzklage).</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-5">
                        <AccordionTrigger>Minimální mzda a platové podmínky</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p>
                              V Německu platí zákonná minimální mzda (Mindestlohn), která je pravidelně upravována. Od 1. ledna 2025 činí 12,82 EUR za hodinu (aktualizujte dle skutečnosti).
                            </p>
                            
                            <h4 className="font-semibold mt-4">Další informace o odměňování:</h4>
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Mzda musí být vyplácena nejpozději poslední pracovní den měsíce následujícího po měsíci, ve kterém byla práce vykonána.</li>
                              <li>Zaměstnavatel je povinen vydat výplatní pásku (Lohnabrechnung).</li>
                              <li>Příplatky za práci o víkendech, svátcích nebo v noci nejsou zákonem stanoveny, ale často jsou upraveny v kolektivních smlouvách.</li>
                              <li>Vánoční prémie (Weihnachtsgeld) a dovolenkové (Urlaubsgeld) nejsou povinné, ale jsou běžnou praxí v mnoha firmách.</li>
                            </ul>
                            
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                              <p className="font-medium">Pro pendlery:</p>
                              <p>Jako pendler máte nárok na stejné platové podmínky jako němečtí zaměstnanci. Diskriminace na základě státní příslušnosti je zakázána.</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <div className="mt-8 text-center">
                      <Button>
                        Stáhnout přehled pracovního práva v PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Insurance Tab */}
              <TabsContent value="insurance">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sociální pojištění</CardTitle>
                      <CardDescription>
                        Informace o sociálním pojištění pro pendlery
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>
                          Jako pendler pracující v Německu podléháte zpravidla německému systému sociálního pojištění, který zahrnuje:
                        </p>
                        
                        <ul className="list-disc pl-5 space-y-3">
                          <li>
                            <strong>Důchodové pojištění (Rentenversicherung)</strong>
                            <p className="text-sm text-muted-foreground">Povinné pojištění, ze kterého se vyplácí starobní důchody. Sazba činí 18,6% z hrubé mzdy (polovina zaměstnanec, polovina zaměstnavatel).</p>
                          </li>
                          <li>
                            <strong>Pojištění pro případ nezaměstnanosti (Arbeitslosenversicherung)</strong>
                            <p className="text-sm text-muted-foreground">Sazba činí 2,5% z hrubé mzdy (polovina zaměstnanec, polovina zaměstnavatel).</p>
                          </li>
                          <li>
                            <strong>Pojištění dlouhodobé péče (Pflegeversicherung)</strong>
                            <p className="text-sm text-muted-foreground">Kryje náklady na dlouhodobou péči. Sazba je 3,05% (3,4% pro bezdětné osoby nad 23 let).</p>
                          </li>
                        </ul>
                        
                        <h4 className="font-semibold mt-6">Důležité formuláře</h4>
                        <ul className="list-disc pl-5 space-y-3">
                          <li>
                            <strong>Formulář A1</strong>
                            <p className="text-sm text-muted-foreground">Potvrzuje, kde jste pojištěn, pokud pracujete ve více zemích EU současně. Je důležitý pro pendlery, kteří kromě Německa pracují i v ČR.</p>
                          </li>
                          <li>
                            <strong>Formulář S1</strong>
                            <p className="text-sm text-muted-foreground">Umožňuje vám a vašim rodinným příslušníkům využívat zdravotní péči v ČR, přestože jste pojištěni v Německu.</p>
                          </li>
                          <li>
                            <strong>Formulář U1</strong>
                            <p className="text-sm text-muted-foreground">Potvrzuje vaše pojistné doby v Německu pro účely dávek v nezaměstnanosti v ČR.</p>
                          </li>
                        </ul>
                        
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                          <p className="font-medium">Pro pendlery:</p>
                          <p>Formuláře S1 a U1 jsou klíčové dokumenty. S1 si vyžádejte od své německé zdravotní pojišťovny a následně jej předložte české zdravotní pojišťovně.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Zdravotní pojištění</CardTitle>
                      <CardDescription>
                        Systém zdravotního pojištění pro pendlery
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>
                          V Německu je zdravotní pojištění (Krankenversicherung) povinné pro všechny. Existují dva systémy:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-primary-50 p-4 rounded">
                            <h4 className="font-semibold mb-2">Veřejné pojištění (GKV)</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Povinné pro většinu zaměstnanců</li>
                              <li>Sazba cca 14,6% + dodatečný příspěvek</li>
                              <li>Zaměstnavatel hradí polovinu</li>
                              <li>Automatické pojištění rodinných příslušníků bez vlastního příjmu</li>
                            </ul>
                          </div>
                          
                          <div className="bg-secondary-50 p-4 rounded">
                            <h4 className="font-semibold mb-2">Soukromé pojištění (PKV)</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Volitelné pro osoby s příjmem nad 69.300 EUR ročně</li>
                              <li>Individuální sazby podle věku a zdravotního stavu</li>
                              <li>Zaměstnavatel přispívá maximálně 50% z částky odpovídající GKV</li>
                              <li>Rodinní příslušníci musí být pojištěni zvlášť</li>
                            </ul>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold mt-6">Specifika pro pendlery</h4>
                        <ul className="list-disc pl-5 space-y-3">
                          <li>
                            <p>Jako pendler pracující v Německu musíte být pojištěn v německém systému zdravotního pojištění.</p>
                          </li>
                          <li>
                            <p>S formulářem S1 můžete využívat zdravotní péči i v České republice.</p>
                          </li>
                          <li>
                            <p>Vaši rodinní příslušníci, kteří žijí v ČR a nemají vlastní příjem, mohou být pojištěni prostřednictvím vašeho německého pojištění.</p>
                          </li>
                        </ul>
                        
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                          <p className="font-medium">Tip pro pendlery:</p>
                          <p>V případě nemoci máte jako zaměstnanec v Německu nárok na pokračování výplaty mzdy (Lohnfortzahlung) po dobu až 6 týdnů. Potom nastupuje nemocenské od zdravotní pojišťovny (Krankengeld).</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Taxes Tab */}
              <TabsContent value="taxes">
                <Card>
                  <CardHeader>
                    <CardTitle>Daňová problematika pro pendlery</CardTitle>
                    <CardDescription>
                      Informace o zdanění příjmů českých pendlerů pracujících v Německu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Základní princip zdanění pendlerů</h3>
                      <p>
                        Zdanění příjmů pendlerů se řídí Smlouvou o zamezení dvojího zdanění mezi Českou republikou a Německem. 
                        Existují dvě hlavní skupiny pendlerů z hlediska daňové rezidence:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-primary-50 p-4 rounded-md">
                          <h4 className="font-semibold mb-2">Hraniční pendleři (Grenzgänger)</h4>
                          <p className="mb-2">
                            Jsou osoby, které:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Pracují v německém příhraničí (do 30 km od hranic)</li>
                            <li>Denně se vracejí domů do ČR nebo vyjíždějí maximálně na 45 dnů v roce</li>
                            <li>Bydlí v českém příhraničí (do 30 km od hranic)</li>
                          </ul>
                          <p className="mt-2">
                            <strong>Zdanění:</strong> Příjmy jsou zdaněny primárně v ČR. V Německu může být sražena daň max. 4,5%.
                          </p>
                        </div>
                        
                        <div className="bg-secondary-50 p-4 rounded-md">
                          <h4 className="font-semibold mb-2">Běžní pendleři</h4>
                          <p className="mb-2">
                            Jsou osoby, které nesplňují podmínky pro hraniční pendlery, tedy:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Pracují dále než 30 km od hranic</li>
                            <li>Vyjíždějí na více než 45 dnů v roce</li>
                            <li>Bydlí dále než 30 km od hranic</li>
                          </ul>
                          <p className="mt-2">
                            <strong>Zdanění:</strong> Příjmy jsou zdaněny v Německu. V ČR se tyto příjmy pouze započítávají pro stanovení progresivní sazby daně z ostatních příjmů (metoda vynětí s výhradou progrese).
                          </p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold mt-8">Daňové třídy v Německu</h3>
                      <p>
                        V Německu existuje 6 daňových tříd (Steuerklassen), které ovlivňují výši srážené daně:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 my-4">
                        <li><strong>Třída I:</strong> Svobodní, rozvedení, ovdovělí (bez dětí nebo s dětmi v jiné domácnosti)</li>
                        <li><strong>Třída II:</strong> Svobodní, rozvedení nebo ovdovělí rodiče samoživitelé</li>
                        <li><strong>Třída III:</strong> Ženatí/vdané s výrazně vyšším příjmem než partner (partner má třídu V)</li>
                        <li><strong>Třída IV:</strong> Ženatí/vdané s podobnými příjmy jako partner</li>
                        <li><strong>Třída V:</strong> Ženatí/vdané s výrazně nižším příjmem než partner (partner má třídu III)</li>
                        <li><strong>Třída VI:</strong> Pro osoby s více zaměstnáními (aplikuje se na druhé a další zaměstnání)</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold">Daňové přiznání v Německu</h3>
                      <p>
                        Jako pendler pracující v Německu máte možnost a někdy i povinnost podat daňové přiznání (Einkommensteuererklärung):
                      </p>
                      <ul className="list-disc pl-5 space-y-2 my-4">
                        <li>Pendleři, kteří jsou v Německu daňovými nerezidenty, mají obvykle povinnost podat daňové přiznání.</li>
                        <li>Termín pro podání je obvykle 31. července následujícího roku (lze prodloužit).</li>
                        <li>Přiznání lze podat elektronicky přes systém ELSTER nebo pomocí formulářů.</li>
                        <li>V daňovém přiznání můžete uplatnit mnoho odpočtů a slev, které mohou výrazně snížit vaši daňovou povinnost.</li>
                      </ul>
                      
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                        <p className="font-medium">Důležité pro pendlery:</p>
                        <p>Podání daňového přiznání v Německu je často výhodné, protože můžete získat zpět část zaplacených daní. Mezi uznatelné náklady patří:</p>
                        <ul className="list-disc pl-5 mt-2">
                          <li>Náklady na dopravu do zaměstnání (0,30 € za km)</li>
                          <li>Výdaje na pracovní pomůcky</li>
                          <li>Náklady na další vzdělávání</li>
                          <li>V některých případech náklady na ubytování</li>
                        </ul>
                      </div>
                      
                      <Button className="mt-4 w-full md:w-auto">
                        Stáhnout přehled daňové problematiky v PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Family Tab */}
              <TabsContent value="family">
                <Card>
                  <CardHeader>
                    <CardTitle>Rodinné příspěvky v Německu</CardTitle>
                    <CardDescription>
                      Informace o dávkách pro rodiny pendlerů pracujících v Německu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Přídavky na děti (Kindergeld)</h3>
                      
                      <div className="bg-primary-50 p-5 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium mb-2">Co je Kindergeld?</h4>
                            <p>
                              Přídavek na dítě v Německu, na který máte jako pendler za určitých podmínek nárok i pro děti žijící v České republice.
                            </p>
                          </div>
                          <div className="mt-4 md:mt-0 md:ml-6 shrink-0">
                            <div className="bg-white rounded-full p-4 shadow-sm">
                              <p className="text-center">
                                <span className="block text-2xl font-bold text-primary">250 €</span>
                                <span className="text-sm text-gray-600">na dítě měsíčně</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold mb-2">Podmínky nároku</h4>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Pracovní poměr v Německu</li>
                          <li>Dítě mladší 18 let, při studiu až do 25 let</li>
                          <li>Společná domácnost s dítětem nebo jeho finanční podpora</li>
                        </ul>
                        
                        <h4 className="font-semibold mb-2 mt-4">Jak žádat</h4>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Vyplnit formulář žádosti o přídavky na děti (formulář <strong>KG 1</strong>)</li>
                          <li>Doložit přílohu pro děti žijící v zahraničí (formulář <strong>KG 51</strong>)</li>
                          <li>Přiložit rodné listy dětí (úředně přeložené)</li>
                          <li>Odeslat na příslušnou Familienkasse (pokladnu pro rodinné dávky)</li>
                        </ol>
                      </div>
                      
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                        <p className="font-medium">Koordinace dávek mezi Německem a ČR:</p>
                        <p>
                          Pokud máte nárok na rodinné dávky v obou zemích, primárně je vyplácí země zaměstnání (Německo).
                          Druhá země (ČR) může vyplácet doplatek, pokud jsou tamní dávky vyšší.
                        </p>
                        <p className="mt-2">
                          Úřady obou zemí si vyměňují informace, je tedy nutné informovat české úřady o pobírání německých dávek.
                        </p>
                      </div>
                      
                      <h3 className="text-xl font-semibold">Rodičovský příspěvek (Elterngeld)</h3>
                      <div className="bg-secondary-50 p-5 rounded-lg">
                        <p className="mb-4">
                          Rodičovský příspěvek je dávka pro rodiče, kteří pečují o dítě a přerušili kvůli tomu zaměstnání nebo snížili pracovní úvazek.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold mb-2">Základní podmínky:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Péče o vlastní dítě</li>
                              <li>Žití ve společné domácnosti s dítětem</li>
                              <li>Bydliště nebo obvyklý pobyt v Německu</li>
                              <li>Nepracovat více než 32 hodin týdně</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Výše a doba čerpání:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>67% průměrného čistého příjmu (min. 300 €, max. 1.800 €)</li>
                              <li>Základní období 12 měsíců pro jednoho rodiče</li>
                              <li>Možnost prodloužení při zapojení druhého rodiče</li>
                              <li>Flexibilní čerpání až do 24/32 měsíců s poloviční částkou</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded p-3 mb-4">
                          <h4 className="font-semibold mb-2">Specifika pro pendlery:</h4>
                          <p>
                            Nárok na Elterngeld mají i pendleři, jejichž děti žijí v ČR. Podmínkou je, že samotný rodič má bydliště nebo obvyklý pobyt v Německu.
                            Pokud rodič pouze pracuje v Německu, ale žije v ČR, zpravidla nemá nárok na plný Elterngeld.
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <Card className="h-full">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Školní příspěvky</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Některé spolkové země poskytují příspěvky na školní pomůcky (Schulbeihilfe) nebo na mimoškolní aktivity pro sociálně slabé rodiny.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="h-full">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Příspěvek na bydlení</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Wohngeld je příspěvek pro domácnosti s nižšími příjmy. Pro pendlery je relevantní pouze pokud bydlí v Německu.
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="h-full">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Přídavek na děti v ČR</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              V některých případech můžete mít nárok na doplatek českých přídavků na děti, pokud jsou vyšší než německé.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LawsPage;
