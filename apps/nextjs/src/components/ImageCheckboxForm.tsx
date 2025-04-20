import { IconUser } from "@tabler/icons-react";
import type { Path, useForm } from "react-hook-form";

import { cn } from "~/utils/ui";
import { Checkbox } from "./ui/Checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/Form";
import { ScrollArea } from "./ui/ScrollArea";

interface Props<T extends Record<string, unknown>> {
  checkboxItems?: { id: string; name?: string | null; image?: string | null }[];
  form: ReturnType<typeof useForm<T>>;
  fieldName: Path<T>;
  showName?: boolean;
  onSubmit?: (data: T) => void;
}

export function ImageCheckboxForm<T extends Record<string, unknown>>({
  checkboxItems,
  fieldName,
  form,
  showName = false,
  onSubmit,
}: Props<T>) {
  return (
    <ScrollArea className="h-[400px] rounded-lg border px-4 py-2 shadow-md">
      <div className="grid grid-cols-4 gap-2">
        {checkboxItems?.map((checkboxItem) => (
          <FormField
            key={checkboxItem.id}
            control={form.control}
            name={fieldName}
            render={({ field }) => {
              return (
                <div className="space-y-0">
                  <FormItem className="m-0 flex items-center justify-start p-0">
                    <FormControl>
                      <Checkbox
                        className="hidden"
                        checked={
                          Array.isArray(field.value) &&
                          field.value?.some(
                            (val: unknown) => val === checkboxItem.id,
                          )
                        }
                        onCheckedChange={(checked) => {
                          checked
                            ? field.onChange([
                                ...(field.value as []),
                                checkboxItem.id,
                              ])
                            : field.onChange(
                                Array.isArray(field.value) &&
                                  field.value?.filter(
                                    (val: unknown) => val !== checkboxItem.id,
                                  ),
                              );
                          if (onSubmit) void form.handleSubmit(onSubmit)();
                        }}
                      />
                    </FormControl>
                    <FormLabel className="w-full font-normal hover:cursor-pointer">
                      <div
                        className={cn(
                          "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100",
                          {
                            "border-4 border-sky-500/75":
                              Array.isArray(field.value) &&
                              field.value?.some(
                                (val: unknown) => val === checkboxItem.id,
                              ),
                          },
                        )}
                      >
                        {checkboxItem.image ? (
                          <img
                            src={checkboxItem.image}
                            className="rounded-full shadow-lg"
                            alt="checkboxItem"
                          />
                        ) : (
                          <IconUser className="h-10 w-10 shadow-lg" />
                        )}
                      </div>
                      {showName && checkboxItem?.name && (
                        <p className="mt-3 break-words text-center">
                          {checkboxItem.name}
                        </p>
                      )}
                    </FormLabel>
                  </FormItem>
                </div>
              );
            }}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
