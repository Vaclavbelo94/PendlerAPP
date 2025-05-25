
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const LegalAid = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/laws" className="flex items-center mb-6 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpět na přehled zákonů
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full bg-indigo-100">
          <Scale className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Právní pomoc</h1>
          <p className="text-muted-foreground">Možnosti právní pomoci pro zahraniční pracovníky</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-600" />
              Bezplatná právní pomoc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              V Německu mají zahraniční pracovníci nárok na bezplatnou právní pomoc v určitých situacích:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Pracovněprávní spory s zaměstnavatelem</li>
              <li>Problémy s ubytováním a nájmem</li>
              <li>Diskriminace na pracovišti</li>
              <li>Nezaplacená mzda nebo porušení pracovní smlouvy</li>
              <li>Sociální dávky a pojištění</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kde získat právní pomoc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Odborové svazy (Gewerkschaften)</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Členové odborových svazů mají nárok na bezplatnou právní pomoc v pracovněprávních věcech.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>DGB Rechtsschutz: 030 24060-0</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Beratungsstellen für Migranten</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Specializované poradny pro migranty poskytují bezplatné právní poradenství.
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>info@migrationsberatung.de</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Dostupné ve všech větších městech</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Rechtsantragsstelle (Soud)</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Pro osoby s nízkými příjmy - žádost o bezplatnou právní pomoc u soudu.
                </p>
                <Badge variant="secondary">Závisí na příjmech</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pracovněprávní poradny</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Arbeitsrechtliche Beratung</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Specializované poradny pro pracovní právo - první konzultace často zdarma.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Po-Pá: 9:00-17:00</span>
                  </div>
                  <Badge variant="outline">30-60 min zdarma</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Důležité kontakty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Faire Mobilität</h4>
                  <p className="text-sm text-muted-foreground">Poradna pro mobilní pracovníky z EU</p>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Phone className="h-4 w-4" />
                    <span>030 21240-270</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Bundesamt für Migration</h4>
                  <p className="text-sm text-muted-foreground">Úřad pro migraci a uprchlíky</p>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Phone className="h-4 w-4" />
                    <span>0911 943-0</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Verbraucherzentrale</h4>
                  <p className="text-sm text-muted-foreground">Centrum pro spotřebitele</p>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Phone className="h-4 w-4" />
                    <span>0180 5 791 879</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium">Antidiskriminierungsstelle</h4>
                  <p className="text-sm text-muted-foreground">Úřad proti diskriminaci</p>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Phone className="h-4 w-4" />
                    <span>030 18555-1865</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-8">
          <Link to="/laws">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zpět na přehled zákonů
            </Button>
          </Link>
          <Badge variant="outline">
            Aktualizováno: 8. května 2025
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default LegalAid;
