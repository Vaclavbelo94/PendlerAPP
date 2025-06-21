
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface EnhancedLawCardProps {
  law: {
    id: string;
    title: string;
    description: string;
    category: string;
    updated: string;
    iconName: string;
    iconColor: string;
    path: string;
  };
  index?: number;
}

export const EnhancedLawCard: React.FC<EnhancedLawCardProps> = ({ law, index = 0 }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={cn(
        "group relative overflow-hidden h-full transition-all duration-300",
        "bg-white/10 backdrop-blur-md border border-white/20",
        "hover:bg-white/15 hover:border-white/30 hover:shadow-xl",
        "cursor-pointer"
      )}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className={cn(
              "p-2 rounded-lg",
              "bg-white/10 backdrop-blur-sm border border-white/20"
            )}>
              <div className={cn("text-lg", law.iconColor)}>
                {law.iconName === 'Euro' && '💶'}
                {law.iconName === 'FileText' && '📄'}
                {law.iconName === 'Heart' && '❤️'}
                {law.iconName === 'Briefcase' && '💼'}
                {law.iconName === 'Clock' && '🕐'}
                {law.iconName === 'UserCheck' && '✅'}
                {law.iconName === 'Baby' && '👶'}
                {law.iconName === 'BabyIcon' && '👶'}
                {law.iconName === 'CalendarDays' && '📅'}
                {law.iconName === 'Scale' && '⚖️'}
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className="bg-white/10 text-white border-white/20 text-xs"
            >
              {new Date(law.updated).toLocaleDateString('cs-CZ')}
            </Badge>
          </div>
          
          <CardTitle className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
            {law.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10 pt-0">
          <p className="text-white/80 text-sm mb-4 line-clamp-2">
            {law.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-white/60">
              <Clock className="h-3 w-3 mr-1" />
              {t('updated')}
            </div>
            
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="group/btn text-white hover:text-primary hover:bg-white/10 transition-all duration-200"
            >
              <Link to={law.path}>
                {t('readMore')}
                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
        
        {/* Hover effect border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-lg transition-all duration-300" />
      </Card>
    </motion.div>
  );
};

export default EnhancedLawCard;
