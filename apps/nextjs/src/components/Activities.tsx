"use client";

import Link from "next/link";
import { format } from "date-fns";

import { api } from "~/utils/api";
import { Button } from "./ui/Button";

export function Activities() {
  const { data: events } = api.event.getAllEvents.useQuery();
  return (
    <>
      <div className=" flex flex-row items-center justify-between">
        <h1 className="text-lg font-semibold">Events Today</h1>
        <Button className="rounded-lg bg-[#95D354] pb-4 text-4xl font-light hover:bg-[#84b84c]">
          <Link href="/dashboard/events/add-event">+ </Link>
        </Button>
      </div>
      {events
        ?.filter(
          (event) =>
            event.startDate &&
            format(event.startDate, "dd/MM/yyyy") ===
              format(new Date(), "dd/MM/yyyy"),
        )
        .map((event, index) => (
          <div
            key={index}
            className="my-4 rounded-lg px-4 py-2 text-slate-100"
            style={{ backgroundColor: event.EventType?.color ?? "" }}
          >
            <h1>{event.eventName}</h1>
            <p>
              {event.startDate && format(event.startDate, "hh:mm a")} to{" "}
              {event.endDate && format(event.endDate, "hh:mm a")}
            </p>
          </div>
        ))}
    </>
  );
}
