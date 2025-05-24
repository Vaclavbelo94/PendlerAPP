
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
}

interface ResetLinksDisplayProps {
  resetLinks: {[key: string]: string};
  users: User[];
  onCopyLink: (link: string) => void;
}

export const ResetLinksDisplay = ({ resetLinks, users, onCopyLink }: ResetLinksDisplayProps) => {
  if (!resetLinks || Object.keys(resetLinks).length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 pt-4">
      <h3 className="text-lg font-medium">Vygenerované odkazy pro reset hesla</h3>
      <div className="space-y-2">
        {Object.entries(resetLinks).map(([userId, link]) => {
          const user = users.find(u => u.id === userId);
          return (
            <div key={userId} className="flex flex-col gap-2 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onCopyLink(link)}
                  className="gap-1"
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Kopírovat</span>
                </Button>
              </div>
              <div className="rounded-md bg-muted p-2 text-xs font-mono overflow-x-auto">
                {link}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
