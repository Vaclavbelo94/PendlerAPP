import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

const Laws = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const laws = [
    {
      id: 1,
      category: "Arbeitsrecht",
      title: "Minimální mzda",
      description: "Aktuální výše minimální mzdy v Německu.",
      link: "https://www.example.com/minimalni-mzda",
      detailPath: "/laws/minimum-wage",
      lastUpdated: "15.01.2023",
      importance: "high",
      relevantFor: ["zaměstnanci", "zaměstnavatelé"]
    },
    {
      id: 2,
      category: "Steuerrecht",
      title: "Daňové třídy",
      description: "Přehled daňových tříd a jejich vliv na zdanění.",
      link: "https://www.example.com/danove-tridy",
      detailPath: "/laws/tax-classes",
      lastUpdated: "10.03.2023",
      importance: "high",
      relevantFor: ["všichni pracující v Německu"]
    },
    {
      id: 3,
      category: "Sozialversicherung",
      title: "Zdravotní pojištění",
      description: "Informace o zdravotním pojištění v Německu.",
      link: "https://www.example.com/zdravotni-pojisteni",
      detailPath: "/laws/health-insurance",
      lastUpdated: "25.02.2023",
      importance: "high",
      relevantFor: ["všichni pracující v Německu", "studenti", "důchodci"]
    },
    {
      id: 4,
      category: "Arbeitsrecht",
      title: "Pracovní smlouva",
      description: "Co by měla obsahovat pracovní smlouva v Německu.",
      link: "https://www.example.com/pracovni-smlouva",
      detailPath: "/laws/work-contract",
      lastUpdated: "05.04.2023",
      importance: "medium",
      relevantFor: ["zaměstnanci", "zaměstnavatelé"]
    },
    {
      id: 5,
      category: "Steuerrecht",
      title: "Daňové přiznání",
      description: "Jak podat daňové přiznání v Německu.",
      link: "https://www.example.com/danove-priznani",
      detailPath: "/laws/tax-return",
      lastUpdated: "30.03.2023",
      importance: "medium",
      relevantFor: ["všichni pracující v Německu"]
    },
    {
      id: 6,
      category: "Sozialversicherung",
      title: "Důchodové pojištění",
      description: "Informace o důchodovém pojištění v Německu.",
      link: "https://www.example.com/duchodove-pojisteni",
      detailPath: "/laws/pension-insurance",
      lastUpdated: "12.01.2023",
      importance: "medium",
      relevantFor: ["všichni pracující v Německu", "důchodci"]
    },
    {
      id: 7,
      category: "Arbeitsrecht",
      title: "Ochrana zaměstnanců",
      description: "Práva a povinnosti zaměstnanců v Německu.",
      link: "https://www.example.com/ochrana-zamestnancu",
      detailPath: "/laws/employee-protection",
      lastUpdated: "18.02.2023",
      importance: "medium",
      relevantFor: ["zaměstnanci", "zaměstnavatelé"]
    },
    {
      id: 8,
      category: "Steuerrecht",
      title: "Přídavky na děti",
      description: "Podmínky pro získání přídavků na děti v Německu.",
      link: "https://www.example.com/pridavky-na-deti",
      detailPath: "/laws/child-benefits",
      lastUpdated: "07.01.2023",
      importance: "medium",
      relevantFor: ["rodiče", "pečující osoby"]
    },
  ];

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">Vysoká</Badge>;
      case "medium":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Střední</Badge>;
      case "low":
        return <Badge className="bg-green-500 hover:bg-green-600">Nízká</Badge>;
      default:
        return null;
    }
  };

  const getCategoryTranslation = (category: string) => {
    const categories: Record<string, string> = {
      "Arbeitsrecht": "Pracovní právo",
      "Steuerrecht": "Daňové právo",
      "Sozialversicherung": "Sociální pojištění"
    };
    
    return categories[category] || category;
  };

  // Apply filters
  const filteredLaws = laws
    .filter((law) => selectedCategory === "all" || law.category === selectedCategory)
    .filter((law) => 
      searchQuery === "" || 
      law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex flex-col">
      {/* Header section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Zákony a předpisy</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Přehled německých zákonů a předpisů důležitých pro pendlery.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle>Seznam zákonů a předpisů</CardTitle>
              <CardDescription>
                Vyberte kategorii nebo vyhledávejte pro zobrazení relevantních informací
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="category">Kategorie</Label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="all">Všechny</option>
                      <option value="Arbeitsrecht">Pracovní právo</option>
                      <option value="Steuerrecht">Daňové právo</option>
                      <option value="Sozialversicherung">Sociální pojištění</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="search">Vyhledávání</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        type="text"
                        placeholder="Hledat podle názvu nebo popisu..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <ScrollArea className="h-[500px] rounded-md border">
                  <Table>
                    <TableCaption>
                      {filteredLaws.length === 0 ? "Žádné položky neodpovídají vašim kritériím" : `Celkem ${filteredLaws.length} položek`}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Kategorie</TableHead>
                        <TableHead>Název</TableHead>
                        <TableHead>Popis</TableHead>
                        <TableHead>Důležitost</TableHead>
                        <TableHead>Aktualizováno</TableHead>
                        <TableHead className="text-right">Odkazy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLaws.map((law) => (
                        <TableRow key={law.id}>
                          <TableCell className="font-medium">
                            <Badge variant="outline" className="bg-primary-50 text-primary border-primary">
                              {getCategoryTranslation(law.category)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{law.title}</TableCell>
                          <TableCell>{law.description}</TableCell>
                          <TableCell>{getImportanceBadge(law.importance)}</TableCell>
                          <TableCell>{law.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col sm:flex-row gap-2 justify-end">
                              <a href={law.link} target="_blank" rel="noopener noreferrer" className="underline text-sm text-muted-foreground hover:text-foreground">
                                Externí zdroj
                              </a>
                              <Link to={law.detailPath}>
                                <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
                                  Více informací
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>

                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">O německých zákonech pro pendlery</h3>
                  <p className="text-sm text-muted-foreground">
                    Jako pendler potřebujete znát jak české, tak německé zákony, které se na vás vztahují. 
                    Informace na této stránce jsou pouze orientační a nenahrazují konzultaci s odborníkem na dané téma.
                    Vždy se ujistěte, že používáte aktuální informace, protože zákony a předpisy se mohou měnit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Laws;
