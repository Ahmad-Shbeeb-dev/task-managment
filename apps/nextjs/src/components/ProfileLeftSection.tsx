import type { Dispatch, SetStateAction } from "react";
import type { Event } from "react-big-calendar";

import { cn } from "~/utils/ui";
import type { EmployeeDetailsType, SelectedClassState } from "~/types";
import { ReactCalendar } from "./ReactCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

interface Props {
  employeeDetails: EmployeeDetailsType;
  selectedClass?: SelectedClassState;
  setSelectedClass: Dispatch<SetStateAction<SelectedClassState | undefined>>;
}
export const ProfileLeftSection = ({
  employeeDetails,
  selectedClass,
  setSelectedClass,
}: Props) => {
  const TeacherClasses = employeeDetails?.Employee?.ClassTeachers;

  const selectedClassLessons = TeacherClasses?.filter((teacherClass) => {
    return (
      teacherClass.Class.id === selectedClass?.id &&
      teacherClass.Class.Lessons.some(
        (lesson) => lesson.classId === selectedClass?.id,
      )
    );
  })[0]?.Class.Lessons;

  let lessons: Event[] | undefined = [];

  if (selectedClassLessons && selectedClassLessons.length > 0) {
    lessons = selectedClassLessons.map((lesson) => ({
      title: lesson.LessonActivity?.name,
      start: lesson.startTime,
      end: lesson.endTime,
    }));
  }

  return (
    <div className="p-4">
      <Tabs defaultValue={selectedClass?.id} className="w-full">
        <TabsList>
          {TeacherClasses?.map(({ Class }, idx) => (
            <TabsTrigger
              key={Class.id}
              value={Class.id}
              className={cn("", { "ml-16": idx === 0 })}
              onClick={() =>
                setSelectedClass({ id: Class.id, name: Class.className })
              }
            >
              {Class.className}
            </TabsTrigger>
          ))}
        </TabsList>

        {TeacherClasses?.map(({ Class }) => (
          <TabsContent key={Class.id} value={Class.id}>
            <ReactCalendar activities={lessons} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
