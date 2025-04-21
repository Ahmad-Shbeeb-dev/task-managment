import { IconFileAnalytics, IconUserCircle } from "@tabler/icons-react";

import type { INavbarLink } from "~/types";

export const NAVBAR_LINKS: readonly INavbarLink[] = [
  {
    id: "home",
    path: "/dashboard/home",
    label: "Home",
    icon: <IconFileAnalytics size={20} stroke={1.5} />,
  },
  {
    id: "profile",
    path: "/dashboard/profile",
    label: "Profile",
    icon: <IconUserCircle size={20} stroke={1.5} />,
  },
] as const;

export type navbarLinkIds = (typeof NAVBAR_LINKS)[number]["id"];
