"use client";

import { motion } from "framer-motion";

import type { INavbarLink } from "~/types";
import { NavbarLink } from "./NavbarLink";
import { TaskManagmentLogo } from "./TaskManagmentLogo";

interface Props {
  navbarOpened: boolean;
  NAVBAR_LINKS: readonly INavbarLink[];
}

export const Navbar = ({ navbarOpened, NAVBAR_LINKS }: Props) => {
  return (
    <motion.div
      className="h-full w-[200px] overflow-hidden bg-sky-500/75 dark:bg-sky-900/75"
      initial={{ width: 0, opacity: 0, x: -20 }}
      animate={{ width: "200px", opacity: 1, x: 0 }}
      exit={{ width: 0, opacity: 0, x: -20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <motion.div
        className="mb-20 flex flex-col items-center justify-center pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <TaskManagmentLogo />
        <h1 className="text-xl font-extrabold text-white">Task Management</h1>
      </motion.div>

      <motion.div
        className="flex flex-col gap-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {NAVBAR_LINKS.map((navbarLink, index) => (
          <motion.div
            key={navbarLink.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
            className="w-full"
          >
            <NavbarLink {...navbarLink} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
