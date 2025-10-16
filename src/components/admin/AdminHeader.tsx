
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdminHeaderProps {
  userEmail?: string;
  onLogout: () => void;
  onRefresh?: () => void;
}

export const AdminHeader = ({ userEmail, onLogout, onRefresh }: AdminHeaderProps) => {
  const { t } = useTranslation('admin');

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t('header.title')}</h1>
          <p className="text-muted-foreground">
            {t('header.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            {t('header.adminMode')} ({userEmail})
          </Badge>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('header.refresh')}
            </Button>
          )}
          <Button
            onClick={onLogout}
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {t('header.logout')}
          </Button>
        </div>
      </div>
    </div>
  );
};
