
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Receipt, Clock, BarChart } from "lucide-react";

const TaxOptimizationTips = () => {
  const tips = [
    {
      icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
      title: "Náklady na dojíždění",
      description:
        "Náklady na dojíždění do Německa jsou plně odečitatelné z daňového základu. Za každý kilometr si můžete odečíst 0,30 € (prvních 20 km) a 0,38 € (nad 20 km)."
    },
    {
      icon: <Receipt className="h-5 w-5 text-green-500" />,
      title: "Pracovní vybavení",
      description:
        "Veškeré výdaje na pracovní vybavení jako počítač, pracovní oděv nebo nářadí jsou odečitatelné. Uschovejte si všechny účtenky."
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
      title: "Výdaje na bydlení",
      description:
        "Pokud si pronajímáte bydlení v Německu, můžete si odečíst náklady na nájem až do výše 12 000 € ročně."
    },
    {
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      title: "Deadline pro podání",
      description:
        "Daňové přiznání v Německu můžete podat až do 31. července následujícího roku. S daňovým poradcem se lhůta prodlužuje až do 28. února druhého roku."
    },
    {
      icon: <BarChart className="h-5 w-5 text-red-500" />,
      title: "Optimální daňová třída",
      description:
        "Pokud jste ženatý/vdaná, zvažte výhodnost daňových tříd. Třída III pro hlavního živitele je výhodná, pokud partner vydělává výrazně méně."
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Tipy pro daňovou optimalizaci</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-muted">{tip.icon}</div>
                <h3 className="font-medium">{tip.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxOptimizationTips;
