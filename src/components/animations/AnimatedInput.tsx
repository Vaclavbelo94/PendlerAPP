import React from 'react';
import { motion } from 'framer-motion';
import { Input, InputProps } from '@/components/ui/input';
import { springConfigs } from '@/lib/animations/springs';

export const AnimatedInput: React.FC<InputProps> = (props) => {
  return (
    <motion.div
      whileFocus={{ scale: 1.02 }}
      transition={springConfigs.gentle}
    >
      <Input {...props} />
    </motion.div>
  );
};
