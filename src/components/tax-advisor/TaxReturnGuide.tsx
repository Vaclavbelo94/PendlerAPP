
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, Download, Book, Calculator } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const TaxReturnGuide = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadGuide = () => {
    setIsDownloading(true);

    try {
      const doc = new jsPDF();
      
      // Document title
      doc.setFontSize(20);
      doc.text("Průvodce daňovým přiznáním v Německu", 105, 20, { align: 'center' });
      
      // Date
      doc.setFontSize(10);
      doc.text(`Datum: ${new Date().toLocaleDateString('cs-CZ')}`, 195, 10, { align: 'right' });
      
      // Basic information section
      doc.setFontSize(16);
      doc.text("Základní informace", 15, 40);
      
      doc.setFontSize(11);
      doc.text("Daňové přiznání v Německu (Einkommensteuererklärung) je pro zaměstnance většinou dobrovolné, ale v mnoha případech výhodné. Pro některé skupiny osob je však povinné.", 15, 50);
      
      // When is tax return mandatory
      doc.setFontSize(14);
      doc.text("Kdy je podání daňového přiznání povinné:", 15, 65);
      
      autoTable(doc, {
        startY: 70,
        head: [],
        body: [
          ['Máte-li příjmy z více zdrojů (např. kromě zaměstnání máte příjmy z podnikání)'],
          ['Pobíráte-li náhradu mzdy (např. rodičovský příspěvek, podpora v nezaměstnanosti)'],
          ['Máte-li daňovou třídu V nebo VI'],
          ['Pracují-li oba manželé a mají kombinaci daňových tříd III a V'],
          ['Máte-li vedlejší příjmy nad 410 € ročně'],
          ['Pracujete-li pro více zaměstnavatelů současně'],
        ],
        theme: 'plain',
        styles: {
          cellPadding: 2,
        },
      });
      
      // Deadlines
      const deadlineY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("Termíny pro podání daňového přiznání:", 15, deadlineY);
      
      autoTable(doc, {
        startY: deadlineY + 5,
        head: [],
        body: [
          ['Pro povinné daňové přiznání: obvykle do 31. července následujícího roku'],
          ['Při zastoupení daňovým poradcem: do 28./29. února druhého následujícího roku'],
          ['Pro dobrovolné daňové přiznání: až 4 roky zpětně'],
        ],
        theme: 'plain',
        styles: {
          cellPadding: 2,
        },
      });
      
      // Tax deductions section
      const deductionsY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.text("Odpočitatelné položky pro pendlery", 15, deductionsY);
      
      doc.setFontSize(11);
      doc.text("Jako pendler máte možnost uplatnit řadu daňových odpočtů, které mohou výrazně snížit vaši daňovou povinnost:", 15, deductionsY + 10);
      
      // Commute costs
      doc.setFontSize(14);
      doc.text("1. Náklady na dojíždění (Entfernungspauschale)", 15, deductionsY + 25);
      
      autoTable(doc, {
        startY: deductionsY + 30,
        head: [],
        body: [
          ['0,30 € za každý kilometr jednosměrné cesty do práce pro prvních 20 km'],
          ['0,38 € za každý kilometr jednosměrné cesty nad 20 km'],
          ['Počítá se nejkratší trasa mezi bydlištěm a pracovištěm'],
          ['Uplatňuje se za každý pracovní den, kdy jste do práce dojížděli'],
        ],
        theme: 'plain',
        styles: {
          cellPadding: 2,
        },
      });
      
      // Example calculation
      const exampleY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFillColor(240, 240, 250);
      doc.rect(15, exampleY, 180, 35, 'F');
      doc.setFontSize(12);
      doc.text("Příklad výpočtu:", 20, exampleY + 10);
      doc.setFontSize(10);
      doc.text("Trasa 50 km jedním směrem, 220 pracovních dnů:", 20, exampleY + 20);
      doc.text("- Prvních 20 km: 20 km × 0,30 € × 220 dní = 1 320 €", 20, exampleY + 25);
      doc.text("- Zbývajících 30 km: 30 km × 0,38 € × 220 dní = 2 508 €", 20, exampleY + 30);
      doc.text("- Celkem si můžete odečíst: 3 828 €", 20, exampleY + 35);
      
      // Work equipment
      const workEquipY = exampleY + 45;
      doc.setFontSize(14);
      doc.text("2. Pracovní pomůcky a vybavení (Arbeitsmittel)", 15, workEquipY);
      
      autoTable(doc, {
        startY: workEquipY + 5,
        head: [],
        body: [
          ['Pracovní oděvy a jejich údržbu'],
          ['Odbornou literaturu a vzdělávací materiály'],
          ['Počítač a software používaný pro práci'],
          ['Nářadí a speciální vybavení'],
        ],
        theme: 'plain',
        styles: {
          cellPadding: 2,
        },
      });
      
      // Add a new page for more information
      doc.addPage();
      
      // How to file tax return
      doc.setFontSize(16);
      doc.text("Jak podat daňové přiznání", 15, 20);
      
      doc.setFontSize(14);
      doc.text("Možnosti podání daňového přiznání:", 15, 35);
      
      const options = [
        {
          title: "1. Elektronicky přes ELSTER",
          desc: "ELSTER je oficiální online systém německé daňové správy. Je zdarma, ale vyžaduje registraci a certifikát.",
          website: "www.elster.de"
        },
        {
          title: "2. Komerční daňový software",
          desc: "Placené i bezplatné programy pro vyplnění daňového přiznání, např. WISO Steuer, Smartsteuer, Taxfix."
        },
        {
          title: "3. Prostřednictvím daňového poradce",
          desc: "Nejpohodlnější, ale nejdražší varianta. Daňový poradce se postará o vše."
        }
      ];
      
      let optionY = 40;
      options.forEach(option => {
        doc.setFontSize(12);
        doc.text(option.title, 15, optionY + 10);
        doc.setFontSize(10);
        doc.text(option.desc, 15, optionY + 18);
        if (option.website) {
          doc.text(`Web: ${option.website}`, 15, optionY + 26);
        }
        optionY += 30;
      });
      
      // Documents needed
      doc.setFontSize(14);
      doc.text("Potřebné doklady:", 15, 140);
      
      autoTable(doc, {
        startY: 145,
        head: [],
        body: [
          ['Roční zúčtování daně (Lohnsteuerbescheinigung) od zaměstnavatele'],
          ['Potvrzení o placení zdravotního a sociálního pojištění'],
          ['Doklady k odpočitatelným položkám (účty, potvrzení)'],
          ['Daňové identifikační číslo (Steueridentifikationsnummer)'],
          ['Číslo účtu pro případné vrácení daně'],
        ],
        theme: 'plain',
        styles: {
          cellPadding: 2,
        },
      });
      
      // Practical tips
      const tipsY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("Praktické tipy pro pendlery:", 15, tipsY);
      
      autoTable(doc, {
        startY: tipsY + 5,
        head: [],
        body: [
          ['1. Shromažďujte všechny relevantní účty a doklady během roku.'],
          ['2. Veďte si evidenci pracovních dnů, kdy jste dojížděli do Německa.'],
          ['3. Zvažte využití služeb daňového poradce se zkušenostmi s přeshraničními pracovníky.'],
          ['4. Nezapomeňte na daňové přiznání v ČR, kde musíte deklarovat příjmy z Německa.'],
        ],
        theme: 'plain',
        styles: {
          cellPadding: 2,
        },
      });
      
      // Footer with page number
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Pendler Buddy - Průvodce daňovým přiznáním | Strana ${i} z ${pageCount}`, 105, 285, { align: 'center' });
      }
      
      // Save the document
      const fileName = `Průvodce_daňovým_přiznáním_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success("Průvodce byl úspěšně stažen");
    } catch (error) {
      console.error("Chyba při vytváření PDF:", error);
      toast.error("Při stahování průvodce došlo k chybě");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Průvodce daňovým přiznáním</CardTitle>
          <Button 
            variant="outline" 
            onClick={handleDownloadGuide}
            disabled={isDownloading}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Stahování..." : "Stáhnout průvodce (PDF)"}
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basics" className="space-y-6">
            <TabsList className="grid grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="basics" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Základní informace
              </TabsTrigger>
              <TabsTrigger value="deductions" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Odpočitatelné položky
              </TabsTrigger>
              <TabsTrigger value="filing" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Jak podat přiznání
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="space-y-4">
              <div className="prose max-w-none">
                <h3>Co je daňové přiznání v Německu</h3>
                <p>
                  Daňové přiznání v Německu (Einkommensteuererklärung) je pro zaměstnance většinou dobrovolné, 
                  ale v mnoha případech výhodné. Pro některé skupiny osob je však povinné.
                </p>
                
                <h4>Kdy je podání daňového přiznání povinné</h4>
                <ul>
                  <li>Máte-li příjmy z více zdrojů (např. kromě zaměstnání máte příjmy z podnikání)</li>
                  <li>Pobíráte-li náhradu mzdy (např. rodičovský příspěvek, podpora v nezaměstnanosti)</li>
                  <li>Máte-li daňovou třídu V nebo VI</li>
                  <li>Pracují-li oba manželé a mají kombinaci daňových tříd III a V</li>
                  <li>Máte-li vedlejší příjmy nad 410 € ročně</li>
                  <li>Pracujete-li pro více zaměstnavatelů současně</li>
                </ul>
                
                <h4>Termín pro podání daňového přiznání</h4>
                <ul>
                  <li>Pro povinné daňové přiznání: obvykle do 31. července následujícího roku (např. za rok 2023 do 31.7.2024)</li>
                  <li>Při zastoupení daňovým poradcem: do 28./29. února druhého následujícího roku</li>
                  <li>Pro dobrovolné daňové přiznání: až 4 roky zpětně</li>
                </ul>
                
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="font-medium">Pro pendlery:</p>
                  <p className="mt-1">
                    Jako pendler pracující v Německu máte stejné daňové povinnosti jako němečtí pracovníci. 
                    Daně platíte v Německu, ale ve většině případů je výhodné podat daňové přiznání, 
                    protože můžete uplatnit náklady na dojíždění a další výdaje.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="deductions" className="space-y-4">
              <div className="prose max-w-none">
                <h3>Možnost daňových odpočtů pro pendlery</h3>
                <p>
                  Jako pendler máte možnost uplatnit řadu daňových odpočtů, které mohou výrazně 
                  snížit vaši daňovou povinnost.
                </p>
                
                <h4>1. Náklady na dojíždění (Entfernungspauschale)</h4>
                <p>
                  Jedním z nejdůležitějších odpočtů pro pendlery jsou náklady na dojíždění:
                </p>
                <ul>
                  <li>0,30 € za každý kilometr jednosměrné cesty do práce pro prvních 20 km</li>
                  <li>0,38 € za každý kilometr jednosměrné cesty nad 20 km</li>
                  <li>Počítá se nejkratší trasa mezi bydlištěm a pracovištěm, bez ohledu na skutečně použitý dopravní prostředek</li>
                  <li>Uplatňuje se za každý pracovní den, kdy jste do práce dojížděli</li>
                </ul>
                
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <p className="font-medium">Příklad výpočtu:</p>
                  <p className="mt-1">Pokud je vaše trasa do práce dlouhá 50 km jedním směrem a pracovali jste 220 dní v roce:</p>
                  <ul className="mt-2">
                    <li>Prvních 20 km: 20 km × 0,30 € × 220 dní = 1 320 €</li>
                    <li>Zbývajících 30 km: 30 km × 0,38 € × 220 dní = 2 508 €</li>
                    <li>Celkem si můžete odečíst: 3 828 €</li>
                  </ul>
                </div>
                
                <h4>2. Pracovní pomůcky a vybavení (Arbeitsmittel)</h4>
                <p>Můžete si odečíst náklady na:</p>
                <ul>
                  <li>Pracovní oděvy a jejich údržbu</li>
                  <li>Odbornou literaturu a vzdělávací materiály</li>
                  <li>Počítač a software používaný pro práci</li>
                  <li>Nářadí a speciální vybavení</li>
                </ul>
                
                <h4>3. Další odčitatelné položky specifické pro pendlery</h4>
                <ul>
                  <li>Náklady na druhé bydlení v Německu (pokud máte hlavní bydliště v ČR)</li>
                  <li>Poplatky za daňové poradenství</li>
                  <li>Náklady na zdravotní pojištění (nad rámec povinných odvodů)</li>
                  <li>Náklady na jazykové kurzy němčiny (pokud jsou potřebné pro vaši práci)</li>
                </ul>
                
                <Link to="/calculator" className="inline-flex items-center mt-4">
                  <Button variant="outline">
                    <Calculator className="mr-2 h-4 w-4" />
                    Spočítat úsporu pomocí daňové kalkulačky
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="filing" className="space-y-4">
              <div className="prose max-w-none">
                <h3>Jak podat daňové přiznání v Německu</h3>
                
                <h4>Možnosti podání daňového přiznání</h4>
                <div className="space-y-4 mb-6">
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h5 className="font-medium">1. Elektronicky přes ELSTER</h5>
                    <p className="mt-1">
                      ELSTER (Elektronische Steuererklärung) je oficiální online systém německé daňové správy. 
                      Je zdarma, ale vyžaduje registraci a certifikát.
                    </p>
                    <a href="https://www.elster.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.elster.de</a>
                  </div>
                  
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h5 className="font-medium">2. Komerční daňový software</h5>
                    <p className="mt-1">
                      Placené i bezplatné programy pro vyplnění daňového přiznání, např. WISO Steuer, Smartsteuer, Taxfix.
                    </p>
                  </div>
                  
                  <div className="bg-primary-50 p-4 rounded-md">
                    <h5 className="font-medium">3. Prostřednictvím daňového poradce</h5>
                    <p className="mt-1">
                      Nejpohodlnější, ale nejdražší varianta. Daňový poradce se postará o vše a může podat 
                      daňové přiznání s prodlouženou lhůtou.
                    </p>
                  </div>
                </div>
                
                <h4>Potřebné doklady</h4>
                <ul>
                  <li>Roční zúčtování daně (Lohnsteuerbescheinigung) od zaměstnavatele</li>
                  <li>Potvrzení o placení zdravotního a sociálního pojištění</li>
                  <li>Doklady k odpočitatelným položkám (účty, potvrzení)</li>
                  <li>Daňové identifikační číslo (Steueridentifikationsnummer)</li>
                  <li>Číslo účtu pro případné vrácení daně</li>
                </ul>
                
                <div className="bg-green-50 p-4 rounded-md mt-6">
                  <p className="font-medium">Praktické tipy pro pendlery:</p>
                  <ol className="mt-2">
                    <li>Shromažďujte všechny relevantní účty a doklady během roku.</li>
                    <li>Veďte si evidenci pracovních dnů, kdy jste dojížděli do Německa.</li>
                    <li>Zvažte využití služeb daňového poradce, který má zkušenosti s přeshraničními pracovníky.</li>
                    <li>Nezapomeňte na daňové přiznání v České republice, kde budete deklarovat příjmy z Německa (ty jsou v ČR obvykle od daně osvobozeny, ale musí být přiznány).</li>
                  </ol>
                </div>
                
                <div className="mt-6">
                  <Link to="/laws/tax-return">
                    <Button>
                      <FileText className="mr-2 h-4 w-4" />
                      Zobrazit podrobný průvodce
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxReturnGuide;
