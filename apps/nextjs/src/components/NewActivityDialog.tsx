import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import type { ColorResult } from "react-color";
import { SketchPicker } from "react-color";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { lessonActivityFormValidation } from "@acme/api/validations";

import { api } from "~/utils/api";
import { cn } from "~/utils/ui";
import type { LessonActivity } from "~/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { Input } from "./ui/Input";

interface Props {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  activity?: LessonActivity;
  setActivity: Dispatch<SetStateAction<LessonActivity | undefined>>;
}

export const NewActivityDialog = ({
  dialogOpen,
  setDialogOpen,
  activity,
  setActivity,
}: Props) => {
  const form = useForm<z.infer<typeof lessonActivityFormValidation>>({
    resolver: zodResolver(lessonActivityFormValidation),
    defaultValues: {
      id: "",
      activityName: "",
      color: "",
    },
    shouldUnregister: false,
  });

  const ctx = api.useContext();
  const { mutate: updateActivityMutation } =
    api.class.setLessonActivities.useMutation({
      onSuccess() {
        void ctx.class.getLessonActivities.invalidate();
        setDialogOpen(false);
      },
    });

  const presetColors = [
    "#EF4444",
    "#F97316",
    "#FACC15",
    "#4ADE80",
    "#2DD4BF",
    "#3B82F6",
    "#6467F2",
    "#EC4899",
    "#F43F5E",
    "#D946EF",
    "#8B5CF6",
    "#0EA5E9",
    "#10B981",
  ];

  useEffect(() => {
    form.setValue("id", activity?.id);
    form.setValue("activityName", activity?.name ?? "");
    form.setValue("color", activity?.color ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity]);

  function onSubmit(data: z.infer<typeof lessonActivityFormValidation>) {
    updateActivityMutation({
      id: data.id,
      color: data.color,
      activityName: data.activityName,
    });
  }

  return (
    <Form {...form}>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
        }}
      >
        <DialogTrigger
          className="text-muted-foreground mt-3 border-0 bg-transparent hover:bg-transparent"
          onClick={() => {
            setDialogOpen(true);
            form.reset();
            setActivity(undefined);
          }}
        >
          Add activity +
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader className="gap-2">
            <DialogTitle>Activity Name</DialogTitle>
          </DialogHeader>
          <FormField
            control={form.control}
            name="activityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="my-4"
                    placeholder="Activity Name"
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-red-600">
            {form.getFieldState("color").error?.message}
          </p>
          <div key={form.watch("color")} className="grid grid-cols-8 gap-2">
            {presetColors.map((color) => {
              return (
                <Button
                  key={color}
                  type="button"
                  className={cn(
                    `h-8 w-8 rounded-2xl hover:cursor-pointer`,
                    form.getValues("color") === color
                      ? "p-4 outline outline-4 outline-gray-500"
                      : "",
                  )}
                  style={{
                    backgroundColor: color, // dynamic color not possible with tailwind
                  }}
                  onClick={() => {
                    form.setValue("color", color);
                    form.setError("color", { message: "" });
                  }}
                ></Button>
              );
            })}
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="picker" className="border-0">
              <AccordionTrigger className="picker-icon">
                <div className="h-8 w-8 rounded-2xl border-4 border-gray-100 bg-white hover:cursor-pointer">
                  <IconPlus />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <SketchPicker
                  color={form.getValues("color")}
                  onChange={(color: ColorResult) => {
                    form.setValue("color", color.hex);
                    form.setError("color", { message: "" });
                  }}
                  presetColors={[]}
                  disableAlpha
                  width="100%"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            className="mx-2 rounded-lg bg-green-400 p-2 text-center text-slate-50 hover:bg-green-400"
            type="button"
            onClick={() => {
              void form.handleSubmit(onSubmit)();
            }}
          >
            {activity ? "Edit" : "Add"}
          </Button>
        </DialogContent>
      </Dialog>
    </Form>
  );
};
