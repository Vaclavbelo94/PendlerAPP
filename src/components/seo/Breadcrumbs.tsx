
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const routeNames: Record<string, string> = {
  '/': 'Domů',
  '/dashboard': 'Dashboard',
  '/vocabulary': 'Slovní zásoba',
  '/translator': 'Překladač',
  '/tax-advisor': 'Daňový poradce',
  '/calculator': 'Kalkulačky',
  '/laws': 'Právní přehled',
  '/shifts': 'Správa směn',
  '/vehicle': 'Vozidla',
  '/travel-planning': 'Plánování cest',
  '/settings': 'Nastavení',
  '/profile': 'Profil',
  '/premium': 'Premium',
  '/contact': 'Kontakt',
  '/faq': 'Časté otázky'
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ name: 'Domů', url: '/' }];
    
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const name = routeNames[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ name, url: currentPath });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground mb-4", className)}
    >
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.url}>
          {index === 0 ? (
            <Link 
              to={crumb.url} 
              className="flex items-center hover:text-foreground transition-colors"
              aria-label="Domovská stránka"
            >
              <Home className="h-4 w-4" />
            </Link>
          ) : index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium" aria-current="page">
              {crumb.name}
            </span>
          ) : (
            <Link 
              to={crumb.url} 
              className="hover:text-foreground transition-colors"
            >
              {crumb.name}
            </Link>
          )}
          
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
