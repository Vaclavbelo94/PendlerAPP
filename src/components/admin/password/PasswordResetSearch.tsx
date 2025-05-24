
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2 } from "lucide-react";

interface PasswordResetSearchProps {
  onSearch: (term: string) => void;
  isSearching: boolean;
}

export const PasswordResetSearch = ({ onSearch, isSearching }: PasswordResetSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="searchUser">Vyhledat uživatele</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="searchUser"
            placeholder="Zadejte email nebo jméno uživatele"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Hledám...
            </>
          ) : (
            "Hledat"
          )}
        </Button>
      </div>
    </div>
  );
};
