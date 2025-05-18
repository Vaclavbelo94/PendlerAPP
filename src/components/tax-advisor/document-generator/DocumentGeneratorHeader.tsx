
import React from "react";
import {
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DocumentGeneratorHeaderProps {
  onLoadProfile: () => void;
  isLoadingProfile: boolean;
}

const DocumentGeneratorHeader: React.FC<DocumentGeneratorHeaderProps> = ({
  onLoadProfile,
  isLoadingProfile,
}) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <CardTitle>Generátor daňových dokumentů</CardTitle>
        <CardDescription>
          Vytvořte předvyplněné dokumenty pro německá daňová přiznání
        </CardDescription>
      </div>
      {user && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onLoadProfile} 
          disabled={isLoadingProfile}
          className="self-start"
        >
          {isLoadingProfile ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Načítání...
            </>
          ) : (
            "Načíst údaje z profilu"
          )}
        </Button>
      )}
    </div>
  );
};

export default DocumentGeneratorHeader;
