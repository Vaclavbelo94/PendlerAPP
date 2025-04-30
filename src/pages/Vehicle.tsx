
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, Car, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const VehiclePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <Car className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Správa vozidla</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Sledujte údržbu vašeho vozidla, připomínky pro technické kontroly a důležité dopravní předpisy pro pendlery v Německu.
            </p>
          </div>
        </section>
        
        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="maintenance" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8">
                <TabsTrigger value="maintenance">Údržba vozidla</TabsTrigger>
                <TabsTrigger value="regulations">Dopravní předpisy</TabsTrigger>
                <TabsTrigger value="reminders">Připomínky a kontroly</TabsTrigger>
              </TabsList>
              
              {/* Maintenance Tab */}
              <TabsContent value="maintenance">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Plán údržby vozidla</CardTitle>
                      <CardDescription>
                        Pravidelná údržba vašeho vozidla je klíčem k bezproblémovému dojíždění do práce v Německu
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-slate-50 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <span className="bg-primary/10 p-1 rounded-full mr-2">
                              <Calendar className="h-5 w-5 text-primary" />
                            </span>
                            Pravidelné kontroly
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Výměna motorového oleje každých 10-15 tisíc km</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Kontrola brzdového systému každých 15-20 tisíc km</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Výměna vzduchového filtru každých 15-30 tisíc km</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Kontrola a výměna brzdové kapaliny každé 2 roky</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-slate-50 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <span className="bg-primary/10 p-1 rounded-full mr-2">
                              <Calendar className="h-5 w-5 text-primary" />
                            </span>
                            Sezónní údržba
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Výměna letních/zimních pneumatik (v Německu povinné při odpovídajících podmínkách)</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Kontrola chladicího systému před létem</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Kontrola akumulátoru před zimou</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Výměna stěračů a doplnění nemrznoucí směsi do ostřikovačů</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-slate-50 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <span className="bg-primary/10 p-1 rounded-full mr-2">
                              <Calendar className="h-5 w-5 text-primary" />
                            </span>
                            Pro pendlery s vysokým nájezdem
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Častější kontrola stavu pneumatik a tlaku</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Pravidelná kontrola osvětlení vozidla</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Častější výměna oleje při převážně krátkých jízdách</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span>Kontrola rozvodového řemene/řetězu dle doporučení výrobce</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <Alert variant="default">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Tip pro pendlery</AlertTitle>
                          <AlertDescription>
                            Při vysokém nájezdu kilometrů zvažte založení servisního deníku, kam budete zaznamenávat všechny provedené údržby a výměny. 
                            Bude to užitečné nejen pro vás, ale i při případném prodeji vozidla.
                          </AlertDescription>
                        </Alert>
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Náklady na provoz vozidla pro pendlery</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-slate-100">
                                <th className="border p-2 text-left">Položka</th>
                                <th className="border p-2 text-left">Průměrná cena (€)</th>
                                <th className="border p-2 text-left">Interval/Poznámka</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border p-2">Výměna oleje a filtru</td>
                                <td className="border p-2">70 - 150</td>
                                <td className="border p-2">Každých 10-15 tisíc km</td>
                              </tr>
                              <tr>
                                <td className="border p-2">Výměna brzdových destiček</td>
                                <td className="border p-2">100 - 200</td>
                                <td className="border p-2">Každých 30-40 tisíc km</td>
                              </tr>
                              <tr>
                                <td className="border p-2">Výměna pneumatik (sada)</td>
                                <td className="border p-2">300 - 600</td>
                                <td className="border p-2">Každých 40-60 tisíc km</td>
                              </tr>
                              <tr>
                                <td className="border p-2">Technická kontrola (TÜV)</td>
                                <td className="border p-2">100 - 150</td>
                                <td className="border p-2">Každé 2 roky</td>
                              </tr>
                              <tr>
                                <td className="border p-2">Dálniční známka DE</td>
                                <td className="border p-2">-</td>
                                <td className="border p-2">Není potřeba pro osobní automobily</td>
                              </tr>
                              <tr>
                                <td className="border p-2">Daň z motorových vozidel (DE)</td>
                                <td className="border p-2">100 - 300</td>
                                <td className="border p-2">Ročně, pokud je auto registrováno v DE</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Regulations Tab */}
              <TabsContent value="regulations">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Důležité dopravní předpisy v Německu</CardTitle>
                      <CardDescription>
                        Přehled klíčových pravidel silničního provozu a specifik pro české pendlery v Německu
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Rychlostní limity</h3>
                          <div className="bg-slate-50 p-4 rounded-md mb-6">
                            <ul className="space-y-2">
                              <li className="flex justify-between items-center">
                                <span>Ve městě:</span>
                                <span className="font-semibold">50 km/h</span>
                              </li>
                              <li className="flex justify-between items-center">
                                <span>Mimo město:</span>
                                <span className="font-semibold">100 km/h</span>
                              </li>
                              <li className="flex justify-between items-center">
                                <span>Dálnice:</span>
                                <span className="font-semibold">Doporučeno 130 km/h</span>
                              </li>
                              <li className="flex justify-between items-center">
                                <span>Dálnice s omezením:</span>
                                <span className="font-semibold">Podle značení</span>
                              </li>
                            </ul>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-4">Povinná výbava vozidla</h3>
                          <div className="bg-slate-50 p-4 rounded-md mb-6">
                            <ul className="space-y-2">
                              <li className="flex items-center">
                                <Check className="h-4 w-4 text-primary mr-2" />
                                <span>Reflexní vesta (pro každou osobu ve vozidle)</span>
                              </li>
                              <li className="flex items-center">
                                <Check className="h-4 w-4 text-primary mr-2" />
                                <span>Výstražný trojúhelník</span>
                              </li>
                              <li className="flex items-center">
                                <Check className="h-4 w-4 text-primary mr-2" />
                                <span>Lékárnička</span>
                              </li>
                              <li className="flex items-center">
                                <Check className="h-4 w-4 text-primary mr-2" />
                                <span>Zimní pneumatiky při odpovídajících podmínkách</span>
                              </li>
                            </ul>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-4">Emisní zóny</h3>
                          <div className="bg-slate-50 p-4 rounded-md">
                            <p className="mb-3">
                              Mnoho německých měst má tzv. emisní zóny (Umweltzonen), do kterých mohou vjet pouze vozidla 
                              s příslušnou emisní plaketou (Umweltplakette).
                            </p>
                            <div className="flex space-x-4 mb-3">
                              <div className="text-center">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mx-auto">4</div>
                                <p className="text-sm mt-1">Zelená</p>
                              </div>
                              <div className="text-center">
                                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold mx-auto">3</div>
                                <p className="text-sm mt-1">Žlutá</p>
                              </div>
                              <div className="text-center">
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold mx-auto">2</div>
                                <p className="text-sm mt-1">Červená</p>
                              </div>
                            </div>
                            <p className="text-sm">
                              Aktuálně jsou ve většině měst povolena pouze vozidla se zelenou plaketou (emisní třída 4).
                              Plaketu lze zakoupit na STK, v autoservisech nebo online.
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Specifická pravidla v Německu</h3>
                          <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-md">
                              <h4 className="font-medium mb-2">Použití mobilního telefonu</h4>
                              <p>
                                Držení nebo používání mobilního telefonu během jízdy je zakázáno. Pokuta je minimálně 100 € a 1 bod v Flensburgu.
                                Povoleno je hands-free systém.
                              </p>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-md">
                              <h4 className="font-medium mb-2">Pravidlo pravé ruky (Rechts vor Links)</h4>
                              <p>
                                Na německých křižovatkách bez značek nebo semaforů platí pravidlo přednosti zprava. 
                                Toto pravidlo je velmi důsledně dodržováno.
                              </p>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-md">
                              <h4 className="font-medium mb-2">Jízda v pruzích na dálnici</h4>
                              <p>
                                Na dálnicích platí povinnost držet se v pravém pruhu, pokud nepředjíždíte. 
                                Předjíždění zprava je zakázáno a přísně pokutováno.
                              </p>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-md">
                              <h4 className="font-medium mb-2">Alkohol za volantem</h4>
                              <p>
                                Limit alkoholu v krvi je 0,5 ‰. Pro řidiče ve zkušební době a mladší 21 let platí 0,0 ‰.
                                Pokuty za překročení jsou vysoké a mohou vést k odebrání řidičského průkazu.
                              </p>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-4 mt-6">Bodový systém (Punktesystem in Flensburg)</h3>
                          <div className="bg-slate-50 p-4 rounded-md">
                            <p className="mb-3">
                              V Německu funguje bodový systém podobně jako v ČR. Body jsou evidovány v centrální evidenci v městě Flensburg.
                            </p>
                            <ul className="space-y-2">
                              <li>Maximální počet bodů je 8</li>
                              <li>Při dosažení 8 bodů je odebrán řidičský průkaz</li>
                              <li>Body jsou přidělovány za přestupky v rozmezí 1-3 body</li>
                              <li>Body se postupně odmazávají po 2,5 až 10 letech podle závažnosti</li>
                            </ul>
                          </div>
                          
                          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <p className="font-medium">Pro pendlery:</p>
                            <p>
                              Jako řidič s českým řidičským průkazem podléháte při jízdě v Německu německým předpisům. 
                              Německé úřady spolupracují s českými a přestupky mohou být vymáhány i v ČR.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Reminders Tab */}
              <TabsContent value="reminders">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Připomínky a povinné kontroly</CardTitle>
                      <CardDescription>
                        Systém důležitých připomínek pro pendlery týkající se vozidla
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-semibold mb-4">TÜV - Technická kontrola v Německu</h3>
                          <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium mb-3">Co je TÜV?</h4>
                                <p className="mb-4">
                                  TÜV (Technischer Überwachungsverein) je německá technická kontrola vozidel, podobná české STK.
                                  Každé vozidlo provozované v Německu musí mít platnou kontrolu TÜV.
                                </p>
                                <h4 className="font-medium mb-2">Četnost kontrol:</h4>
                                <ul className="list-disc pl-5 space-y-1 mb-4">
                                  <li>Nová vozidla: První kontrola po 3 letech</li>
                                  <li>Další kontroly: Každé 2 roky</li>
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-3">Co se kontroluje?</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                  <li>Brzdy a řízení</li>
                                  <li>Osvětlení a signalizace</li>
                                  <li>Nápravy, kola a pneumatiky</li>
                                  <li>Podvozek a karoserie</li>
                                  <li>Výfukový systém a emise</li>
                                  <li>Viditelnost (stěrače, skla)</li>
                                  <li>Bezpečnostní prvky</li>
                                </ul>
                              </div>
                            </div>
                            
                            <div className="mt-6 border-t border-slate-200 pt-4">
                              <h4 className="font-medium mb-3">Pro pendlery s českým vozidlem:</h4>
                              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                <p>
                                  Pokud máte české vozidlo s platnou českou STK, je tato kontrola uznávána i v Německu.
                                  Není tedy nutné absolvovat další kontrolu TÜV, pokud vaše vozidlo nebude registrováno v Německu.
                                </p>
                              </div>
                              <p>
                                V případě, že plánujete dlouhodobě používat vozidlo v Německu a změnit jeho registraci na německou, 
                                budete muset podstoupit německou TÜV.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Další důležité připomínky</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Výměna pneumatik</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm mb-3">
                                  V Německu platí povinnost mít zimní pneumatiky při odpovídajících povětrnostních podmínkách (sníh, náledí, atd.).
                                </p>
                                <div className="flex justify-between items-center text-sm">
                                  <span>Zimní:</span>
                                  <span className="font-medium">Říjen - Březen</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-1">
                                  <span>Letní:</span>
                                  <span className="font-medium">Duben - Září</span>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Dálniční známka</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm mb-2">
                                  Na rozdíl od ČR, Německo nemá pro osobní automobily poplatky za používání dálnic.
                                </p>
                                <p className="text-sm">
                                  Platí ale pro nákladní vozidla a v budoucnu se plánuje i zpoplatnění pro zahraniční osobní vozidla.
                                </p>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Pojištění vozidla</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm mb-2">
                                  České pojištění platí i v Německu, ale při častých cestách zvažte:
                                </p>
                                <ul className="list-disc pl-4 text-sm space-y-1">
                                  <li>Vyšší limity pojistného plnění</li>
                                  <li>Zahraniční asistenci</li>
                                  <li>Připojištění skel a dalších rizik</li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Co mít vždy ve vozidle jako pendler</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 p-6 rounded-lg">
                              <h4 className="font-medium mb-3">Povinné dokumenty</h4>
                              <ul className="space-y-2">
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Řidičský průkaz</p>
                                    <p className="text-sm text-muted-foreground">Platný evropský řidičský průkaz.</p>
                                  </div>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Osvědčení o registraci vozidla</p>
                                    <p className="text-sm text-muted-foreground">Velký i malý technický průkaz.</p>
                                  </div>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Zelená karta</p>
                                    <p className="text-sm text-muted-foreground">Mezinárodní doklad o pojištění vozidla.</p>
                                  </div>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Evropský záznam o nehodě</p>
                                    <p className="text-sm text-muted-foreground">Pro případ nehody.</p>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            
                            <div className="bg-slate-50 p-6 rounded-lg">
                              <h4 className="font-medium mb-3">Další užitečné vybavení</h4>
                              <ul className="space-y-2">
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Sada žárovek a pojistek</p>
                                    <p className="text-sm text-muted-foreground">Pro nefunkční osvětlení.</p>
                                  </div>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Tažné lano</p>
                                    <p className="text-sm text-muted-foreground">Pro případ poruchy.</p>
                                  </div>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Startovací kabely</p>
                                    <p className="text-sm text-muted-foreground">Pro případ vybité baterie.</p>
                                  </div>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Kontakty na asistenční službu</p>
                                    <p className="text-sm text-muted-foreground">Včetně čísla vaší pojišťovny.</p>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 text-center">
                        <Button size="lg">
                          Přidat připomínku pro vozidlo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VehiclePage;
