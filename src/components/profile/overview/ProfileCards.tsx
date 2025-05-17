
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BriefcaseIcon } from "lucide-react";

interface WorkPreferences {
  preferred_shift_type?: string;
  preferred_locations?: string[];
}

interface ProfileCardsProps {
  workPreferences: WorkPreferences | null;
  certificatesCount: number;
  getShiftTypeLabel: (type: string | undefined) => string;
}

const ProfileCards = ({ workPreferences, certificatesCount, getShiftTypeLabel }: ProfileCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      {workPreferences && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <BriefcaseIcon className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h4 className="font-medium">Pracovní preference</h4>
                <p className="text-sm text-muted-foreground">
                  Preferovaný typ směny: {getShiftTypeLabel(workPreferences.preferred_shift_type)}
                </p>
                {workPreferences.preferred_locations && workPreferences.preferred_locations.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Preferované lokality: {workPreferences.preferred_locations.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {certificatesCount > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mt-0.5 text-primary"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.8a2 2 0 0 0 1.4-.6L10.8 6a2 2 0 0 1 1.4-.6h2.8a2 2 0 0 1 1.4.6l1.4 1.4a2 2 0 0 0 1.4.6h2" />
                <path d="M12 13v3" />
                <path d="M10 16h4" />
              </svg>
              <div>
                <h4 className="font-medium">Vzdělání a certifikáty</h4>
                <p className="text-sm text-muted-foreground">
                  Počet certifikátů: {certificatesCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileCards;
