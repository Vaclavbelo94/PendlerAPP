
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PremiumCheck from '@/components/premium/PremiumCheck';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  Briefcase, 
  Heart, 
  Euro, 
  Clock,
  Users,
  Baby
} from "lucide-react";

const lawCategories = [
  { id: "work", label: "Pracovní právo", icon: <Briefcase className="h-5 w-5" /> },
  { id: "tax", label: "Daně", icon: <Euro className="h-5 w-5" /> },
  { id: "social", label: "Sociální zabezpečení", icon: <Users className="h-5 w-5" /> },
  { id: "health", label: "Zdravotní pojištění", icon: <Heart className="h-5 w-5" /> },
];

const lawItems = [
  {
    id: "minimum-wage",
    title: "Minimální mzda",
    description: "Informace o minimální mzdě v Německu",
    category: "work",
    updated: "2025-04-15",
    icon: <Euro className="h-5 w-5 text-green-600" />,
    path: "/laws/minimum-wage"
  },
  {
    id: "tax-classes",
    title: "Daňové třídy",
    description: "Vysvětlení daňových tříd v Německu",
    category: "tax",
    updated: "2025-03-28",
    icon: <FileText className="h-5 w-5 text-yellow-600" />,
    path: "/laws/tax-classes"
  },
  {
    id: "health-insurance",
    title: "Zdravotní pojištění",
    description: "Jak funguje zdravotní pojištění v Německu",
    category: "health", 
    updated: "2025-04-02",
    icon: <Heart className="h-5 w-5 text-red-600" />,
    path: "/laws/health-insurance"
  },
  {
    id: "work-contract",
    title: "Pracovní smlouva",
    description: "Náležitosti pracovní smlouvy v Německu",
    category: "work",
    updated: "2025-03-18",
    icon: <Briefcase className="h-5 w-5 text-blue-600" />,
    path: "/laws/work-contract"
  },
  {
    id: "tax-return",
    title: "Daňové přiznání",
    description: "Jak podat daňové přiznání v Německu",
    category: "tax",
    updated: "2025-04-10",
    icon: <FileText className="h-5 w-5 text-yellow-600" />,
    path: "/laws/tax-return"
  },
  {
    id: "pension-insurance",
    title: "Důchodové pojištění",
    description: "Systém důchodového pojištění v Německu",
    category: "social",
    updated: "2025-03-25",
    icon: <Clock className="h-5 w-5 text-purple-600" />,
    path: "/laws/pension-insurance"
  },
  {
    id: "employee-protection",
    title: "Ochrana zaměstnanců",
    description: "Práva zaměstnanců a ochranné zákony",
    category: "work",
    updated: "2025-03-30",
    icon: <Users className="h-5 w-5 text-blue-600" />,
    path: "/laws/employee-protection"
  },
  {
    id: "child-benefits",
    title: "Přídavky na děti",
    description: "Informace o příspěvku Kindergeld",
    category: "social",
    updated: "2025-04-05",
    icon: <Baby className="h-5 w-5 text-pink-600" />,
    path: "/laws/child-benefits"
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('cs-CZ', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(date);
};

const LawCard = ({ law }: { law: typeof lawItems[0] }) => (
  <Card className="h-full transition-all hover:shadow-md">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-full bg-slate-100">
          {law.icon}
        </div>
        <Badge variant="outline" className="text-xs">
          Aktualizováno: {formatDate(law.updated)}
        </Badge>
      </div>
      <CardTitle className="mt-2 text-lg">{law.title}</CardTitle>
      <CardDescription>{law.description}</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button asChild variant="secondary" className="w-full">
        <Link to={law.path}>Zobrazit detaily</Link>
      </Button>
    </CardFooter>
  </Card>
);

const Laws = () => {
  const [activeCategory, setActiveCategory] = useState("work");

  return (
    <PremiumCheck featureKey="laws">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Přehled zákonů</h1>
        
        <Tabs defaultValue="work" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="mb-6 flex flex-wrap gap-2 h-auto">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Vše</span>
            </TabsTrigger>
            
            {lawCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                {category.icon}
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lawItems.map((law) => (
                <LawCard key={law.id} law={law} />
              ))}
            </div>
          </TabsContent>
          
          {lawCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lawItems
                  .filter(law => law.category === category.id)
                  .map(law => (
                    <LawCard key={law.id} law={law} />
                  ))
                }
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PremiumCheck>
  );
};

export default Laws;
