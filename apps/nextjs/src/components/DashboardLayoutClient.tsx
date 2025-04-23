"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocalStorage } from "usehooks-ts";

import type { Session } from "@acme/auth";
import type { UserRole } from "@acme/db";

import { NAVBAR_LINKS } from "~/utils/constants";
import { PageTitleContext } from "~/utils/context";
import { Header } from "./Header";
import { Navbar } from "./Navbar";

interface Props {
  children: React.ReactNode;
  session: Session;
}
export default function DashboardLayoutClient({ session, children }: Props) {
  const [navbarOpened, setNavbarOpened] = useLocalStorage(
    "navbarOpened",
    false,
  );
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const userRole = session.user.role as UserRole;

  const filteredNavLinks = NAVBAR_LINKS.filter(
    (link) =>
      !link.roles || (link.roles && userRole && link.roles.includes(userRole)),
  );

  return (
    <div className="flex min-h-screen bg-slate-100/80 dark:bg-gray-950">
      <AnimatePresence>
        {navbarOpened && (
          <div className="fixed left-0 top-0 z-50 h-full">
            <Navbar
              key="navbar"
              navbarOpened={navbarOpened}
              NAVBAR_LINKS={filteredNavLinks}
            />
          </div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex w-full flex-col"
        initial={false}
        animate={{
          marginLeft: navbarOpened ? "200px" : "0", // Adjust this value based on your navbar width
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
          <Header
            navbarOpened={navbarOpened}
            toggleNavbar={setNavbarOpened}
            session={session}
          />
          {children}
        </PageTitleContext.Provider>
      </motion.div>
    </div>
  );
}
