import React from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";

const Shifts = () => {
  return (
    <PremiumCheck featureKey="shifts_planning">
      <div className="container py-6">
        <Helmet>
          <title>Plánování směn | Pendler Buddy</title>
        </Helmet>
        <h1 className="text-3xl font-bold mb-6">Plánování směn</h1>
        <div className="mb-6">
          <p className="text-muted-foreground">
            Organizujte své pracovní směny, plánujte dojíždění a optimalizujte svůj čas.
          </p>
        </div>

        {/* Obsah stránky plánování směn */}
        <div className="bg-card p-6 rounded-lg border mb-6">
          <h2 className="text-lg font-medium mb-2">Kalendář směn</h2>
          <p className="text-muted-foreground">
            Zde bude zobrazen kalendář vašich směn.
          </p>
        </div>
      </div>
    </PremiumCheck>
  );
};

export default Shifts;
