
import { useLanguage } from '@/hooks/useLanguage';

export const getLawCategories = (t: (key: string) => string) => [
  { id: "work", label: t('workLaw'), iconName: "Briefcase" },
  { id: "tax", label: t('taxes'), iconName: "Euro" },
  { id: "social", label: t('socialSecurity'), iconName: "Users" },
  { id: "health", label: t('healthInsurance'), iconName: "Heart" },
];

export const getLawItems = (t: (key: string) => string) => [
  {
    id: "minimum-wage",
    title: t('minimumWage'),
    description: t('minimumWageDescription'),
    category: "work",
    updated: "2025-01-15",
    iconName: "Euro",
    iconColor: "text-green-600",
    path: "/laws/minimum-wage"
  },
  {
    id: "tax-classes",
    title: t('taxClasses'),
    description: t('taxClassesDescription'),
    category: "tax",
    updated: "2025-01-10",
    iconName: "FileText",
    iconColor: "text-yellow-600",
    path: "/laws/tax-classes"
  },
  {
    id: "health-insurance",
    title: t('healthInsuranceSystem'),
    description: t('healthInsuranceSystemDescription'),
    category: "health", 
    updated: "2025-01-20",
    iconName: "Heart",
    iconColor: "text-red-600",
    path: "/laws/health-insurance"
  },
  {
    id: "work-contract",
    title: t('workContract'),
    description: t('workContractDescription'),
    category: "work",
    updated: "2025-01-12",
    iconName: "Briefcase",
    iconColor: "text-blue-600",
    path: "/laws/work-contract"
  },
  {
    id: "tax-return",
    title: t('taxReturn'),
    description: t('taxReturnDescription'),
    category: "tax",
    updated: "2025-01-18",
    iconName: "FileText",
    iconColor: "text-yellow-600",
    path: "/laws/tax-return"
  },
  {
    id: "pension-insurance",
    title: t('pensionInsurance'),
    description: t('pensionInsuranceDescription'),
    category: "social",
    updated: "2025-01-08",
    iconName: "Clock",
    iconColor: "text-purple-600",
    path: "/laws/pension-insurance"
  },
  {
    id: "employee-protection",
    title: t('employeeProtection'),
    description: t('employeeProtectionDescription'),
    category: "work",
    updated: "2025-01-14",
    iconName: "UserCheck",
    iconColor: "text-blue-600",
    path: "/laws/employee-protection"
  },
  {
    id: "child-benefits",
    title: t('childBenefits'),
    description: t('childBenefitsDescription'),
    category: "social",
    updated: "2025-01-22",
    iconName: "Baby",
    iconColor: "text-pink-600",
    path: "/laws/child-benefits"
  },
  {
    id: "working-hours",
    title: t('workingHours'),
    description: t('workingHoursDescription'),
    category: "work", 
    updated: "2025-01-16",
    iconName: "Clock",
    iconColor: "text-blue-600",
    path: "/laws/working-hours"
  },
  {
    id: "minimum-holidays",
    title: t('minimumHolidays'),
    description: t('minimumHolidaysDescription'),
    category: "work",
    updated: "2025-01-11",
    iconName: "CalendarDays",
    iconColor: "text-green-600",
    path: "/laws/minimum-holidays"
  },
  {
    id: "parental-allowance",
    title: t('parentalAllowance'),
    description: t('parentalAllowanceDescription'),
    category: "social",
    updated: "2025-01-19",
    iconName: "BabyIcon",
    iconColor: "text-pink-600",
    path: "/laws/parental-allowance"
  },
  {
    id: "legal-aid",
    title: t('legalAid'),
    description: t('legalAidDescription'),
    category: "work",
    updated: "2025-01-13",
    iconName: "Scale",
    iconColor: "text-indigo-600",
    path: "/laws/legal-aid"
  },
];
