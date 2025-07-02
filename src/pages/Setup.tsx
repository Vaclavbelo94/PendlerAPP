
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon, UserIcon, BriefcaseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

const Setup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Dokončit nastavení</h1>
          <p className="text-muted-foreground">
            Dokončete nastavení svého účtu pro plné využití aplikace
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Osobní informace
              </CardTitle>
              <CardDescription>
                Doplňte své základní údaje
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Vyplnit profil
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Pracovní údaje
              </CardTitle>
              <CardDescription>
                Nastavte informace o své práci v Německu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Nastavit práci
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-6">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/dashboard')}
            >
              Přeskočit
            </Button>
            <Button 
              className="flex-1"
              onClick={() => navigate('/dashboard')}
            >
              Dokončit setup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
