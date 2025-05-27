
import { 
  Euro, 
  FileText, 
  Briefcase, 
  Heart, 
  Clock,
  Users,
  Baby,
  CalendarDays,
  BabyIcon,
  UserCheck,
  Scale
} from "lucide-react";

export const lawCategories = [
  { id: "work", label: "Pracovní právo", icon: <Briefcase className="h-5 w-5" /> },
  { id: "tax", label: "Daně", icon: <Euro className="h-5 w-5" /> },
  { id: "social", label: "Sociální zabezpečení", icon: <Users className="h-5 w-5" /> },
  { id: "health", label: "Zdravotní pojištění", icon: <Heart className="h-5 w-5" /> },
];

export const lawItems = [
  {
    id: "minimum-wage",
    title: "Minimální mzda",
    description: "Informace o minimální mzdě v Německu",
    category: "work",
    updated: "2025-04-15",
    icon: <Euro className="h-5 w-5 text-green-600" />,
    path: "/laws/minimum-wage"
  },
  {
    id: "tax-classes",
    title: "Daňové třídy",
    description: "Vysvětlení daňových tříd v Německu",
    category: "tax",
    updated: "2025-03-28",
    icon: <FileText className="h-5 w-5 text-yellow-600" />,
    path: "/laws/tax-classes"
  },
  {
    id: "health-insurance",
    title: "Zdravotní pojištění",
    description: "Jak funguje zdravotní pojištění v Německu",
    category: "health", 
    updated: "2025-04-02",
    icon: <Heart className="h-5 w-5 text-red-600" />,
    path: "/laws/health-insurance"
  },
  {
    id: "work-contract",
    title: "Pracovní smlouva",
    description: "Náležitosti pracovní smlouvy v Německu",
    category: "work",
    updated: "2025-03-18",
    icon: <Briefcase className="h-5 w-5 text-blue-600" />,
    path: "/laws/work-contract"
  },
  {
    id: "tax-return",
    title: "Daňové přiznání",
    description: "Jak podat daňové přiznání v Německu",
    category: "tax",
    updated: "2025-04-10",
    icon: <FileText className="h-5 w-5 text-yellow-600" />,
    path: "/laws/tax-return"
  },
  {
    id: "pension-insurance",
    title: "Důchodové pojištění",
    description: "Systém důchodového pojištění v Německu",
    category: "social",
    updated: "2025-03-25",
    icon: <Clock className="h-5 w-5 text-purple-600" />,
    path: "/laws/pension-insurance"
  },
  {
    id: "employee-protection",
    title: "Ochrana zaměstnanců",
    description: "Práva zaměstnanců a ochranné zákony",
    category: "work",
    updated: "2025-03-30",
    icon: <UserCheck className="h-5 w-5 text-blue-600" />,
    path: "/laws/employee-protection"
  },
  {
    id: "child-benefits",
    title: "Přídavky na děti",
    description: "Informace o příspěvku Kindergeld",
    category: "social",
    updated: "2025-04-05",
    icon: <Baby className="h-5 w-5 text-pink-600" />,
    path: "/laws/child-benefits"
  },
  {
    id: "working-hours",
    title: "Pracovní doba",
    description: "Pravidla pracovní doby v Německu",
    category: "work", 
    updated: "2025-05-10",
    icon: <Clock className="h-5 w-5 text-blue-600" />,
    path: "/laws/working-hours"
  },
  {
    id: "minimum-holidays",
    title: "Minimální dovolená",
    description: "Zákonný nárok na dovolenou v Německu",
    category: "work",
    updated: "2025-05-12",
    icon: <CalendarDays className="h-5 w-5 text-green-600" />,
    path: "/laws/minimum-holidays"
  },
  {
    id: "parental-allowance",
    title: "Rodičovský příspěvek",
    description: "Informace o příspěvku Elterngeld",
    category: "social",
    updated: "2025-05-15",
    icon: <BabyIcon className="h-5 w-5 text-pink-600" />,
    path: "/laws/parental-allowance"
  },
  {
    id: "legal-aid",
    title: "Právní pomoc",
    description: "Možnosti právní pomoci pro zahraniční pracovníky",
    category: "work",
    updated: "2025-05-08",
    icon: <Scale className="h-5 w-5 text-indigo-600" />,
    path: "/laws/legal-aid"
  },
];
