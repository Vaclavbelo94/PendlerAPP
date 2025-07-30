import { useMemo } from 'react';
import { useAuth } from '@/hooks/auth';
import { UserRole } from '@/types/auth';

export interface AuthPermissions {
  // Role checks
  isAdmin: boolean;
  isDHLAdmin: boolean;
  isDHLEmployee: boolean;
  isCompanyEmployee: boolean;
  isPremium: boolean;
  
  // Feature access
  canAccessDHLFeatures: boolean;
  canAccessAdminPanel: boolean;
  canAccessPremiumFeatures: boolean;
  canAccessOvertimeModule: boolean;
  
  // Effective permissions
  effectiveRole: UserRole;
  companyType: string | null;
}

/**
 * Centrální hook pro správu všech oprávnění uživatelů
 * Implementuje jasnou hierarchii rolí a automatické Premium pro zaměstnance
 */
export const useAuthPermissions = (): AuthPermissions => {
  const { unifiedUser, isLoading } = useAuth();

  return useMemo(() => {
    // Pokud ještě načítáme data, vrátíme základní oprávnění
    if (isLoading || !unifiedUser) {
      return {
        isAdmin: false,
        isDHLAdmin: false,
        isDHLEmployee: false,
        isCompanyEmployee: false,
        isPremium: false,
        canAccessDHLFeatures: false,
        canAccessAdminPanel: false,
        canAccessPremiumFeatures: false,
        canAccessOvertimeModule: false,
        effectiveRole: UserRole.STANDARD,
        companyType: null,
      };
    }

    // Základní role kontroly
    const isAdmin = unifiedUser.role === UserRole.ADMIN || unifiedUser.role === UserRole.DHL_ADMIN;
    const isDHLAdmin = unifiedUser.role === UserRole.DHL_ADMIN;
    const isDHLEmployee = unifiedUser.isDHLEmployee || unifiedUser.role === UserRole.DHL_EMPLOYEE || unifiedUser.role === UserRole.DHL_ADMIN;
    const isCompanyEmployee = isDHLEmployee || unifiedUser.isAdeccoEmployee || unifiedUser.isRandstadEmployee;
    
    // Automatické Premium pro všechny zaměstnance + regulární Premium uživatele
    const isPremium = isCompanyEmployee || unifiedUser.isPremium || unifiedUser.role === UserRole.PREMIUM || isAdmin;

    // Hierarchie rolí - vyšší role mají přístup k nižším funkcím
    const roleHierarchy = {
      [UserRole.STANDARD]: 1,
      [UserRole.PREMIUM]: 2,
      [UserRole.DHL_EMPLOYEE]: 3,
      [UserRole.ADECCO_EMPLOYEE]: 3,
      [UserRole.RANDSTAD_EMPLOYEE]: 3,
      [UserRole.ADMIN]: 4,
      [UserRole.DHL_ADMIN]: 4
    };

    // Efektivní role - nejvy��í role kterou uživatel má
    let effectiveRole = unifiedUser.role;
    if (isAdmin) {
      effectiveRole = isDHLAdmin ? UserRole.DHL_ADMIN : UserRole.ADMIN;
    } else if (isCompanyEmployee && !isPremium) {
      // Zajistíme, že zaměstnanci mají minimálně Premium roli
      effectiveRole = isDHLEmployee ? UserRole.DHL_EMPLOYEE : UserRole.PREMIUM;
    }

    // Specifické oprávnění funkcí
    const canAccessDHLFeatures = isDHLEmployee || isAdmin;
    const canAccessAdminPanel = isAdmin;
    const canAccessPremiumFeatures = isPremium;
    const canAccessOvertimeModule = isDHLEmployee || isAdmin;

    // Typ společnosti
    const companyType = unifiedUser.company || (isDHLEmployee ? 'dhl' : null);

    return {
      isAdmin,
      isDHLAdmin,
      isDHLEmployee,
      isCompanyEmployee,
      isPremium,
      canAccessDHLFeatures,
      canAccessAdminPanel,
      canAccessPremiumFeatures,
      canAccessOvertimeModule,
      effectiveRole,
      companyType,
    };
  }, [unifiedUser, isLoading]);
};

/**
 * Helper hook pro rychlé kontroly oprávnění
 */
export const useHasPermission = () => {
  const permissions = useAuthPermissions();
  
  return {
    /**
     * Kontrola přístupu k funkci podle požadované role
     */
    hasRoleAccess: (requiredRole: UserRole): boolean => {
      const roleHierarchy = {
        [UserRole.STANDARD]: 1,
        [UserRole.PREMIUM]: 2,
        [UserRole.DHL_EMPLOYEE]: 3,
        [UserRole.ADECCO_EMPLOYEE]: 3,
        [UserRole.RANDSTAD_EMPLOYEE]: 3,
        [UserRole.ADMIN]: 4,
        [UserRole.DHL_ADMIN]: 4
      };
      
      return roleHierarchy[permissions.effectiveRole] >= roleHierarchy[requiredRole];
    },
    
    /**
     * Kontrola přístupu k premium funkci
     */
    hasPremiumAccess: (): boolean => permissions.canAccessPremiumFeatures,
    
    /**
     * Kontrola přístupu k DHL funkcím
     */
    hasDHLAccess: (): boolean => permissions.canAccessDHLFeatures,
    
    /**
     * Kontrola přístupu k admin panelu
     */
    hasAdminAccess: (): boolean => permissions.canAccessAdminPanel,
    
    /**
     * Kontrola přístupu k modulu přesčasů
     */
    hasOvertimeAccess: (): boolean => permissions.canAccessOvertimeModule,
    
    permissions
  };
};