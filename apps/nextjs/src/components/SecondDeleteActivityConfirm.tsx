import type { Dispatch, SetStateAction } from "react";
import type { useForm } from "react-hook-form";

import { api } from "~/utils/api";
import type { ClassFormInputsType, EventType } from "~/types";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";

interface Props {
  secondConfirmDialogOpen: boolean;
  setSecondConfirmDialogOpen: Dispatch<SetStateAction<boolean>>;
  setStaticDialogOpen: Dispatch<SetStateAction<boolean>>;
  defaultActivity: string;
  setDefaultActivity: Dispatch<SetStateAction<string>>;
  activityId: string;
  setMyEvents: Dispatch<SetStateAction<EventType[] | undefined>>;
  form: ReturnType<typeof useForm<ClassFormInputsType>>;
  onSubmit: (data: ClassFormInputsType) => void;
}

export const SecondDeleteActivityConfirm = ({
  activityId,
  setMyEvents,
  onSubmit,
  defaultActivity,
  form,
  setDefaultActivity,
  setStaticDialogOpen,
  secondConfirmDialogOpen,
  setSecondConfirmDialogOpen,
}: Props) => {
  const ctx = api.useContext();

  const { mutate: deleteLessonActivity } =
    api.class.deleteLessonActivity.useMutation({
      onSuccess(data) {
        if (data) {
          setMyEvents((prev) => {
            const currentEvents = [...prev!];
            const filteredEvents = currentEvents.filter((event) => {
              return event.title !== activityId;
            });
            form.setValue("lessons", filteredEvents);
            return filteredEvents;
          });
          void form.handleSubmit(onSubmit)();
          if (activityId === defaultActivity) {
            setDefaultActivity("");
          }
          void ctx.class.getLessonActivities.invalidate();
          void ctx.class.getLessonActivityLessons.invalidate();
        } else {
          setStaticDialogOpen(true);
        }
      },
    });

  return (
    <Dialog
      open={secondConfirmDialogOpen}
      onOpenChange={setSecondConfirmDialogOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">
            WARNING : This action is unDoable
            <br />
          </DialogTitle>
          <span className="text-black">Proceed?</span>
        </DialogHeader>
        <div className="flex w-full justify-between">
          <Button
            onClick={() => {
              setSecondConfirmDialogOpen(false);
            }}
            className="bg-blue-500 hover:bg-blue-400"
          >
            No
          </Button>
          <Button
            onClick={() => {
              deleteLessonActivity({ id: activityId });
              setSecondConfirmDialogOpen(false);
            }}
            className="bg-red-500 hover:bg-red-400"
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
