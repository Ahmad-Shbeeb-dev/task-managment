import Link from "next/link";

import { Button } from "~/components/ui/Button";

export function Sections() {
  const sectionsData = [
    { name: "Classes", img: "/classes.svg", link: "/dashboard/classes" },
    { name: "Events", img: "/events.svg", link: "/dashboard/events" },
    { name: "Employees", img: "/employees.svg", link: "/dashboard/employees" },
  ];
  return (
    <>
      <div className="sections flex w-full flex-col gap-4 lg:flex-row">
        {sectionsData.map((section) => (
          <Link
            className="w-full"
            key={section.name}
            href={section.link ?? "/dashboard/home"}
          >
            <Button className="flex h-20 w-full basis-1/6 flex-col rounded-lg border bg-white p-4 text-center text-base shadow-md hover:bg-slate-100">
              <img src={section.img} alt="..." className="mx-auto h-12 w-12" />
              <p className="text-base font-semibold text-black">
                {section.name}
              </p>
            </Button>
          </Link>
        ))}
      </div>
    </>
  );
}
