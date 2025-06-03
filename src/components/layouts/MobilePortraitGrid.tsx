
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { navigationItems, supportItems } from '@/components/layouts/sidebar/navigationData';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GridItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isPremium?: boolean;
  requiresAuth?: boolean;
  isPublic?: boolean;
  index: number;
}

const GridItem: React.FC<GridItemProps> = ({ 
  label, 
  href, 
  icon: Icon, 
  isPremium, 
  requiresAuth, 
  isPublic,
  index 
}) => {
  const navigate = useNavigate();
  const { user, isPremium: userIsPremium } = useAuth();
  
  const canAccess = isPublic || 
                   (requiresAuth && user) || 
                   (isPremium && userIsPremium);
  
  const handleClick = () => {
    if (isPremium && !userIsPremium) {
      navigate('/premium');
      return;
    }
    
    if (requiresAuth && !user) {
      navigate('/login');
      return;
    }
    
    navigate(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card 
        className={cn(
          "relative p-4 cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95",
          "min-h-[100px] flex flex-col items-center justify-center text-center",
          canAccess ? "hover:bg-primary/5" : "opacity-60"
        )}
        onClick={handleClick}
      >
        {/* Premium badge */}
        {isPremium && (
          <Badge 
            variant="secondary" 
            className="absolute top-1 right-1 text-xs px-1 py-0"
          >
            PRO
          </Badge>
        )}
        
        {/* Icon */}
        <div className={cn(
          "w-8 h-8 mb-2 flex items-center justify-center",
          isPremium && !userIsPremium ? "text-amber-500" : "text-primary"
        )}>
          <Icon className="h-6 w-6" />
        </div>
        
        {/* Label */}
        <h3 className="text-sm font-medium leading-tight">{label}</h3>
        
        {/* Lock indicator for premium */}
        {isPremium && !userIsPremium && (
          <div className="text-xs text-muted-foreground mt-1">
            🔒 Premium
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export const MobilePortraitGrid: React.FC = () => {
  // Combine navigation and support items
  const allItems = [...navigationItems, ...supportItems];
  
  return (
    <div className="p-4 space-y-6">
      {/* Main sections grid */}
      <div className="grid grid-cols-3 gap-3">
        {allItems.map((item, index) => (
          <GridItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            isPremium={item.isPremium}
            requiresAuth={item.requiresAuth}
            isPublic={item.isPublic}
            index={index}
          />
        ))}
      </div>
      
      {/* Quick info section */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Vyberte sekci pro pokračování</p>
      </div>
    </div>
  );
};

export default MobilePortraitGrid;
