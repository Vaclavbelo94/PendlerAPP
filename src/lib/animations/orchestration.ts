/**
 * Animation orchestration helpers
 */

interface StaggerConfig {
  staggerChildren?: number;
  delayChildren?: number;
  staggerDirection?: 1 | -1;
}

export const createStaggerContainer = (config: StaggerConfig = {}) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: config.staggerChildren ?? 0.1,
      delayChildren: config.delayChildren ?? 0,
      staggerDirection: config.staggerDirection ?? 1
    }
  }
});

export const createStaggerItem = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { delay }
  }
});

export const createSequence = (items: any[], delay = 0.1) => {
  return items.map((item, index) => ({
    ...item,
    transition: {
      ...item.transition,
      delay: index * delay
    }
  }));
};
