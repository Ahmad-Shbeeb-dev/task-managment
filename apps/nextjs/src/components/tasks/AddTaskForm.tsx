"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";
import { TASK_PRIORITIES, TASK_RECURRING_TYPES } from "~/utils/constants";
import { cn } from "~/utils/ui";
import { Button } from "~/components/ui/Button";
import { Calendar } from "~/components/ui/Calendar";
import { Checkbox } from "~/components/ui/Checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { Textarea } from "~/components/ui/Textarea";

// Reuse schema definition logic if possible, or define frontend-specific validation
// Note: Zod schema used by react-hook-form
const addTaskFormSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    dueDate: z.date().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    assignedToId: z.string().min(1, { message: "Please select an assignee." }),
    isRecurring: z.boolean().default(false),
    recurringType: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
  })
  .refine(
    (data) => {
      // If isRecurring is true, recurringType must be set
      if (data.isRecurring && !data.recurringType) {
        return false;
      }
      return true;
    },
    {
      message: "Recurring type is required for recurring tasks",
      path: ["recurringType"], // path of error
    },
  );

type AddTaskFormValues = z.infer<typeof addTaskFormSchema>;

interface AddTaskFormProps {
  onTaskAdded?: () => void; // Optional callback after task is added
}

export function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const userId = session?.user?.id;
  const isAdmin = userRole === "ADMIN";

  const [isRecurring, setIsRecurring] = useState(false);

  const form = useForm<AddTaskFormValues>({
    resolver: zodResolver(addTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      assignedToId: isAdmin ? "" : userId ?? "",
      isRecurring: false,
    },
  });

  // Fetch users for assignee dropdown - only needed if user is admin
  const { data: usersData, isLoading: usersLoading } = api.user.getAll.useQuery(
    undefined, // no input
    {
      enabled: isAdmin, // Only run query if user is admin
    },
  );

  // tRPC mutation for creating task
  const utils = api.useUtils();
  const createTaskMutation = api.task.create.useMutation({
    onSuccess: () => {
      // Invalidate tasks query to refetch the list
      void utils.task.getAll.invalidate();
      form.reset(); // Reset form after successful submission
      setIsRecurring(false); // Reset local state too
      onTaskAdded?.(); // Call the callback if provided (e.g., to close a dialog)
      // TODO: Add user feedback (e.g., toast notification)
      console.log("Task created successfully!");
    },
    onError: (error) => {
      // TODO: Show error message to user
      console.error("Error creating task:", error);
      // Maybe set form error: form.setError("root", { message: error.message })
    },
  });

  function onSubmit(data: AddTaskFormValues) {
    // Ensure assignedToId is the logged-in user if not admin
    const finalAssignedToId = isAdmin ? data.assignedToId : userId;

    if (!finalAssignedToId) {
      // Handle case where userId is somehow missing for non-admin (shouldn't happen if logged in)
      console.error("User ID missing for non-admin task creation.");
      // TODO: Set a form error
      return;
    }

    // Ensure recurringType is undefined if isRecurring is false
    const submissionData = {
      ...data,
      assignedToId: finalAssignedToId,
      recurringType: data.isRecurring ? data.recurringType : undefined,
    };
    console.log("Submitting task:", submissionData);
    createTaskMutation.mutate(submissionData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter task description"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
                <FormLabel>Due Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      // disabled={(date) => date < new Date()} // Optional: disable past dates
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="pt-2">
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TASK_PRIORITIES.map((prio) => (
                      <SelectItem key={prio} value={prio}>
                        {prio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Assignee - Conditionally Rendered */}
        {isAdmin && (
          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign To</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={usersLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          usersLoading ? "Loading users..." : "Select assignee"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {usersData && usersData.length > 0 ? (
                      usersData.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name ?? user.email ?? user.id}{" "}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        {usersLoading ? "Loading..." : "No users found"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Recurring Options */}
        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setIsRecurring(Boolean(checked)); // Update local state
                    if (!checked) {
                      // Reset recurringType if checkbox is unchecked
                      form.setValue("recurringType", undefined);
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Make this a recurring task?</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Recurring Type (Conditional) */}
        {isRecurring && (
          <FormField
            control={form.control}
            name="recurringType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurring Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TASK_RECURRING_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />{" "}
                {/* Error message for required field will show here */}
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={createTaskMutation.isLoading}>
          {createTaskMutation.isLoading ? "Adding Task..." : "Add Task"}
        </Button>
      </form>
    </Form>
  );
}
