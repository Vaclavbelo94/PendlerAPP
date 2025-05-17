
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { 
  FileText, 
  BookOpen, 
  Gavel, 
  FileSearch,
  FilePen,
  Search,
  ClipboardList,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PremiumCheck from "@/components/premium/PremiumCheck";

const LegalAssistant = () => {
  const documentTypes = [
    {
      title: "Pracovní smlouva",
      icon: FilePen,
      description: "Vzorová pracovní smlouva a vysvětlení všech náležitostí",
      link: "/legal/work-contract"
    },
    {
      title: "Nájemní smlouva",
      icon: Home,
      description: "Vzorová nájemní smlouva a práva nájemníků v Německu",
      link: "/legal/rental-agreement",
    },
    {
      title: "Daňová registrace",
      icon: FileText,
      description: "Formuláře a návody pro daňovou registraci v Německu",
      link: "/laws/tax-return",
      soon: true
    },
    {
      title: "Zdravotní pojištění",
      icon: ClipboardList,
      description: "Formuláře a informace o zdravotním pojištění",
      link: "/laws/health-insurance"
    },
    {
      title: "Sociální zabezpečení",
      icon: Search,
      description: "Žádosti a informace o sociálním zabezpečení",
      link: "/legal/social-security",
      soon: true
    },
    {
      title: "Rodinné dávky",
      icon: BookOpen,
      description: "Informace o rodinných dávkách a přídavcích v Německu",
      link: "/laws/child-benefits"
    }
  ];

  return (
    <PremiumCheck featureKey="legal-assistant">
      <div className="container py-8">
        <Helmet>
          <title>Právní asistent | Pendler Buddy</title>
        </Helmet>
        
        {/* Header section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Gavel className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Právní asistent</h1>
          </div>
          
          <p className="text-muted-foreground text-lg max-w-3xl">
            Právní asistent vám poskytuje vzorové dokumenty, průvodce a informace relevantní pro pendlery 
            pracující v Německu. Procházejte naše řešení jednotlivých právních situací.
          </p>
        </section>
        
        {/* Document cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documentTypes.map((doc) => (
              <Card key={doc.title} className={doc.soon ? "opacity-80" : ""}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-primary/10">
                      <doc.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{doc.title}</CardTitle>
                  </div>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  {doc.soon ? (
                    <Button variant="outline" disabled className="w-full">
                      Již brzy
                    </Button>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to={doc.link}>Zobrazit</Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Legal disclaimer */}
        <section className="mt-10">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Právní upozornění</h3>
              <p className="text-muted-foreground text-sm">
                Informace poskytované v sekci Právní asistent jsou pouze informativní a neslouží jako náhrada 
                za profesionální právní poradenství. Pro konkrétní právní případy vždy doporučujeme 
                konzultovat situaci s kvalifikovaným právníkem nebo daňovým poradcem.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </PremiumCheck>
  );
};

export default LegalAssistant;
