import type { Dispatch, SetStateAction } from "react";
import type { useForm } from "react-hook-form";
import type { z } from "zod";

import type { eventFormValidation } from "@acme/api/validations";

import { api } from "~/utils/api";
import { RadioGroup, RadioGroupItem } from "~/components/ui/RadioGroup";
import type { EventFormInputsType } from "~/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";
import { Label } from "./ui/Label";

interface Props {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  form: ReturnType<typeof useForm<z.infer<typeof eventFormValidation>>>;
  onSubmit: (data: EventFormInputsType) => void;
}

export const NewEventTypeDialog = ({
  dialogOpen,
  setDialogOpen,
  form,
  onSubmit,
}: Props) => {
  const { data: types } = api.event.getEventTypes.useQuery();

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader className="gap-4">
          <DialogTitle className="my-2 border-b-4 border-slate-200 pb-2">
            Please choose Event Type
          </DialogTitle>
        </DialogHeader>
        <RadioGroup className="w-fit">
          {types?.map((activity) => (
            <div className="flex justify-between" key={activity.id}>
              <div className="flex items-center space-x-2" key={activity.name}>
                <RadioGroupItem
                  className="hidden"
                  value={activity.id}
                  id={activity.id}
                />
                <Label
                  className="flex cursor-pointer flex-row"
                  htmlFor={activity.id}
                  onClick={() => {
                    form.setValue("eventTypeId", activity.id);
                    let startTime = form.getValues("eventStartDate");
                    activity.EventTypeActivities?.map((act, index) => {
                      if (act.duration !== null && startTime) {
                        const CurrentDate = new Date(startTime);
                        CurrentDate.setMinutes(
                          CurrentDate.getMinutes() + act.duration,
                        );

                        form.setValue(
                          `eventActivities.${index}.id`,
                          act.id ?? undefined,
                        );
                        form.setValue(
                          `eventActivities.${index}.name`,
                          act.name ?? undefined,
                        );
                        form.setValue(
                          `eventActivities.${index}.startTime`,
                          startTime ?? undefined,
                        );
                        form.setValue(
                          `eventActivities.${index}.endTime`,
                          CurrentDate ?? undefined,
                        );
                        startTime = CurrentDate;
                      }
                    });

                    void form.handleSubmit(onSubmit)();
                  }}
                >
                  <div
                    className="mr-3 flex h-4 w-4 rounded-full"
                    style={{
                      backgroundColor: activity.color
                        ? activity.color
                        : undefined,
                    }}
                  ></div>
                  <span>{activity.name}</span>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
};
