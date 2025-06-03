
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, MessageCircle, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100/30 via-pink-100/30 to-purple-100/30" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl" />
      
      <div className="relative container py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl shadow-lg mb-6"
          >
            <HelpCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Časté otázky (FAQ)
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Odpovědi na nejčastější dotazy českých pendlerů pracujících v Německu.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <AccordionItem 
                      value={`item-${index}`} 
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <AccordionTrigger className="text-left px-6 py-4 hover:bg-gradient-to-r hover:from-rose-50/50 hover:to-pink-50/50 transition-all duration-300 text-base font-semibold">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>
                          {item.question}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="ml-11 text-muted-foreground leading-relaxed bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-100">
                          {item.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                Nenašli jste odpověď?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Pokud jste nenašli odpověď na svou otázku, neváhejte nás kontaktovat. 
                Rádi vám pomůžeme a odpovíme do 24 hodin.
              </p>
              <motion.a 
                href="/contact" 
                className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-4 w-4" />
                Kontaktujte nás
              </motion.a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
