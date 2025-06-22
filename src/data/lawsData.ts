
import { Language } from '@/lib/i18n';

interface LawItem {
  id: string;
  title: string;
  description: string;
  category: string;
  updated: string;
  iconName: string;
  iconColor: string;
  path: string;
}

interface LawCategory {
  id: string;
  label: string;
}

export const getLawItems = (t: (key: string) => string): LawItem[] => [
  // Tax laws
  {
    id: 'minimum-wage',
    title: t('laws.minimumWage'),
    description: t('laws.minimumWageDescription'),
    category: 'tax',
    updated: '2025-05-15',
    iconName: 'Euro',
    iconColor: 'text-green-600',
    path: '/laws/minimum-wage'
  },
  {
    id: 'tax-classes',
    title: t('laws.taxClasses'),
    description: t('laws.taxClassesDescription'),
    category: 'tax',
    updated: '2025-03-28',
    iconName: 'FileText',
    iconColor: 'text-yellow-600',
    path: '/laws/tax-classes'
  },
  {
    id: 'tax-return',
    title: t('laws.taxReturn'),
    description: t('laws.taxReturnDescription'),
    category: 'tax',
    updated: '2025-04-10',
    iconName: 'FileText',
    iconColor: 'text-yellow-600',
    path: '/laws/tax-return'
  },
  
  // Work laws
  {
    id: 'work-contract',
    title: t('laws.workContract'),
    description: t('laws.workContractDescription'),
    category: 'work',
    updated: '2025-03-18',
    iconName: 'Briefcase',
    iconColor: 'text-blue-600',
    path: '/laws/work-contract'
  },
  {
    id: 'employee-protection',
    title: t('laws.employeeProtection'),
    description: t('laws.employeeProtectionDescription'),
    category: 'work',
    updated: '2025-03-30',
    iconName: 'UserCheck',
    iconColor: 'text-blue-600',
    path: '/laws/employee-protection'
  },
  {
    id: 'working-hours',
    title: t('laws.workingHours'),
    description: t('laws.workingHoursDescription'),
    category: 'work',
    updated: '2025-05-10',
    iconName: 'Clock',
    iconColor: 'text-blue-600',
    path: '/laws/working-hours'
  },
  {
    id: 'minimum-holidays',
    title: t('laws.minimumHolidays'),
    description: t('laws.minimumHolidaysDescription'),
    category: 'work',
    updated: '2025-05-12',
    iconName: 'CalendarDays',
    iconColor: 'text-purple-600',
    path: '/laws/minimum-holidays'
  },
  
  // Social security
  {
    id: 'pension-insurance',
    title: t('laws.pensionInsurance'),
    description: t('laws.pensionInsuranceDescription'),
    category: 'social',
    updated: '2025-04-25',
    iconName: 'Users',
    iconColor: 'text-purple-600',
    path: '/laws/pension-insurance'
  },
  {
    id: 'child-benefits',
    title: t('laws.childBenefits'),
    description: t('laws.childBenefitsDescription'),
    category: 'social',
    updated: '2025-04-05',
    iconName: 'Baby',
    iconColor: 'text-pink-600',
    path: '/laws/child-benefits'
  },
  {
    id: 'parental-allowance',
    title: t('laws.parentalAllowance'),
    description: t('laws.parentalAllowanceDescription'),
    category: 'social',
    updated: '2025-05-15',
    iconName: 'BabyIcon',
    iconColor: 'text-pink-600',
    path: '/laws/parental-allowance'
  },
  {
    id: 'legal-aid',
    title: t('laws.legalAid'),
    description: t('laws.legalAidDescription'),
    category: 'social',
    updated: '2025-04-20',
    iconName: 'Scale',
    iconColor: 'text-gray-600',
    path: '/laws/legal-aid'
  },
  
  // Health insurance
  {
    id: 'health-insurance',
    title: t('laws.healthInsuranceSystem'),
    description: t('laws.healthInsuranceSystemDescription'),
    category: 'health',
    updated: '2025-04-02',
    iconName: 'Heart',
    iconColor: 'text-red-600',
    path: '/laws/health-insurance'
  }
];

export const getLawCategories = (t: (key: string) => string): LawCategory[] => [
  { id: 'work', label: t('laws.workLaw') },
  { id: 'tax', label: t('laws.taxes') },
  { id: 'social', label: t('laws.socialSecurity') },
  { id: 'health', label: t('laws.healthInsurance') }
];
