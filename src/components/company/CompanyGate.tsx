import React from 'react';
import { useCompany } from '@/hooks/useCompany';
import { CompanyType } from '@/types/auth';

interface CompanyGateProps {
  children: React.ReactNode;
  allowedCompanies: CompanyType[];
  fallback?: React.ReactNode;
}

export const CompanyGate: React.FC<CompanyGateProps> = ({ 
  children, 
  allowedCompanies, 
  fallback = null 
}) => {
  const { company } = useCompany();
  
  if (!company || !allowedCompanies.includes(company)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default CompanyGate;