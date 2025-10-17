/**
 * Spring animation configurations
 */

export const springConfigs = {
  gentle: {
    type: "spring" as const,
    stiffness: 120,
    damping: 14
  },
  wobbly: {
    type: "spring" as const,
    stiffness: 180,
    damping: 12
  },
  stiff: {
    type: "spring" as const,
    stiffness: 400,
    damping: 17
  },
  slow: {
    type: "spring" as const,
    stiffness: 80,
    damping: 20
  },
  bouncy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 10
  },
  smooth: {
    type: "spring" as const,
    stiffness: 100,
    damping: 15
  }
};

export const transitionConfigs = {
  fast: { duration: 0.2 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  verySlow: { duration: 0.8 }
};
