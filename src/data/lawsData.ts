
import { useTranslation } from 'react-i18next';

export interface LawItem {
  id: string;
  title: string;
  description: string;
  category: string;
  updated: string;
  iconName: string;
  iconColor: string;
  path: string;
}

export const getLawItems = (t: any): LawItem[] => [
  // Work Law Category
  {
    id: "minimum-wage",
    title: t('minimumWage'),
    description: t('minimumWageDescription'),
    category: "work",
    updated: "2025-01-01",
    iconName: "Euro",
    iconColor: "text-green-600",
    path: "/laws/minimum-wage"
  },
  {
    id: "work-contract",
    title: t('workContract'),
    description: t('workContractDescription'),
    category: "work",
    updated: "2025-01-01",
    iconName: "FileText",
    iconColor: "text-blue-600",
    path: "/laws/work-contract"
  },
  {
    id: "working-hours",
    title: t('workingHours'),
    description: t('workingHoursDescription'),
    category: "work",
    updated: "2025-01-01",
    iconName: "Clock",
    iconColor: "text-purple-600",
    path: "/laws/working-hours"
  },
  {
    id: "minimum-holidays",
    title: t('minimumHolidays'),
    description: t('minimumHolidaysDescription'),
    category: "work",
    updated: "2025-01-01",
    iconName: "CalendarDays",
    iconColor: "text-orange-600",
    path: "/laws/minimum-holidays"
  },
  {
    id: "employee-protection",
    title: t('employeeProtection'),
    description: t('employeeProtectionDescription'),
    category: "work",
    updated: "2025-01-01",
    iconName: "UserCheck",
    iconColor: "text-indigo-600",
    path: "/laws/employee-protection"
  },

  // Tax Category
  {
    id: "tax-return",
    title: t('taxReturn'),
    description: t('taxReturnDescription'),
    category: "tax",
    updated: "2025-01-01",
    iconName: "FileText",
    iconColor: "text-yellow-600",
    path: "/laws/tax-return"
  },
  {
    id: "tax-classes",
    title: t('taxClasses'),
    description: t('taxClassesDescription'),
    category: "tax",
    updated: "2025-01-01",
    iconName: "Users",
    iconColor: "text-green-600",
    path: "/laws/tax-classes"
  },

  // Social Category
  {
    id: "pension-insurance",
    title: t('pensionInsurance'),
    description: t('pensionInsuranceDescription'),
    category: "social",
    updated: "2025-01-01",
    iconName: "Users",
    iconColor: "text-blue-600",
    path: "/laws/pension-insurance"
  },
  {
    id: "child-benefits",
    title: t('childBenefits'),
    description: t('childBenefitsDescription'),
    category: "social",
    updated: "2025-01-01",
    iconName: "Baby",
    iconColor: "text-pink-600",
    path: "/laws/child-benefits"
  },
  {
    id: "parental-allowance",
    title: t('parentalAllowance'),
    description: t('parentalAllowanceDescription'),
    category: "social",
    updated: "2025-01-01",
    iconName: "BabyIcon",
    iconColor: "text-purple-600",
    path: "/laws/parental-allowance"
  },

  // Health Category
  {
    id: "health-insurance-system",
    title: t('healthInsurance'),
    description: t('healthInsuranceSystemDescription'),
    category: "health",
    updated: "2025-01-01",
    iconName: "Heart",
    iconColor: "text-red-600",
    path: "/laws/health-insurance-system"
  },
  {
    id: "legal-aid",
    title: t('legalAid'),
    description: t('legalAidDescription'),
    category: "health",
    updated: "2025-01-01",
    iconName: "Scale",
    iconColor: "text-teal-600",
    path: "/laws/legal-aid"
  }
];

export const getLawCategories = (t: any) => [
  {
    id: "work",
    label: t('work'),
    iconName: "Briefcase",
    description: t('workLawDescription')
  },
  {
    id: "tax",
    label: t('tax'),
    iconName: "FileText",
    description: t('taxesDescription')
  },
  {
    id: "social",
    label: t('social'),
    iconName: "Users",
    description: t('socialSecurityDescription')
  },
  {
    id: "health",
    label: t('health'),
    iconName: "Heart",
    description: t('healthInsuranceDescription')
  }
];
