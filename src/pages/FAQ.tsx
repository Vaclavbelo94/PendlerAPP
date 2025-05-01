
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Help } from "lucide-react";

const FAQ = () => {
  const faqItems = [
    {
      question: "Co je to pendler?",
      answer: "Pendler je označení pro osobu, která pravidelně dojíždí za prací do jiné země, než ve které má trvalé bydliště. V kontextu této aplikace se jedná o osoby z České republiky pracující v Německu."
    },
    {
      question: "Jaké doklady potřebuji jako pendler?",
      answer: "Jako pendler pracující v Německu potřebujete platný občanský průkaz nebo cestovní pas, pracovní smlouvu, potvrzení o přihlášení k pobytu v Německu, průkaz zdravotní pojišťovny, daňové identifikační číslo (Steuer-ID) a případně řidičský průkaz, pokud dojíždíte autem."
    },
    {
      question: "Jak funguje zdanění příjmu pendlera?",
      answer: "Pendleři pracující v Německu odvádějí daně v Německu. Na základě mezinárodních daňových smluv pak mohou mít nárok na různé daňové výhody nebo odpočty jak v Německu, tak v České republice. V Německu je možné podat daňové přiznání (Steuererklärung) a získat případné přeplatky na dani."
    },
    {
      question: "Jak je to se zdravotním pojištěním?",
      answer: "Pendleři jsou zpravidla zdravotně pojištěni v zemi, kde pracují - tedy v Německu. Na základě formuláře S1 pak mají nárok na zdravotní péči i v České republice. Jejich rodinní příslušníci mohou být pojištěni buď v Německu, nebo v ČR, v závislosti na konkrétní situaci."
    },
    {
      question: "Co je to formulář A1?",
      answer: "Formulář A1 je potvrzení o příslušnosti k právním předpisům sociálního zabezpečení. Prokazuje, že osoba odvádí pojistné na sociální zabezpečení v konkrétní zemi EU. Pro pendlery je důležitý, protože dokazuje, že jsou řádně sociálně pojištěni."
    },
    {
      question: "Mohu využívat sociální dávky jako pendler?",
      answer: "Pendleři mohou mít za určitých podmínek nárok na některé sociální dávky v Německu, jako je například Kindergeld (přídavky na děti), Wohngeld (příspěvek na bydlení) nebo Elterngeld (rodičovský příspěvek). Podmínky nároku se liší podle konkrétní dávky a osobní situace."
    },
    {
      question: "Jak funguje plánování spolujízdy v aplikaci?",
      answer: "V sekci 'Plánování směn' můžete zadat svou trasu, časy cest a preferované dny. Aplikace vám pak nabídne možné spolujezdce nebo řidiče na podobné trase. Můžete také vytvořit vlastní nabídku spolujízdy a stanovit podmínky (příspěvek na benzín, možnosti zavazadel apod.)."
    },
    {
      question: "Jak aktuální jsou informace o zákonech v aplikaci?",
      answer: "Informace o zákonech, daních a předpisech v naší aplikaci pravidelně aktualizujeme podle nejnovějších změn v německé a české legislativě. Datum poslední aktualizace je vždy uvedeno u příslušné sekce. Přesto doporučujeme důležité informace vždy ověřit u příslušných úřadů."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Help className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Časté otázky (FAQ)</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Odpovědi na nejčastější dotazy českých pendlerů pracujících v Německu.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Nenašli jste odpověď na svou otázku? <a href="/contact" className="text-primary hover:underline">Kontaktujte nás</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
