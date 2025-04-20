import type { Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar, IconUser } from "@tabler/icons-react";
import { addYears, format } from "date-fns";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { childSupplyValidation } from "@acme/api/validations";

import { api } from "~/utils/api";
import { cn } from "~/utils/ui";
import type { ChildType } from "~/types";
import { ImageCheckboxForm } from "../ImageCheckboxForm";
import { Button } from "../ui/Button";
import { Calendar } from "../ui/Calendar";
import { Checkbox } from "../ui/Checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { ScrollArea } from "../ui/ScrollArea";
import { Textarea } from "../ui/Textarea";

interface props {
  childrens: ChildType[];
  isSupplyFormOpen: boolean;
  setSupplyFormDialogOpen: Dispatch<SetStateAction<boolean>>;
}

type Inputs = z.infer<typeof childSupplyValidation>;

export const SupplyForm = ({
  childrens,
  isSupplyFormOpen,
  setSupplyFormDialogOpen,
}: props) => {
  const ctx = api.useContext();
  const today = new Date();

  const { data: supplyNames } = api.child.getAllSupplies.useQuery(undefined, {
    // enabled: isSupplyFormOpen,
    // refetchOnMount: false,
    onSuccess(data) {
      if (!data || data?.length === 0) {
        toast.error("Please add supplies first!!");
      }
    },
  });

  // const { data: childSuppliesData } = api.child.getChildSupplies.useQuery(
  //   {
  //     childId,
  //   },
  //   {
  //     enabled: childId !== "",
  //     onSuccess(data) {
  //       form.setValue("giveDate", data.at(0)?.giveDate ?? today); //all supplies of a child has the same giveDate
  //       form.setValue("otherSupply", data.at(0)?.otherSupply ?? "");
  //       form.setValue(
  //         "childSupplies",
  //         data.map((supply) => ({
  //           id: supply.id ?? "",
  //           name: supply.name ?? "",
  //           note: supply.note ?? "",
  //         })),
  //       );
  //     },
  //   },
  // );

  const { mutate: addChildSupplyMutation } =
    api.child.addChildSupplies.useMutation({
      onSuccess: async () => {
        toast.success("Children supplies added successfully");
        setSupplyFormDialogOpen(false);
        // await ctx.child.getChildSupplies.invalidate();
        await ctx.class.getChildren.invalidate();
      },
    });

  function onSubmit(data: Inputs) {
    addChildSupplyMutation({
      childrenIds: data.childrenIds,
      giveDate: data.giveDate,
      otherSupply: data.otherSupply,
      childSupplies: data.childSupplies,
    });
  }

  const form = useForm<Inputs>({
    resolver: zodResolver(childSupplyValidation),
    defaultValues: {
      giveDate: today,
      // childSupplies: [{ id: "", name: "", note: "" }],
      childSupplies: [],
      childrenIds: [],
      otherSupply: "",
    },
    // values: {
    //   giveDate: childSuppliesData?.at(0)?.giveDate ?? today, //all supplies of a child has the same giveDate
    //   otherSupply: childSuppliesData?.at(0)?.otherSupply ?? "",
    //   childSupplies: childSuppliesData?.map((supply) => ({
    //     id: supply.id ?? "",
    //     name: supply.name ?? "",
    //     note: supply.note ?? "",
    //   })) ?? [{ id: "", name: "", note: "" }],
    // },
    mode: "onSubmit", // validate onSubmit
    shouldUnregister: true, //clear dirty values after unmounting the form
  });

  return (
    <Dialog open={isSupplyFormOpen} onOpenChange={setSupplyFormDialogOpen}>
      <DialogContent className="px-0 pb-2 pt-0 sm:max-w-[425px]">
        <DialogHeader className="rounded-t-lg bg-lime-400 p-3 text-white">
          <DialogTitle className="mx-1">Add Supplies</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-2 px-4"
            id="supply-form"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            {/* Date */}
            <FormField
              control={form.control}
              name="giveDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Supplies needed on this date:
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-[30px] w-[280px] self-center pr-24 text-left font-normal shadow-md",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <IconCalendar className="mr-auto h-4 w-4 opacity-50" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        fromDate={today}
                        toDate={addYears(today, 1)}
                        // disabled={(date) => date < today}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Children */}
            <FormField
              control={form.control}
              name="childrenIds"
              render={() => (
                <FormItem>
                  <FormLabel>Select child:</FormLabel>
                  <ImageCheckboxForm
                    checkboxItems={childrens.map((child) => ({
                      id: child.childId,
                      name: child.Child.nameEn,
                      image: child.Child.image,
                    }))}
                    fieldName="childrenIds"
                    form={form}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Supplies */}
            <FormField
              control={form.control}
              name="childSupplies"
              render={() => (
                <FormItem className="flex flex-col">
                  <FormLabel>Choose supplies:</FormLabel>
                  {supplyNames?.map((supply) => (
                    <FormField
                      key={supply.id}
                      control={form.control}
                      name="childSupplies"
                      render={({ field }) => {
                        return (
                          <div key={supply.id} className="space-y-0">
                            <FormItem className="flex h-8 flex-row items-center justify-start space-x-3 space-y-0 rounded-lg border-2 p-2 shadow-md">
                              <FormControl>
                                <Checkbox
                                  className="border-slate-400 data-[state=checked]:border-sky-500/75 data-[state=checked]:bg-sky-500/75"
                                  checked={field.value?.some(
                                    (val) => val.id === supply.id,
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          { ...supply, note: "" },
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (val) => val.id !== supply.id,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal hover:cursor-pointer">
                                {supply.name}
                              </FormLabel>
                            </FormItem>
                            {!!field.value?.find(
                              (val) => val.id === supply.id,
                            ) && (
                              <FormItem className="mx-auto w-11/12 rounded-lg border-2 shadow-md">
                                <FormControl>
                                  <Input
                                    placeholder="Add Note"
                                    value={
                                      field.value?.find(
                                        (val) => val.id === supply.id,
                                      )?.note
                                    }
                                    onChange={(e) => {
                                      field.onChange(
                                        field.value?.map((val) =>
                                          val.id === supply.id
                                            ? { ...val, note: e.target.value }
                                            : val,
                                        ),
                                      );
                                    }}
                                    className="h-9"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          </div>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Other */}
            <FormField
              control={form.control}
              name="otherSupply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add other things here..."
                      className="resize-none shadow-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="px-4">
          <Button
            size="sm"
            type="submit"
            form="supply-form"
            className="h-7 bg-lime-500/75 px-6 hover:bg-lime-500/50"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
