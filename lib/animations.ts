import type { Transition, Variants } from "framer-motion";

// Shared animation transition config
export const smoothTransition: Transition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

// Factory for staggered fade-up variants
export function makeFadeUp(delay = 0.1): Variants {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        delay: i * delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };
}

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};
