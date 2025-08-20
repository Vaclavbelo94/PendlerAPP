import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SettingsCategoryProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  onClick: () => void;
}

const SettingsCategory: React.FC<SettingsCategoryProps> = ({
  title,
  description,
  icon: Icon,
  colorClass,
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`p-6 cursor-pointer bg-gradient-to-br ${colorClass} border hover:shadow-lg transition-all duration-300 group`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-background/80 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </Card>
    </motion.div>
  );
};

export default SettingsCategory;