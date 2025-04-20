import type { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";

import { api } from "~/utils/api";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";
import { ScrollArea } from "./ui/ScrollArea";

interface Props {
  firstConfirmDialogOpen: boolean;
  setFirstConfirmDialogOpen: Dispatch<SetStateAction<boolean>>;
  setSecondConfirmDeleteActivity: Dispatch<SetStateAction<boolean>>;
  activityId: string;
}

export const FirstDeleteActivityDialog = ({
  firstConfirmDialogOpen,
  setFirstConfirmDialogOpen,
  setSecondConfirmDeleteActivity,
  activityId,
}: Props) => {
  const { data: lessonsRelated } = api.class.getLessonActivityLessons.useQuery({
    id: activityId,
  });

  const allClassesNames = lessonsRelated?.map((lesson) => {
    return lesson.Class.className;
  });

  const uniqueClasses = [...new Set(allClassesNames)];

  return (
    <Dialog
      open={firstConfirmDialogOpen}
      onOpenChange={setFirstConfirmDialogOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">
            WARNING : deleting this activity will result in deleting all the
            lessons with this activity : <br />
            <ScrollArea className="my-6 h-40 rounded-lg border px-4 py-2 shadow-md">
              {uniqueClasses.map((className, index) => {
                const result = lessonsRelated?.map((lesson) => {
                  const days = [
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thr",
                    "Fri",
                    "Sat",
                  ];
                  const startTime = format(lesson.startTime, "hh:mm aaaaa'm'");
                  const endTime = format(lesson.endTime, "hh:mm aaaaa'm'");
                  if (lesson.Class.className === className)
                    return (
                      <p key={lesson.id}>
                        {days[lesson.startTime.getDay()]} ({startTime} {"=>"}{" "}
                        {endTime})
                      </p>
                    );
                });
                return (
                  <div key={index}>
                    <br />
                    {className} :{result}
                  </div>
                );
              })}
            </ScrollArea>
            <span className="text-black">Proceed?</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full justify-between">
          <Button
            onClick={() => {
              setFirstConfirmDialogOpen(false);
            }}
            className="bg-blue-500 hover:bg-blue-400"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // deleteLessonActivity({ id: activityId });
              setFirstConfirmDialogOpen(false);
              setSecondConfirmDeleteActivity(true);
            }}
            className="bg-red-500 hover:bg-red-400"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
