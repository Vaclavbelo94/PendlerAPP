
import React from 'react';
import { Helmet } from 'react-helmet';
import { HelpCircle, Mail, MessageCircle } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const Help = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Helmet>
        <title>Nápověda | PendlerApp</title>
        <meta name="description" content="Nápověda a podpora pro PendlerApp" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-green-100">
            <HelpCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Nápověda</h1>
            <p className="text-muted-foreground">Najděte odpovědi na vaše otázky</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Často kladené otázky</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Jak začít používat aplikaci?</h4>
                <p className="text-sm text-muted-foreground">
                  Registrujte se a postupujte podle průvodce první nastaveními.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Jak funguje Premium?</h4>
                <p className="text-sm text-muted-foreground">
                  Premium vám odemkne všechny funkce aplikace bez omezení.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Kde najdu své údaje?</h4>
                <p className="text-sm text-muted-foreground">
                  Všechny vaše údaje najdete v sekci Profil.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontaktujte nás</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                podpora@pendlerapp.com
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
              <p className="text-sm text-muted-foreground">
                Odpovídáme obvykle do 24 hodin.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Průvodci a návody</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Začínáme</h4>
                <p className="text-sm text-muted-foreground">
                  Základní kroky pro nové uživatele
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Pokročilé funkce</h4>
                <p className="text-sm text-muted-foreground">
                  Využijte plný potenciál aplikace
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Řešení problémů</h4>
                <p className="text-sm text-muted-foreground">
                  Nejčastější problémy a jejich řešení
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Help;
