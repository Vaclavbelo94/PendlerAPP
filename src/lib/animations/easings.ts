/**
 * Custom easing functions for animations
 */

export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.25, 0.1, 0.25, 1]
} as const;

export type EasingKey = keyof typeof easings;
