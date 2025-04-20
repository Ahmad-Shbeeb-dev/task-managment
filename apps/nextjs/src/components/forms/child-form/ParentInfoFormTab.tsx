import { useState } from "react";
import { IconCheck, IconChevronDown, IconTrash } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

import type { Session } from "@acme/auth";

import { api } from "~/utils/api";
import { cn } from "~/utils/ui";
import { DebouncedInput } from "~/components/DebouncedInput";
import { Button } from "~/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/Command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/Popover";
import { ScrollArea } from "~/components/ui/ScrollArea";
import type { ChildFormInputsType, GenderType } from "~/types";
import { SignUpForm } from "../auth-form/SignupForm";

interface Props {
  form: ReturnType<typeof useForm<ChildFormInputsType>>;
  onSubmit: (data: ChildFormInputsType) => void;
  session: Session;
}

export const ParentInfoFormTab = ({ form, onSubmit, session }: Props) => {
  const ctx = api.useContext();
  const [addUserDialogOpened, setAddUserDialogOpened] = useState(false);
  const [deleteDetailsDialogOpened, setDeleteDetailsDialogOpened] =
    useState(false);
  const [parentDetailsToDelete, setParentDetailsToDelete] = useState<
    "father" | "mother" | undefined
  >(undefined);

  const [rerender, setRerender] = useState(false);

  const { mutate: deleteParentDetailsMutation } =
    api.child.deleteChildParentDetails.useMutation({
      onSuccess: () => {
        setRerender(true);
        toast.success("Parent details deleted successfully");
      },
      onSettled: () => {
        setDeleteDetailsDialogOpened(false);
        return ctx.child.getChild.invalidate({
          childId: form.getValues("childId"),
        });
      },
    });

  const [parent, setParent] = useState<GenderType>();
  const { data: allUsers } = api.user.getUsers.useQuery(
    // { exclude: ["PARENTS"] },
    undefined,
    {
      refetchOnMount: true,
    },
  );

  const handleOnChange = <
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
  >(
    field: ControllerRenderProps<TFieldValues, TName>,
    value: FieldPathValue<TFieldValues, TName>,
  ) => {
    if (field.name === "fatherUserId") {
      const foundUser = allUsers?.find((user) => user.id === value);
      if (foundUser) {
        form.setValue("fatherEmail", foundUser?.email ?? undefined);
        form.setValue(
          "fatherContactNumber",
          foundUser?.contactNumber ?? undefined,
        );
        form.setValue(
          "fatherOccupation",
          foundUser?.Parent?.occupation ?? undefined,
        );
        form.setValue("fatherNotes", foundUser?.Parent?.notes ?? undefined);
        form.setValue(
          "fatherWorkAddress",
          foundUser?.Parent?.workAddress ?? undefined,
        );
        form.setValue(
          "fatherWorkNumber",
          foundUser?.Parent?.workNumber ?? undefined,
        );
      }
    }
    if (field.name === "motherUserId") {
      const foundUser = allUsers?.find((user) => user.id === value);
      if (foundUser) {
        form.setValue("motherEmail", foundUser?.email ?? undefined);
        form.setValue(
          "motherContactNumber",
          foundUser?.contactNumber ?? undefined,
        );
        form.setValue(
          "motherOccupation",
          foundUser?.Parent?.occupation ?? undefined,
        );
        form.setValue("motherNotes", foundUser?.Parent?.notes ?? undefined);
        form.setValue(
          "motherWorkAddress",
          foundUser?.Parent?.workAddress ?? undefined,
        );
        form.setValue(
          "motherWorkNumber",
          foundUser?.Parent?.workNumber ?? undefined,
        );
      }
    }
    field.onChange(value);
    void form.handleSubmit(onSubmit)();
  };

  const handleDeleteDetails = () => {
    const childId = form.getValues("childId");
    if (parentDetailsToDelete && childId) {
      deleteParentDetailsMutation({
        childId: childId,
        parent: parentDetailsToDelete,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Father Details */}
        <div className="flex items-center justify-between bg-[#FAFAFA]">
          <p className="py-2 text-lg font-semibold">Father Details</p>
          <Button
            type="button"
            size="icon"
            className="h-6 w-6 bg-transparent text-stone-700/95 hover:bg-transparent hover:text-stone-700/60"
            onClick={() => {
              setParentDetailsToDelete("father");
              setDeleteDetailsDialogOpened(true);
            }}
          >
            <IconTrash className="h-5 w-5 text-red-500" />
          </Button>
        </div>
        <div
          className="grid grid-cols-3 gap-3"
          key={`father_${
            form.watch("fatherUserId")
              ? form.watch("fatherUserId")
              : rerender
                ? nanoid()
                : null
          }`}
        >
          {/* Father Username */}
          <FormField
            control={form.control}
            name="fatherUserId"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Father Username</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? allUsers?.find((user) => user.id === field.value)
                              ?.name
                          : "Select User"}
                        <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search user..." />
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="p-0">
                          {allUsers
                            ?.filter(
                              (user) =>
                                user.gender !== "FEMALE" &&
                                form.getValues("motherUserId") !== user.id,
                            )
                            ?.map((user) => (
                              <CommandItem
                                value={user.name ?? undefined}
                                key={user.id}
                                onSelect={(e) => {
                                  if (e !== "") {
                                    form.resetField("fatherUserId", {
                                      keepError: false,
                                      keepDirty: true,
                                      keepTouched: true,
                                    });
                                  }
                                  form.setValue("fatherUserId", user.id);
                                  form.setValue(
                                    "childFatherName",
                                    user.name ?? undefined,
                                  );
                                  handleOnChange(field, user.id);
                                }}
                              >
                                <IconCheck
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    user.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {user.name}
                              </CommandItem>
                            ))}
                          <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => {
                              setAddUserDialogOpened(true);
                              setParent("MALE");
                            }}
                          >
                            + Add New User
                          </Button>
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Occupation */}
          <FormField
            control={form.control}
            name="fatherOccupation"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Work Address */}
          <FormField
            control={form.control}
            name="fatherWorkAddress"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Work Address</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Work Number */}
          <FormField
            control={form.control}
            name="fatherWorkNumber"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Work Number</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Number */}
          <FormField
            control={form.control}
            name="fatherContactNumber"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="fatherEmail"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="fatherNotes"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Mother Details */}
        <div className="flex items-center justify-between bg-[#FAFAFA]">
          <p className="py-2 text-lg font-semibold">Mother Details</p>
          <Button
            type="button"
            size="icon"
            className="h-6 w-6 bg-transparent text-stone-700/95 hover:bg-transparent hover:text-stone-700/60"
            onClick={() => {
              setParentDetailsToDelete("mother");
              setDeleteDetailsDialogOpened(true);
            }}
          >
            <IconTrash className="h-5 w-5 text-red-500" />
          </Button>
        </div>
        <div
          className="grid grid-cols-3 gap-3"
          key={`mother_${
            form.watch("motherUserId")
              ? form.watch("motherUserId")
              : rerender
                ? nanoid()
                : null
          }`}
        >
          {/* Mother Username */}
          <FormField
            control={form.control}
            name="motherUserId"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Mother Username</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? allUsers?.find((user) => user.id === field.value)
                              ?.name
                          : "Select User"}
                        <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search user..." />
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="p-0">
                          {allUsers
                            ?.filter(
                              (user) =>
                                user.gender !== "MALE" &&
                                form.getValues("fatherUserId") !== user.id,
                            )
                            ?.map((user) => (
                              <CommandItem
                                value={user.name ?? undefined}
                                key={user.id}
                                onSelect={(e) => {
                                  if (e !== "") {
                                    form.resetField("motherUserId", {
                                      keepError: false,
                                      keepDirty: true,
                                      keepTouched: true,
                                    });
                                  }
                                  form.setValue("motherUserId", user.id);
                                  form.setValue(
                                    "childMotherName",
                                    user.name ?? undefined,
                                  );
                                  handleOnChange(field, user.id);
                                }}
                              >
                                <IconCheck
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    user.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {user.name}
                              </CommandItem>
                            ))}
                          <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => {
                              setAddUserDialogOpened(true);
                              setParent("FEMALE");
                            }}
                          >
                            + Add New User
                          </Button>
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Occupation */}
          <FormField
            control={form.control}
            name="motherOccupation"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Work Address */}
          <FormField
            control={form.control}
            name="motherWorkAddress"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Work Address</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Work Number */}
          <FormField
            control={form.control}
            name="motherWorkNumber"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Work Number</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Number */}
          <FormField
            control={form.control}
            name="motherContactNumber"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="motherEmail"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="motherNotes"
            render={({ field }) => (
              <FormItem className=" col-span-3 xl:col-span-1">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <DebouncedInput
                    {...field}
                    debounce={500}
                    value={field.value}
                    onChange={(value) => handleOnChange(field, value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {addUserDialogOpened && (
        <Dialog
          open={addUserDialogOpened}
          onOpenChange={(open) => {
            setAddUserDialogOpened(open);
          }}
        >
          <DialogContent>
            <DialogHeader className="gap-2">
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>

            <SignUpForm
              isSuperAdmin
              setDialogOpened={setAddUserDialogOpened}
              userRole="PARENT"
              createdBy={session.user.id}
              userName={
                parent && parent === "MALE"
                  ? form.getValues("childFatherName")
                  : form.getValues("childMotherName")
              }
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        open={deleteDetailsDialogOpened}
        onOpenChange={setDeleteDetailsDialogOpened}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDeleteDetails} className="hover:bg-red-400">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
