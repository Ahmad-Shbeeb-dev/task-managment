"use client";

import Link from "next/link";

import { Activities } from "~/components/Activities";
import { Attendance } from "~/components/Attendance";
import { Sections } from "~/components/Sections";
import { Tabs } from "~/components/Tabs";
import { Button } from "~/components/ui/Button";
import { Calendar } from "~/components/ui/Calendar";

export default function ClassPage() {
  return (
    <>
      <div className="flex w-full flex-row">
        <div className="flex w-full flex-col  gap-4 bg-white p-10">
          <Tabs />
          <Sections />
          <div className="flex flex-col gap-10   lg:flex-row">
            <Attendance />
            <div className="w-full">
              <Activities />
            </div>
            <div className="ml-auto ">
              <Button
                asChild
                className="mb-4 ml-[25%] bg-[#95D354] p-4 hover:bg-[#84b84c]"
              >
                <Link href="/dashboard/children/add-child">Add New Child+</Link>
              </Button>
              <Calendar
                className="rounded-lg bg-white shadow-md"
                selected={new Date()}
                classNames={{
                  day_today: "bg-lime-500 text-accent-foreground",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/*classes form design start*/}

      {/* <TabsBar /> */}

      {/*classes form design end*/}
    </>
  );
}
