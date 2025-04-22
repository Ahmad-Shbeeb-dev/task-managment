"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  AddTaskFormType,
  UpdateTaskFormType,
} from "@acme/api/validations";
import {
  createTaskInputSchema,
  updateTaskInputSchema,
} from "@acme/api/validations";

import { api } from "~/utils/api";
import { TASK_PRIORITIES, TASK_RECURRING_TYPES } from "~/utils/constants";
import { cn } from "~/utils/ui";
import { Button } from "~/components/ui/Button";
import { Calendar } from "~/components/ui/Calendar";
import { Checkbox } from "~/components/ui/Checkbox";
import {
  Form,
  FormControl,
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
import type { TaskOutput } from "~/types";

interface AddTaskFormProps {
  onTaskAdded?: () => void; // Optional callback after task is added
  onSuccess?: () => void; // Optional callback after task is added or updated
  initialData?: TaskOutput; // Task data for editing mode
}

export function AddTaskForm({
  onTaskAdded,
  onSuccess,
  initialData,
}: AddTaskFormProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const userId = session?.user?.id;

  const isEditMode = !!initialData;
  const [isRecurring, setIsRecurring] = useState(
    initialData?.isRecurring ?? false,
  );

  // Use different schemas and types based on whether we're creating or updating
  const formSchema = isEditMode ? updateTaskInputSchema : createTaskInputSchema;

  const form = useForm<AddTaskFormType | UpdateTaskFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? {
          id: initialData.id,
          title: initialData.title,
          description: initialData.description ?? "",
          priority: initialData.priority,
          dueDate: initialData.dueDate
            ? new Date(initialData.dueDate)
            : undefined,
          assignedToId: initialData.assignedTo?.id ?? userId ?? "",
          isRecurring: initialData.isRecurring,
          recurringType: initialData.recurringType ?? undefined,
        }
      : {
          title: "",
          description: "",
          priority: "MEDIUM",
          assignedToId: isAdmin ? "" : userId ?? "",
          isRecurring: false,
        },
  });

  // Fetch users for assignee dropdown - only run if user is admin
  const { data: usersData, isLoading: usersLoading } = api.user.getAll.useQuery(
    undefined, // no input
    {
      enabled: isAdmin, // Only run query if user is admin
    },
  );

  // tRPC mutations for creating/updating tasks
  const utils = api.useUtils();

  const createTaskMutation = api.task.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Task "${data.title}" created successfully!`);
      void utils.task.getAll.invalidate();
      void utils.task.getStats.invalidate();
      form.reset();
      setIsRecurring(false);
      onTaskAdded?.();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Error creating task: ${error.message}`);
      form.setError("root", { message: `Submission failed: ${error.message}` });
    },
  });

  const updateTaskMutation = api.task.update.useMutation({
    onSuccess: (data) => {
      toast.success(`Task "${data.title}" updated successfully!`);
      void utils.task.getAll.invalidate();
      void utils.task.getStats.invalidate();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Error updating task: ${error.message}`);
      form.setError("root", { message: `Update failed: ${error.message}` });
    },
  });

  const isSubmitting =
    createTaskMutation.isLoading || updateTaskMutation.isLoading;

  function onSubmit(data: AddTaskFormType | UpdateTaskFormType) {
    // Ensure assignedToId is the logged-in user if not admin
    const finalAssignedToId = isAdmin ? data.assignedToId : userId;

    if (!finalAssignedToId) {
      toast.error("Assignee information is missing.");
      form.setError("assignedToId", {
        message: "Could not determine the assignee.",
      });
      return;
    }

    const submissionData = {
      ...data,
      assignedToId: finalAssignedToId,
      recurringType: data.isRecurring ? data.recurringType : undefined,
    };

    if (isEditMode && "id" in data) {
      // Update existing task
      updateTaskMutation.mutate(submissionData as UpdateTaskFormType);
    } else {
      // Create new task
      createTaskMutation.mutate(submissionData as AddTaskFormType);
    }
  }

  // Effect to update isRecurring state when initialData changes
  useEffect(() => {
    if (initialData) {
      setIsRecurring(initialData.isRecurring);
    }
  }, [initialData]);

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
              <FormItem className="flex flex-col gap-1 pt-1.5">
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
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
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
              <FormItem className="pt-0">
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
                    {TASK_PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Assignee - Conditionally Rendered for Admins */}
        {isAdmin && (
          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign To</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={usersLoading || isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          usersLoading
                            ? "Loading users..."
                            : "Select an assignee"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {usersLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : usersData && usersData.length > 0 ? (
                      usersData.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name ?? user.email ?? `User ${user.id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-users" disabled>
                        No users available to assign
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
                    setIsRecurring(Boolean(checked));
                    if (!checked) {
                      form.setValue("recurringType", undefined);
                    }
                  }}
                  disabled={isSubmitting}
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
                  defaultValue={field.value ?? undefined}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TASK_RECURRING_TYPES.map((recurringType) => (
                      <SelectItem key={recurringType} value={recurringType}>
                        {recurringType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? "Updating Task..."
              : "Adding Task..."
            : isEditMode
              ? "Update Task"
              : "Add Task"}
        </Button>
      </form>
    </Form>
  );
}
