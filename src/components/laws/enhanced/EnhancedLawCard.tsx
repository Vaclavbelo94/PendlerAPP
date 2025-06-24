
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Law } from '@/types/laws';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface EnhancedLawCardProps {
  law: Law;
  index: number;
  onViewDetails: (law: Law) => void;
}

export const EnhancedLawCard: React.FC<EnhancedLawCardProps> = ({
  law,
  index,
  onViewDetails
}) => {
  const { t } = useTranslation(['laws', 'common']);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'work':
        return t('laws:workLaw');
      case 'tax':
        return t('laws:taxes');
      case 'social':
        return t('laws:socialSecurity');
      case 'health':
        return t('laws:healthInsurance');
      default:
        return category;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className={cn(
        "h-full transition-all duration-300 hover:shadow-lg border-l-4",
        law.category === 'work' && "border-l-blue-500",
        law.category === 'tax' && "border-l-green-500", 
        law.category === 'social' && "border-l-purple-500",
        law.category === 'health' && "border-l-red-500"
      )}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="text-xs">
              {getCategoryLabel(law.category)}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{law.lastUpdated}</span>
            </div>
          </div>
          
          <CardTitle className="text-lg leading-tight">
            {law.title}
          </CardTitle>
          
          <CardDescription className="line-clamp-2">
            {law.summary}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mb-4">
            {law.tags?.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{law.importance}/5</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(law)}
                className="gap-1"
              >
                <BookOpen className="h-3 w-3" />
                {t('common:readMore')}
              </Button>
              
              {law.officialUrl && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewDetails(law)}
                  className="gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedLawCard;
