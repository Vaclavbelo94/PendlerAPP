import React from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";

const Vehicle = () => {
  return (
    <PremiumCheck featureKey="vehicle_management">
      <div className="container py-6">
        <Helmet>
          <title>Správa vozidla | Pendler Buddy</title>
        </Helmet>
        <h1 className="text-3xl font-bold mb-6">Správa vozidla</h1>
        <div className="mb-6">
          <p className="text-muted-foreground">
            Správa všech údajů o vašem vozidle, náklady na údržbu, historie oprav, spotřeba paliva a další.
          </p>
        </div>

        {/* Obsah stránky správy vozidla */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-lg font-medium mb-2">Údaje o vozidle</h2>
            <p className="text-muted-foreground">
              Zde budou zobrazeny všechny údaje o vašem vozidle.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-lg font-medium mb-2">Náklady na údržbu</h2>
            <p className="text-muted-foreground">
              Přehled nákladů na údržbu vašeho vozidla.
            </p>
          </div>
        </div>
      </div>
    </PremiumCheck>
  );
};

export default Vehicle;
