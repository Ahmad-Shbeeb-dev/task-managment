"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccordionItem } from "@radix-ui/react-accordion";
import { nanoid } from "nanoid";

import { cn } from "~/utils/ui";
import type { INavbarLink } from "~/types";
import { Accordion, AccordionContent, AccordionTrigger } from "./ui/Accordion";

const NavLink = ({ label, path, icon }: INavbarLink) => {
  const currentRoute = usePathname();

  return (
    <Link
      href={path}
      className={cn(
        " ml-4 px-6 py-2 text-left font-medium text-white hover:text-gray-300",
        {
          "rounded-l-full bg-white text-black hover:text-black":
            currentRoute === path,
        },
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <p className="text-sm md:text-base	">{label}</p>
      </div>
    </Link>
  );
};

export const NavbarLink = ({ subLinks, ...restProps }: INavbarLink) => {
  const currentRoute = usePathname();

  return subLinks && subLinks.length > 0 ? (
    <Accordion
      type="single"
      collapsible
      defaultValue={currentRoute.includes(restProps.path) ? restProps.id : ""}
      className={cn(
        "ml-4 w-full pl-6 pr-4 text-left font-medium text-white hover:text-gray-300",
      )}
    >
      <AccordionItem value={restProps.id}>
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            {restProps.icon}
            {restProps.label}
          </div>
        </AccordionTrigger>
        {subLinks.map((link) => (
          <AccordionContent key={nanoid()}>
            <div
              className={cn("flex", {
                "rounded-l-full bg-white text-black hover:text-black":
                  currentRoute.includes(link.path),
              })}
            >
              <NavLink {...link} />
            </div>
          </AccordionContent>
        ))}
      </AccordionItem>
    </Accordion>
  ) : (
    <NavLink {...restProps} />
  );
};
