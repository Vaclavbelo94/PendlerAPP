import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const Laws = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const laws = [
    {
      id: 1,
      category: "Arbeitsrecht",
      title: "Minimální mzda",
      description: "Aktuální výše minimální mzdy v Německu.",
      link: "https://www.example.com/minimalni-mzda",
    },
    {
      id: 2,
      category: "Steuerrecht",
      title: "Daňové třídy",
      description: "Přehled daňových tříd a jejich vliv na zdanění.",
      link: "https://www.example.com/danove-tridy",
    },
    {
      id: 3,
      category: "Sozialversicherung",
      title: "Zdravotní pojištění",
      description: "Informace o zdravotním pojištění v Německu.",
      link: "https://www.example.com/zdravotni-pojisteni",
    },
    {
      id: 4,
      category: "Arbeitsrecht",
      title: "Pracovní smlouva",
      description: "Co by měla obsahovat pracovní smlouva v Německu.",
      link: "https://www.example.com/pracovni-smlouva",
    },
    {
      id: 5,
      category: "Steuerrecht",
      title: "Daňové přiznání",
      description: "Jak podat daňové přiznání v Německu.",
      link: "https://www.example.com/danove-priznani",
    },
    {
      id: 6,
      category: "Sozialversicherung",
      title: "Důchodové pojištění",
      description: "Informace o důchodovém pojištění v Německu.",
      link: "https://www.example.com/duchodove-pojisteni",
    },
    {
      id: 7,
      category: "Arbeitsrecht",
      title: "Ochrana zaměstnanců",
      description: "Práva a povinnosti zaměstnanců v Německu.",
      link: "https://www.example.com/ochrana-zamestnancu",
    },
    {
      id: 8,
      category: "Steuerrecht",
      title: "Přídavky na děti",
      description: "Podmínky pro získání přídavků na děti v Německu.",
      link: "https://www.example.com/pridavky-na-deti",
    },
  ];

  const filteredLaws = selectedCategory === "all"
    ? laws
    : laws.filter((law) => law.category === selectedCategory);

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
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Seznam zákonů a předpisů</CardTitle>
              <CardDescription>
                Vyberte kategorii pro zobrazení relevantních informací
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
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

                <ScrollArea className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Kategorie</TableHead>
                        <TableHead>Název</TableHead>
                        <TableHead>Popis</TableHead>
                        <TableHead className="text-right">Odkaz</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLaws.map((law) => (
                        <TableRow key={law.id}>
                          <TableCell className="font-medium">
                            <Badge>{law.category}</Badge>
                          </TableCell>
                          <TableCell>{law.title}</TableCell>
                          <TableCell>{law.description}</TableCell>
                          <TableCell className="text-right">
                            <a href={law.link} target="_blank" rel="noopener noreferrer" className="underline">Více informací</a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Laws;
