"use client";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
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
  const [parent] = useAutoAnimate({ easing: "linear" });
  const userRole = session.user.role as UserRole;

  const filteredNavLinks = NAVBAR_LINKS.filter(
    (link) =>
      !link.roles || (link.roles && userRole && link.roles.includes(userRole)),
  );

  return (
    <main
      className="grid grid-cols-5 bg-slate-100/80 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8"
      ref={parent}
    >
      <Navbar navbarOpened={navbarOpened} NAVBAR_LINKS={filteredNavLinks} />
      <div
        className={
          navbarOpened
            ? "col-span-4 flex flex-col md:col-span-4 lg:col-span-5 xl:col-span-7"
            : "col-span-5 flex flex-col md:col-span-5 lg:col-span-6 xl:col-span-8"
        }
      >
        <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
          <Header
            navbarOpened={navbarOpened}
            toggleNavbar={setNavbarOpened}
            session={session}
          />
          {children}
        </PageTitleContext.Provider>
      </div>
    </main>
  );
}
