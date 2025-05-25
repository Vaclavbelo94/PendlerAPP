
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Calendar, 
  Calculator, 
  BookOpen, 
  Languages, 
  MapPin,
  FileText,
  Scale,
  ArrowRight,
  Star,
  Users,
  TrendingUp
} from "lucide-react";

const features = [
  {
    title: "Správa směn",
    description: "Sledujte své pracovní směny a plánujte si čas",
    icon: <Calendar className="h-6 w-6" />,
    href: "/shifts",
    color: "bg-blue-500"
  },
  {
    title: "Správa vozidla",
    description: "Údržba, náklady a dokumenty k vašemu vozidlu",
    icon: <Car className="h-6 w-6" />,
    href: "/vehicle", 
    color: "bg-green-500"
  },
  {
    title: "Výuka němčiny",
    description: "Naučte se německy pro práci v zahraničí",
    icon: <BookOpen className="h-6 w-6" />,
    href: "/vocabulary",
    color: "bg-purple-500"
  },
  {
    title: "Překladač",
    description: "Překládejte texty a komunikujte bez překážek",
    icon: <Languages className="h-6 w-6" />,
    href: "/translator",
    color: "bg-indigo-500"
  },
  {
    title: "Kalkulačka mezd",
    description: "Vypočítejte si čistou mzdu a daně",
    icon: <Calculator className="h-6 w-6" />,
    href: "/calculator",
    color: "bg-orange-500"
  },
  {
    title: "Plánovač cest",
    description: "Optimalizujte dojíždění do práce",
    icon: <MapPin className="h-6 w-6" />,
    href: "/travel-planning",
    color: "bg-red-500"
  },
  {
    title: "Daňové poradenství",
    description: "Poradenství k daním a právním záležitostem",
    icon: <FileText className="h-6 w-6" />,
    href: "/tax-advisor",
    color: "bg-yellow-500"
  },
  {
    title: "Přehled zákonů",
    description: "Důležité zákony pro práci v Německu",
    icon: <Scale className="h-6 w-6" />,
    href: "/laws",
    color: "bg-teal-500"
  }
];

const stats = [
  { label: "Aktivních uživatelů", value: "1,200+", icon: <Users className="h-5 w-5" /> },
  { label: "Hodnocení", value: "4.8/5", icon: <Star className="h-5 w-5" /> },
  { label: "Měsíční růst", value: "+25%", icon: <TrendingUp className="h-5 w-5" /> }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Helmet>
        <title>Pendler Buddy - Váš průvodce pro práci v zahraničí</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1">
            🚀 Nová verze aplikace je tady!
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Pendler Buddy
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Komplexní aplikace pro všechny, kteří pracují v zahraničí. 
            Spravujte směny, vozidlo, učte se jazyky a mnoho dalšího.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="px-8">
              <Link to="/dashboard">
                Začít používat
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/premium">
                Zobrazit Premium
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Vše, co potřebujete na jednom místě
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Link to={feature.href}>
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Připraveni začít?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Připojte se k tisícům pendlerů, kteří už používají Pendler Buddy 
            pro snadnější život při práci v zahraničí.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/register">
                Vytvořit účet zdarma
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">
                Už mám účet
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
