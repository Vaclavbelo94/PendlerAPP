
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Language, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Language,
    title: "Výuka němčiny",
    description: "Základní fráze, odborná slovní zásoba a praktická gramatika pro každodenní komunikaci v práci i mimo ni.",
    link: "/language"
  },
  {
    icon: Car,
    title: "Správa vozidla",
    description: "Sledování údržby vozidla, připomínky pro technické kontroly a důležité dopravní předpisy v Německu.",
    link: "/vehicle"
  },
  {
    icon: Calendar,
    title: "Plánování směn a spolujízda",
    description: "Kalendář směn a organizace spolujízdy s dalšími pendlery na vaší trase do práce.",
    link: "/shifts"
  },
  {
    icon: Calendar,
    title: "Přehled zákonů",
    description: "Srozumitelné informace o německém pracovním právu, daních, pojištění a všem, co český pendler potřebuje znát.",
    link: "/laws"
  }
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Co nabízíme</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pendler Helper poskytuje komplexní nástroje, které vám pomohou s každodenními výzvami 
            při práci v zahraničí.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="h-full feature-card hover-scale">
              <CardHeader>
                <feature.icon className="feature-icon" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  {feature.description}
                </CardDescription>
                <Link to={feature.link} className="inline-flex items-center text-primary hover:text-primary-600 font-medium">
                  Více informací <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
