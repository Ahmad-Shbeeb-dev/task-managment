import { useMemo } from "react";
import moment from "moment";
import type { Components, Event, Formats } from "react-big-calendar";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { setHours, setMinutes, startOfToday } from "date-fns";

interface Props {
  startDate?: Date;
  endDate?: Date;
  activities?: Event[];
}

const randomColors = [
  "#F5DB70",
  "#74E8E0",
  "#42B4FF",
  "#8A42FF",
  "#FC7FB9",
  "#265985",
];

export const ReactCalendar = ({
  startDate = setMinutes(setHours(new Date(), 7), 0),
  endDate = setMinutes(setHours(new Date(), 19), 0),
  activities,
}: Props) => {
  moment.locale("en-GB");
  const localizer = momentLocalizer(moment);
  // const [myEvent, setmyEvent] = useState<Event[] | undefined>(events);
  // const [view, setView] = useState<View>(Views.WEEK);
  // const onView = useCallback((newView: View) => setView(newView), [setView]);
  const { components, formats } = useMemo(
    () => ({
      components: {
        toolbar: () => <></>,
      } satisfies Components,

      formats: {
        dayFormat: (date, culture, localizer) =>
          localizer?.format(date, "ddd", "en-GB") ?? "",
      } satisfies Formats,
    }),
    [],
  );

  return (
    <Calendar
      defaultView={Views.WEEK}
      defaultDate={startOfToday()}
      // view={view}
      // views={views}
      // onView={onView}
      events={activities}
      localizer={localizer}
      components={components}
      formats={formats}
      className="p-2"
      timeslots={2}
      min={startDate}
      max={endDate}
      // allDayAccessor="allDay"
      // showMultiDayTimes
    />
  );
};

// const components = {
//   week: {
//     header: ({ date, localizer }: { date: Date; localizer: DateLocalizer }) =>
//       localizer.format(date, "ddd"),
//   },
//   toolbar: () => {
//     return (
//       <></>
//       // <div className="relative m-4 ml-auto w-52">
//       //   <IconSearch className="absolute bottom-0 left-3 top-0 my-auto text-slate-400" />
//       //   <Input type="text" placeholder="Search" className="pl-12 pr-4" />
//       // </div>
//     );
//   },
// };
