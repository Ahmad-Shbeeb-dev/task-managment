/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
  useForm,
} from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import { api } from "~/utils/api";
import { DebouncedInput } from "~/components/DebouncedInput";
import { Button } from "~/components/ui/Button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import type {
  ChildFormInputsType,
  ChildPickupAction,
  ChildPickupType,
} from "~/types";

interface Props {
  form: ReturnType<typeof useForm<ChildFormInputsType>>;
  onSubmit: (data: ChildFormInputsType) => void;
}

export const PickupListFormTab = ({ form, onSubmit }: Props) => {
  const { mutate: deleteChildPickupMutation } =
    api.child.deleteChildPickup.useMutation();

  const [changedArrayField, setChangedArrayField] = useState("");

  const handleOnChange = <
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
  >(
    field: ControllerRenderProps<TFieldValues, TName>,
    value: FieldPathValue<TFieldValues, TName>,
  ) => {
    if (field.name.includes("childPickups.pickupDropOffPeople")) {
      setChangedArrayField(field.name);
    }
    if (field.name.includes("childPickups.pickupBuses")) {
      setChangedArrayField(field.name);
    }
    if (field.name.includes("childPickups.dropOffBuses")) {
      setChangedArrayField(field.name);
    }

    field.onChange(value);
    void form.handleSubmit(onSubmit)();
  };

  // fixes unfocus of fieldArray after setting the upserted data values
  useEffect(() => {
    if (changedArrayField) {
      form.setFocus(changedArrayField as keyof ChildFormInputsType);
    }
  }, [
    changedArrayField,
    form,
    form.watch("childPickups.pickupDropOffPeople"),
    form.watch("childPickups.pickupBuses"),
    form.watch("childPickups.dropOffBuses"),
  ]);

  const childPickupDropOffPeopleFields = useFieldArray({
    control: form.control,
    name: "childPickups.pickupDropOffPeople",
    keyName: "autoGenKey",
  });

  const childPickupBusesFields = useFieldArray({
    control: form.control,
    name: "childPickups.pickupBuses",
    keyName: "autoGenKey",
  });

  const childDropOffBusesFields = useFieldArray({
    control: form.control,
    name: "childPickups.dropOffBuses",
    keyName: "autoGenKey",
  });

  const handleAddPickupField = (
    type: ChildPickupType,
    action: ChildPickupAction,
  ) => {
    if (type === "PERSON" && action === "PICKUP_DROPOFF")
      childPickupDropOffPeopleFields.append({
        pickupId: undefined,
        pickupName: "",
        contactNumber: "",
        relationToChild: "",
        pickupType: "PERSON",
        pickupAction: "PICKUP_DROPOFF",
      });

    if (type === "BUS" && action === "PICKUP")
      childPickupBusesFields.append({
        pickupId: undefined,
        pickupName: "",
        contactNumber: "",
        relationToChild: "",
        pickupType: "BUS",
        pickupAction: "PICKUP",
      });

    if (type === "BUS" && action === "DROPOFF")
      childDropOffBusesFields.append({
        pickupId: undefined,
        pickupName: "",
        contactNumber: "",
        relationToChild: "",
        pickupType: "BUS",
        pickupAction: "DROPOFF",
      });
  };

  const handleRemovePickupField = (
    type: ChildPickupType,
    action: ChildPickupAction,
    index: number,
  ) => {
    if (type === "PERSON" && action === "PICKUP_DROPOFF") {
      const childPickup = form.getValues("childPickups.pickupDropOffPeople")?.[
        index
      ];
      childPickupDropOffPeopleFields.remove(index);

      if (
        childPickup?.pickupName !== "" ||
        childPickup?.contactNumber !== "" ||
        childPickup?.relationToChild !== ""
      ) {
        if (childPickup?.pickupId) {
          deleteChildPickupMutation({
            pickupId: childPickup.pickupId,
          });
        }
      }
    }
    if (type === "BUS" && action === "PICKUP") {
      const childPickup = form.getValues("childPickups.pickupBuses")?.[index];
      childPickupBusesFields.remove(index);

      if (childPickup?.pickupName !== "" || childPickup?.contactNumber !== "") {
        if (childPickup?.pickupId) {
          deleteChildPickupMutation({
            pickupId: childPickup.pickupId,
          });
        }
      }
    }
    if (type === "BUS" && action === "DROPOFF") {
      const childPickup = form.getValues("childPickups.dropOffBuses")?.[index];
      childDropOffBusesFields.remove(index);

      if (childPickup?.pickupName !== "" || childPickup?.contactNumber !== "") {
        if (childPickup?.pickupId) {
          deleteChildPickupMutation({
            pickupId: childPickup.pickupId,
          });
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Pickup List */}
      {/* Pickup + Dropoff People */}
      <p className="bg-[#FAFAFA] py-2 text-lg font-semibold">Pickup List</p>
      <div className="grid grid-cols-3 gap-4">
        {childPickupDropOffPeopleFields.fields.map((field, index) => (
          <Fragment key={field.autoGenKey}>
            {/* Name */}
            <FormField
              control={form.control}
              name={
                `childPickups.pickupDropOffPeople.${index}.pickupName` as const
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      {...field}
                      inputType="input"
                      debounce={500}
                      value={field.value}
                      onChange={(value) => handleOnChange(field, value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Relation To Child */}
            <FormField
              control={form.control}
              name={
                `childPickups.pickupDropOffPeople.${index}.relationToChild` as const
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation To Child</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      {...field}
                      inputType="input"
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
            <div className="flex">
              <FormField
                control={form.control}
                name={
                  `childPickups.pickupDropOffPeople.${index}.contactNumber` as const
                }
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <DebouncedInput
                        {...field}
                        inputType="input"
                        debounce={500}
                        value={field.value}
                        onChange={(value) => handleOnChange(field, value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <IconTrash
                onClick={() =>
                  handleRemovePickupField("PERSON", "PICKUP_DROPOFF", index)
                }
                className="mx-3 mt-9 h-6 w-8 cursor-pointer text-red-500"
              />
            </div>
          </Fragment>
        ))}
      </div>
      <Button
        type="button"
        size="sm"
        className="w-fit place-self-center bg-[#95D354] px-12 hover:bg-[#84b84c]"
        onClick={() => handleAddPickupField("PERSON", "PICKUP_DROPOFF")}
      >
        Add More+
      </Button>

      {/* Pickup Bus*/}
      <p className="bg-[#FAFAFA] py-2 text-lg font-semibold">Pickup Bus</p>
      <div className="grid grid-cols-2 gap-4">
        {childPickupBusesFields.fields.map((field, index) => (
          <Fragment key={field.autoGenKey}>
            {/* Name */}
            <FormField
              control={form.control}
              name={`childPickups.pickupBuses.${index}.pickupName` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      {...field}
                      inputType="input"
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
            <div className="flex">
              <FormField
                control={form.control}
                name={
                  `childPickups.pickupBuses.${index}.contactNumber` as const
                }
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <DebouncedInput
                        {...field}
                        inputType="input"
                        debounce={500}
                        value={field.value}
                        onChange={(value) => handleOnChange(field, value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <IconTrash
                onClick={() => handleRemovePickupField("BUS", "PICKUP", index)}
                className="mx-3 mt-9 h-6 w-8 cursor-pointer text-red-500"
              />
            </div>
          </Fragment>
        ))}
      </div>
      <Button
        type="button"
        size="sm"
        className="w-fit place-self-center bg-[#95D354] px-12 hover:bg-[#84b84c]"
        onClick={() => handleAddPickupField("BUS", "PICKUP")}
      >
        Add More+
      </Button>

      {/* Dropoff Bus*/}
      <p className="bg-[#FAFAFA] py-2 text-lg font-semibold">Dropoff Bus</p>
      <div className="grid grid-cols-2 gap-4">
        {childDropOffBusesFields.fields.map((field, index) => (
          <Fragment key={field.autoGenKey}>
            {/* Name */}
            <FormField
              control={form.control}
              name={`childPickups.dropOffBuses.${index}.pickupName` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      {...field}
                      inputType="input"
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
            <div className="flex">
              <FormField
                control={form.control}
                name={
                  `childPickups.dropOffBuses.${index}.contactNumber` as const
                }
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <DebouncedInput
                        {...field}
                        inputType="input"
                        debounce={500}
                        value={field.value}
                        onChange={(value) => handleOnChange(field, value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <IconTrash
                onClick={() => handleRemovePickupField("BUS", "DROPOFF", index)}
                className="mx-3 mt-9 h-6 w-8 cursor-pointer text-red-500"
              />
            </div>
          </Fragment>
        ))}
      </div>
      <Button
        type="button"
        size="sm"
        className="w-fit place-self-center bg-[#95D354] px-12 hover:bg-[#84b84c]"
        onClick={() => handleAddPickupField("BUS", "DROPOFF")}
      >
        Add More+
      </Button>
    </div>
  );
};
