import type { ReactNode } from "react";
import { motion } from "framer-motion";

// Import animation variants
import {
  fadeIn,
  scaleUp,
  slideInFromBottom,
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "~/utils/animation";
import { cn } from "~/utils/ui";

// Base motion props
interface BaseProps {
  children?: ReactNode;
  className?: string;
  animateType?:
    | "fadeIn"
    | "slideInLeft"
    | "slideInRight"
    | "slideInTop"
    | "slideInBottom"
    | "scaleUp";
  delay?: number;
}

// Helper function to get variants based on animation type
const getVariants = (type?: string, delay = 0) => {
  switch (type) {
    case "fadeIn":
      return fadeIn(delay);
    case "slideInLeft":
      return slideInFromLeft(delay);
    case "slideInRight":
      return slideInFromRight(delay);
    case "slideInTop":
      return slideInFromTop(delay);
    case "slideInBottom":
      return slideInFromBottom(delay);
    case "scaleUp":
      return scaleUp(delay);
    default:
      return fadeIn(delay);
  }
};

// MotionDiv component
export const MotionDiv = ({
  children,
  className = "",
  animateType = "fadeIn",
  delay = 0,
  ...props
}: BaseProps) => {
  return (
    <motion.div
      className={cn("transition-all", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={getVariants(animateType, delay)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// MotionSection component
export const MotionSection = ({
  children,
  className = "",
  animateType = "fadeIn",
  delay = 0,
  ...props
}: BaseProps) => {
  return (
    <motion.section
      className={cn("transition-all", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={getVariants(animateType, delay)}
      {...props}
    >
      {children}
    </motion.section>
  );
};

// MotionCard component
export const MotionCard = ({
  children,
  className = "",
  animateType = "fadeIn",
  delay = 0,
  ...props
}: BaseProps) => {
  return (
    <motion.div
      className={cn(
        "bg-card text-card-foreground rounded-lg border p-4 shadow-sm transition-all",
        className,
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={getVariants(animateType, delay)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// MotionList component for staggered list animations
export const MotionList = ({
  children,
  className = "",
  ...props
}: BaseProps) => {
  return (
    <motion.ul
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.ul>
  );
};

// MotionListItem component for items in staggered lists
export const MotionListItem = ({
  children,
  className = "",
  ...props
}: BaseProps) => {
  return (
    <motion.li
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </motion.li>
  );
};

// MotionButton component
export const MotionButton = ({
  children,
  className = "",
  ...props
}: BaseProps) => {
  return (
    <motion.button
      className={cn("transition-all", className)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
