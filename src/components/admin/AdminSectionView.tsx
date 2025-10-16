
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdminSectionViewProps {
  section: {
    id: string;
    title: string;
    description: string;
    component: React.ReactNode;
  } | undefined;
  userEmail?: string;
  onBack: () => void;
  onLogout: () => void;
}

export const AdminSectionView = ({ section, userEmail, onBack, onLogout }: AdminSectionViewProps) => {
  const { t } = useTranslation('admin');

  if (!section) return null;

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              {t('sectionView.backToOverview')}
            </Button>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{section.title}</h1>
            <p className="text-muted-foreground">
              {section.description}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              {t('sectionView.adminMode')}
            </Badge>
            <Button
              onClick={onLogout}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {t('sectionView.logout')}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {section.component}
      </div>
    </div>
  );
};
