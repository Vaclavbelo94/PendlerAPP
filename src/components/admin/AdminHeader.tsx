
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, RefreshCw } from "lucide-react";

interface AdminHeaderProps {
  userEmail?: string;
  onLogout: () => void;
  onRefresh?: () => void;
}

export const AdminHeader = ({ userEmail, onLogout, onRefresh }: AdminHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Administrace</h1>
          <p className="text-muted-foreground">
            Kompletní správa aplikace s pokročilými funkcemi pro monitoring, analytics a správu uživatelů
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Admin režim ({userEmail})
          </Badge>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Obnovit
            </Button>
          )}
          <Button
            onClick={onLogout}
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Odhlásit se
          </Button>
        </div>
      </div>
    </div>
  );
};
