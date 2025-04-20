"use client";

import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import type { Session } from "@acme/auth";

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

  return (
    <main className="grid grid-cols-5 bg-slate-100/80 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
      <Navbar navbarOpened={navbarOpened} NAVBAR_LINKS={NAVBAR_LINKS} />
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
