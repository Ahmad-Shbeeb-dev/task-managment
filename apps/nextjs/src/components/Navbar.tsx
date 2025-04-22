"use client";

import type { INavbarLink } from "~/types";
import { NavbarLink } from "./NavbarLink";
import { TaskManagmentLogo } from "./TaskManagmentLogo";

interface Props {
  navbarOpened: boolean;
  NAVBAR_LINKS: readonly INavbarLink[];
}

export const Navbar = ({ navbarOpened, NAVBAR_LINKS }: Props) => {
  return (
    navbarOpened && (
      <div className="col-span-1 max-h-full min-h-screen bg-sky-500/75 dark:bg-sky-600/75">
        <div className="mb-20 flex flex-col items-center justify-center pt-8">
          <TaskManagmentLogo />
          <h1 className="text-xl font-extrabold text-white">Task Management</h1>
        </div>

        <div className="flex flex-col gap-7">
          {NAVBAR_LINKS.map((navbarLink) => (
            <NavbarLink key={navbarLink.id} {...navbarLink} />
          ))}
        </div>
      </div>
    )
  );
};
