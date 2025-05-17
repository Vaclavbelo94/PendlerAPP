
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

export const RentalHeader = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="container mx-auto px-4">
        <Link to="/legal-assistant" className="flex items-center mb-6 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Zpět na Právní asistenta
        </Link>
        <div className="flex items-center gap-4 mb-6">
          <Home className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Nájemní smlouva v Německu</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Co by měla obsahovat nájemní smlouva v Německu a na co si dát pozor před podpisem.
        </p>
      </div>
    </section>
  );
};
