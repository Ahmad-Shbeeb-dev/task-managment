import type { Variants } from "framer-motion";

// Reusable animation variants
export const fadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay,
      duration: 0.4,
      ease: "easeInOut",
    },
  },
});

export const slideInFromLeft = (delay = 0): Variants => ({
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
});

export const slideInFromRight = (delay = 0): Variants => ({
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
});

export const slideInFromTop = (delay = 0): Variants => ({
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
});

export const slideInFromBottom = (delay = 0): Variants => ({
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
});

// Scale animations
export const scaleUp = (delay = 0): Variants => ({
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      delay,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
});

// List item stagger animation
export const staggerContainer = (staggerChildren = 0.05): Variants => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren: 0.1,
    },
  },
});

// Hover animations
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

// Page transitions
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Navbar animation
export const navbarAnimation = (isOpen: boolean): Variants => ({
  open: {
    width: "auto",
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  closed: {
    width: 0,
    opacity: 0,
    x: -20,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
});

// Navbar item animation
export const navbarItemAnimation: Variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};
