
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserAdminLogic } from "./user/useUserAdminLogic";
import { UserAdminHeader } from "./user/UserAdminHeader";
import { UserMobileCard } from "./user/UserMobileCard";
import { UserDesktopTable } from "./user/UserDesktopTable";
import { LoadingState, ErrorState, EmptyState } from "./user/UserAdminStates";

export const UserAdminPanel = () => {
  const isMobile = useIsMobile();
  const { users, isLoading, error, refetch, togglePremium } = useUserAdminLogic();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (users.length === 0) {
    return <EmptyState onRefresh={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <UserAdminHeader userCount={users.length} onRefresh={() => refetch()} />
      
      {isMobile ? (
        <div className="space-y-4">
          {users.map((user) => (
            <UserMobileCard 
              key={user.id} 
              user={user} 
              onTogglePremium={togglePremium}
            />
          ))}
        </div>
      ) : (
        <UserDesktopTable users={users} onTogglePremium={togglePremium} />
      )}
    </div>
  );
};
