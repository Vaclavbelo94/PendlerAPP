
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Download,
  Filter,
  UserPlus
} from 'lucide-react';

interface UserManagementToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  selectedUsersCount: number;
  onShowFilters: () => void;
  onShowBulkActions: () => void;
  onExportUsers: () => void;
}

export const UserManagementToolbar: React.FC<UserManagementToolbarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedUsersCount,
  onShowFilters,
  onShowBulkActions,
  onExportUsers
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-1 gap-2 w-full sm:w-auto">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Hledat uživatele..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Všichni</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="regular">Běžní</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={onShowFilters}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        {selectedUsersCount > 0 && (
          <Button
            variant="outline"
            onClick={onShowBulkActions}
          >
            Hromadné akce ({selectedUsersCount})
          </Button>
        )}
        
        <Button variant="outline" onClick={onExportUsers}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Přidat uživatele
        </Button>
      </div>
    </div>
  );
};
