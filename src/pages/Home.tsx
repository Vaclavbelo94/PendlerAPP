
import React from 'react';
import { PublicLayout } from '@/components/modern/PublicLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Car, Languages, Scale, Crown, Shield } from 'lucide-react';

const Home = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <Badge variant="outline" className="mb-4">
            Nová verze 2.0 je zde!
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            PendlerApp
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Komplexní řešení pro české pracovníky v Německu. Spravujte směny, počítejte daně a najděte dopravní řešení.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link to="/register">Začít zdarma</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">Přihlásit se</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Hlavní funkce</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Správa směn</CardTitle>
                <CardDescription>
                  Plánujte a sledujte své pracovní směny s pokročilou analytickou podporou
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Car className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Doprava</CardTitle>
                <CardDescription>
                  Najděte nejlepší dopravní spojení a spolujedoucí
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Languages className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Překladač</CardTitle>
                <CardDescription>
                  Profesionální překladač pro pracovní komunikaci
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Scale className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Daňové poradenství</CardTitle>
                <CardDescription>
                  Komplexní daňové poradenství a kalkulačky
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Crown className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle>Premium funkce</CardTitle>
                <CardDescription>
                  Pokročilé funkce pro profesionální použití
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Bezpečnost</CardTitle>
                <CardDescription>
                  Vaše data jsou v bezpečí s nejvyšší úrovní zabezpečení
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Připraveni začít?</CardTitle>
              <CardDescription>
                Připojte se k tisícům spokojených uživatelů již dnes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full">
                <Link to="/register">Registrovat se zdarma</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </PublicLayout>
  );
};

export default Home;
