
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const RentalFooter = () => {
  return (
    <div className="flex justify-between items-center mt-8">
      <Link to="/legal-assistant">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Zpět na Právní asistenta
        </Button>
      </Link>
      <a href="https://www.mieterbund.de" target="_blank" rel="noopener noreferrer">
        <Button>
          Oficiální zdroj informací
        </Button>
      </a>
    </div>
  );
};
