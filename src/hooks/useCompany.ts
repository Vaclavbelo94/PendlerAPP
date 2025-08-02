import { useAuth } from '@/hooks/auth';
import { CompanyType } from '@/types/auth';

export const useCompany = () => {
  const { unifiedUser } = useAuth();
  
  const getCompanyFromStorage = (): CompanyType | null => {
    const stored = localStorage.getItem('selectedCompany');
    if (stored && ['adecco', 'randstad', 'dhl'].includes(stored)) {
      return stored as CompanyType;
    }
    return null;
  };

  const company = unifiedUser?.company || getCompanyFromStorage() || CompanyType.DHL; // Temporary fallback for debugging
  
  // Debug logging
  console.log('🏢 useCompany Debug:', {
    unifiedUserCompany: unifiedUser?.company,
    storageCompany: getCompanyFromStorage(),
    finalCompany: company,
    unifiedUser
  });

  const setCompany = (newCompany: CompanyType) => {
    localStorage.setItem('selectedCompany', newCompany);
    window.location.reload(); // Force reload to update the hook
  };
  
  const isAdecco = company === CompanyType.ADECCO;
  const isRandstad = company === CompanyType.RANDSTAD;
  const isDHL = company === CompanyType.DHL;
  
  const showWechselschicht = isDHL;
  const showGeneralShifts = isAdecco || isRandstad;
  
  return {
    company,
    setCompany,
    isAdecco,
    isRandstad,
    isDHL,
    showWechselschicht,
    showGeneralShifts,
    getCompanyFromStorage
  };
};