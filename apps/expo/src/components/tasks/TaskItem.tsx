import React from "react";
import { StyleSheet } from "react-native";
import {
  Badge,
  BadgeText,
  Heading,
  HStack,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import type { TaskPriority, TaskStatus } from "@prisma/client";
import { format } from "date-fns";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/utils/api";
import { TASK_STATUSES } from "~/utils/constants";
import { useTheme } from "~/utils/ThemeProvider";
import { AnimatedListItem } from "~/components/ui/MotionComponents";

// Use inferred type for a single task from the API output
type TaskItemType = RouterOutputs["task"]["getAll"]["tasks"][number];

interface TaskItemProps {
  item: TaskItemType;
  index: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({ item, index = 0 }) => {
  const utils = api.useUtils();
  const toast = useToast();
  const { theme } = useTheme();
  const isDone = item.status === "DONE";

  const updateTaskStatusMutation = api.task.update.useMutation({
    onSuccess: async () => {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={"toast-" + id} action="success" variant="accent">
            <VStack space="xs">
              <ToastTitle>Success</ToastTitle>
              <ToastDescription>
                Task "{item.title}" status updated!
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
      // Invalidate queries to refetch data
      await utils.task.getAll.invalidate();
    },
    onError: (error) => {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={"toast-" + id} action="error" variant="accent">
            <VStack space="xs">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>
                Failed to update status: {error.message}
              </ToastDescription>
            </VStack>
          </Toast>
        ),
      });
    },
  });

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === item.status || updateTaskStatusMutation.isLoading) return;

    updateTaskStatusMutation.mutate({
      id: item.id,
      status: newStatus,
    });
  };

  // Helper to get Badge action based on priority
  const getPriorityBadgeAction = (
    priority: TaskPriority,
  ): "error" | "warning" | "info" | "muted" => {
    switch (priority) {
      case "HIGH":
        return "error";
      case "MEDIUM":
        return "warning";
      case "LOW":
        return "info"; // Or use "muted"
      default:
        return "muted";
    }
  };

  // Get text and container styles based on completion status
  const getTextStyle = (isDone: boolean) => {
    return {
      textDecorationLine: isDone
        ? ("line-through" as const)
        : ("none" as const),
      color: isDone
        ? theme === "dark"
          ? "#6B7280"
          : "#9CA3AF" // More grey when done
        : theme === "dark"
          ? "#FFFFFF"
          : "#1F2937", // Normal color when not done
    };
  };

  const getDescriptionStyle = (isDone: boolean) => {
    return {
      textDecorationLine: isDone
        ? ("line-through" as const)
        : ("none" as const),
      color: isDone
        ? theme === "dark"
          ? "#6B7280"
          : "#9CA3AF" // More grey when done
        : theme === "dark"
          ? "#E5E7EB"
          : "#6B7280", // Normal color when not done
    };
  };

  const getContainerStyle = (isDone: boolean) => {
    return {
      backgroundColor: isDone
        ? theme === "dark"
          ? "#1a2026"
          : "#F3F4F6" // Slightly darker/lighter when done
        : theme === "dark"
          ? "#1F2937"
          : "#FFFFFF", // Normal color when not done
      borderColor: theme === "dark" ? "#4B5563" : "#E5E7EB",
      opacity: isDone ? 0.8 : 1,
    };
  };

  return (
    <AnimatedListItem
      delay={0.1 + index * 0.05}
      style={[styles.itemContainer, getContainerStyle(isDone)]}
    >
      <VStack space="sm">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="sm" flex={1} mr="$2" style={getTextStyle(isDone)}>
            {item.title}
          </Heading>
          <Select
            selectedValue={item.status}
            onValueChange={(value) => handleStatusChange(value as TaskStatus)}
            isDisabled={updateTaskStatusMutation.isLoading}
            minWidth={120}
          >
            <SelectTrigger
              variant="outline"
              size="sm"
              style={{
                borderColor: theme === "dark" ? "#4B5563" : "#E5E7EB",
              }}
            >
              <SelectInput
                placeholder="Status"
                color={theme === "dark" ? "#F9FAFB" : "#374151"}
              />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {TASK_STATUSES.map((status: TaskStatus) => (
                  <SelectItem
                    key={status}
                    label={status.replace("_", " ")}
                    value={status}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </HStack>
        {item.description && (
          <Text size="sm" style={getDescriptionStyle(isDone)}>
            {item.description}
          </Text>
        )}
        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Text
            size="xs"
            style={{ color: theme === "dark" ? "#D1D5DB" : "#6B7280" }}
          >
            Due: {item.dueDate ? format(new Date(item.dueDate), "P") : "N/A"}
            {item.isRecurring && ` (${item.recurringType})`}
          </Text>
          {/* Priority Badge */}
          <Badge
            size="sm"
            variant="solid"
            action={getPriorityBadgeAction(item.priority)}
          >
            <BadgeText>{item.priority}</BadgeText>
          </Badge>
        </HStack>
        {item.isRecurring && item.nextOccurrence && (
          <Text
            size="xs"
            style={{ color: theme === "dark" ? "#93C5FD" : "#3B82F6" }}
          >
            Next: {format(new Date(item.nextOccurrence), "P")}
          </Text>
        )}
      </VStack>
    </AnimatedListItem>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 16,
  },
});
