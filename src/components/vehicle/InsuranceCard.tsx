
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardHeaderWithAction } from "@/components/ui/card-header-with-action";
import { FlexContainer } from "@/components/ui/flex-container";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface InsuranceCardProps {
  vehicleId: string;
}

const InsuranceCard = ({ vehicleId }: InsuranceCardProps) => {
  const isMobile = useIsMobile();
  const [insurances, setInsurances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data pro ukázku
  useEffect(() => {
    setTimeout(() => {
      setInsurances([
        {
          id: "1",
          company: "Kooperativa",
          type: "Povinné ručení",
          status: "Platné",
          validUntil: "2025-05-23",
          validFrom: "2024-05-23",
          daysRemaining: 363,
          amount: 2400
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [vehicleId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeaderWithAction
        title="Informace o pojištění vozidla"
        action={{
          label: "Přidat pojištění",
          onClick: () => console.log("Add insurance"),
          icon: <Plus className="h-4 w-4" />
        }}
      />
      <CardContent className={cn("space-y-4", isMobile ? "px-4 pb-4" : "px-6 pb-6")}>
        {insurances.length === 0 ? (
          <FlexContainer direction="col" align="center" justify="center" className="py-8">
            <Shield className={cn("text-muted-foreground mb-2", isMobile ? "h-8 w-8" : "h-10 w-10")} />
            <p className={cn("text-muted-foreground text-center", isMobile ? "text-sm" : "text-base")}>
              Nemáte přidané žádné pojištění
            </p>
          </FlexContainer>
        ) : (
          insurances.map((insurance: any) => (
            <Card key={insurance.id} className="border-l-4 border-l-primary">
              <CardContent className={cn("p-4", isMobile ? "p-3" : "")}>
                <FlexContainer 
                  direction={isMobile ? "col" : "row"} 
                  justify="between" 
                  align={isMobile ? "start" : "center"}
                  gap="sm"
                  className="mb-3"
                >
                  <div className="flex-1">
                    <FlexContainer align="center" gap="sm" className="mb-1">
                      <h4 className={cn("font-semibold", isMobile ? "text-sm" : "text-base")}>
                        {insurance.company}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                          isMobile ? "text-xs" : "text-sm"
                        )}
                      >
                        {insurance.status}
                      </Badge>
                    </FlexContainer>
                    <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                      {insurance.type}
                    </p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size={isMobile ? "sm" : "default"}
                    className="min-h-[44px]"
                  >
                    <Edit className="h-4 w-4" />
                    {!isMobile && <span className="ml-2">Upravit</span>}
                  </Button>
                </FlexContainer>

                <FlexContainer 
                  direction={isMobile ? "col" : "row"} 
                  justify="between" 
                  gap="sm"
                  className="text-sm"
                >
                  <FlexContainer direction="col" gap="xs">
                    <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                      Platnost
                    </span>
                    <span className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>
                      {new Date(insurance.validFrom).toLocaleDateString('cs-CZ')} - {' '}
                      {new Date(insurance.validUntil).toLocaleDateString('cs-CZ')}
                    </span>
                    <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                      Platné ({insurance.daysRemaining} dnů)
                    </span>
                  </FlexContainer>
                  
                  {!isMobile && (
                    <FlexContainer direction="col" align="end" gap="xs">
                      <span className="text-muted-foreground text-sm">
                        Částka
                      </span>
                      <span className="font-bold text-lg">
                        {insurance.amount.toLocaleString('cs-CZ')} Kč
                      </span>
                    </FlexContainer>
                  )}
                </FlexContainer>

                {isMobile && (
                  <FlexContainer justify="between" align="center" className="mt-3 pt-3 border-t">
                    <span className="text-muted-foreground text-xs">Částka</span>
                    <span className="font-bold text-base">
                      {insurance.amount.toLocaleString('cs-CZ')} Kč
                    </span>
                  </FlexContainer>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default InsuranceCard;
