
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserManagement } from './hooks/useUserManagement';
import { UserManagementHeader } from './UserManagementHeader';
import { UserManagementToolbar } from './UserManagementToolbar';
import { UserManagementTable } from './UserManagementTable';
import { UserDetailsDialog } from './UserDetailsDialog';
import { BulkActionsDialog } from './BulkActionsDialog';
import { UserFilters } from './UserFilters';

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    users,
    isLoading,
    stats,
    togglePremium,
    toggleAdmin,
    deleteUser,
    exportUsers,
    refetch
  } = useUserManagement();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'premium' && user.is_premium) ||
                         (statusFilter === 'admin' && user.is_admin) ||
                         (statusFilter === 'regular' && !user.is_premium && !user.is_admin);
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserManagementHeader stats={stats} />

      <UserManagementToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        selectedUsersCount={selectedUsers.length}
        onShowFilters={() => setShowFilters(!showFilters)}
        onShowBulkActions={() => setShowBulkActions(true)}
        onExportUsers={exportUsers}
      />

      {showFilters && (
        <UserFilters onFiltersChange={() => refetch()} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Správa uživatelů</CardTitle>
          <CardDescription>
            Kompletní přehled a správa všech uživatelů v systému
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onTogglePremium={togglePremium}
            onToggleAdmin={toggleAdmin}
            onDeleteUser={deleteUser}
            onViewUser={setSelectedUser}
          />
        </CardContent>
      </Card>

      {selectedUser && (
        <UserDetailsDialog
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {showBulkActions && (
        <BulkActionsDialog
          selectedUsers={selectedUsers}
          onClose={() => setShowBulkActions(false)}
          onComplete={() => {
            setSelectedUsers([]);
            setShowBulkActions(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};
