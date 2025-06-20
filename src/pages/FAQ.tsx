
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, MessageCircle, Sparkles } from "lucide-react";
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/hooks/useLanguage';

const FAQ = () => {
  const { t } = useLanguage();

  const faqItems = [
    {
      question: "Co je to pendler?",
      questionDe: "Was ist ein Pendler?",
      questionPl: "Co to jest pracownik transgraniczny?",
      answer: "Pendler je označení pro osobu, která pravidelně dojíždí za prací do jiné země, než ve které má trvalé bydliště. V kontextu této aplikace se jedná o osoby z České republiky pracující v Německu.",
      answerDe: "Ein Pendler ist eine Person, die regelmäßig zur Arbeit in ein anderes Land fährt als das, in dem sie ihren ständigen Wohnsitz hat. Im Kontext dieser Anwendung handelt es sich um Personen aus der Tschechischen Republik, die in Deutschland arbeiten.",
      answerPl: "Pracownik transgraniczny to osoba, która regularnie dojeżdża do pracy w innym kraju niż ten, w którym ma stałe miejsce zamieszkania. W kontekście tej aplikacji są to osoby z Czech pracujące w Niemczech."
    },
    {
      question: "Jaké doklady potřebuji jako pendler?",
      questionDe: "Welche Dokumente benötige ich als Pendler?",
      questionPl: "Jakie dokumenty potrzebuję jako pracownik transgraniczny?",
      answer: "Jako pendler pracující v Německu potřebujete platný občanský průkaz nebo cestovní pas, pracovní smlouvu, potvrzení o přihlášení k pobytu v Německu, průkaz zdravotní pojišťovny, daňové identifikační číslo (Steuer-ID) a případně řidičský průkaz, pokud dojíždíte autem.",
      answerDe: "Als Pendler, der in Deutschland arbeitet, benötigen Sie einen gültigen Personalausweis oder Reisepass, einen Arbeitsvertrag, eine Anmeldebescheinigung in Deutschland, eine Krankenversicherungskarte, eine Steueridentifikationsnummer (Steuer-ID) und gegebenenfalls einen Führerschein, wenn Sie mit dem Auto pendeln.",
      answerPl: "Jako pracownik transgraniczny w Niemczech potrzebujesz ważnego dowodu osobistego lub paszportu, umowy o pracę, potwierdzenia zameldowania w Niemczech, karty ubezpieczenia zdrowotnego, numeru identyfikacji podatkowej (Steuer-ID) i ewentualnie prawa jazdy, jeśli dojeżdżasz samochodem."
    },
    {
      question: "Jak funguje zdanění příjmu pendlera?",
      questionDe: "Wie funktioniert die Besteuerung von Pendlereinkommen?",
      questionPl: "Jak działa opodatkowanie dochodów pracowników transgranicznych?",
      answer: "Pendleři pracující v Německu odvádějí daně v Německu. Na základě mezinárodních daňových smluv pak mohou mít nárok na různé daňové výhody nebo odpočty jak v Německu, tak v České republice. V Německu je možné podat daňové přiznání (Steuererklärung) a získat případné přeplatky na dani.",
      answerDe: "Pendler, die in Deutschland arbeiten, zahlen Steuern in Deutschland. Basierend auf internationalen Steuerabkommen können sie dann Anspruch auf verschiedene Steuervorteile oder Abzüge sowohl in Deutschland als auch in der Tschechischen Republik haben. In Deutschland ist es möglich, eine Steuererklärung einzureichen und eventuelle Steuererstattungen zu erhalten.",
      answerPl: "Pracownicy transgraniczni pracujący w Niemczech płacą podatki w Niemczech. Na podstawie międzynarodowych umów podatkowych mogą następnie mieć prawo do różnych ulg podatkowych lub odliczeń zarówno w Niemczech, jak i w Polsce. W Niemczech możliwe jest złożenie zeznania podatkowego (Steuererklärung) i uzyskanie ewentualnych zwrotów podatku."
    },
    {
      question: "Jak je to se zdravotním pojištěním?",
      questionDe: "Wie ist das mit der Krankenversicherung?",
      questionPl: "Jak to jest z ubezpieczeniem zdrowotnym?",
      answer: "Pendleři jsou zpravidla zdravotně pojištěni v zemi, kde pracují - tedy v Německu. Na základě formuláře S1 pak mají nárok na zdravotní péči i v České republice. Jejich rodinní příslušníci mohou být pojištěni buď v Německu, nebo v ČR, v závislosti na konkrétní situaci.",
      answerDe: "Pendler sind in der Regel in dem Land krankenversichert, in dem sie arbeiten - also in Deutschland. Basierend auf dem S1-Formular haben sie dann auch Anspruch auf Gesundheitsversorgung in der Tschechischen Republik. Ihre Familienangehörigen können entweder in Deutschland oder in der Tschechischen Republik versichert sein, je nach konkreter Situation.",
      answerPl: "Pracownicy transgraniczni są zazwyczaj ubezpieczeni zdrowotnie w kraju, w którym pracują - czyli w Niemczech. Na podstawie formularza S1 mają następnie prawo do opieki zdrowotnej również w Polsce. Ich członkowie rodziny mogą być ubezpieczeni w Niemczech lub w Polsce, w zależności od konkretnej sytuacji."
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('faqTitle')} - PendlerApp</title>
        <meta 
          name="description" 
          content={t('faqSubtitle')}
        />
      </Helmet>
      
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/30 via-pink-100/30 to-purple-100/30 dark:from-rose-900/10 dark:via-pink-900/10 dark:to-purple-900/10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-rose-400/10 to-pink-400/10 dark:from-rose-600/5 dark:to-pink-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 dark:from-pink-600/5 dark:to-purple-600/5 rounded-full blur-3xl" />
        
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
              {t('faqTitle')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('faqSubtitle')}
            </p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border shadow-xl">
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
                        className="border-b border-border last:border-b-0"
                      >
                        <AccordionTrigger className="text-left px-6 py-4 hover:bg-muted/50 transition-all duration-300 text-base font-semibold text-foreground">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">{index + 1}</span>
                            </div>
                            {item.question}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <div className="ml-11 text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg border border-border">
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
            <Card className="bg-card/80 backdrop-blur-sm border shadow-xl max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 text-foreground">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  {t('notFoundAnswer')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t('notFoundAnswerText')}
                </p>
                <motion.a 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-semibold transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="h-4 w-4" />
                  {t('contactUs')}
                </motion.a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
