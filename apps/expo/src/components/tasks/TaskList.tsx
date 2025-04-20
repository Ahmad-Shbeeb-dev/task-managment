import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ChevronDownIcon,
  Icon,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Toast,
  ToastTitle,
  useToast,
} from "@gluestack-ui/themed";
import type { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";

// import { TaskPriority, TaskStatus } from "@acme/db";

import { api } from "~/utils/api";

// import type { TaskOutput } from "~/types";

// Task Item Component with Status Update
const TaskItem = ({ item }: { item: TaskOutput }) => {
  const utils = api.useUtils();
  const toast = useToast();

  const updateTaskStatusMutation = api.task.update.useMutation({
    onSuccess: async () => {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="success" variant="accent">
            <ToastTitle>Status Updated!</ToastTitle>
          </Toast>
        ),
      });
      await utils.task.getAll.invalidate();
    },
    onError: (error) => {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="accent">
            <ToastTitle>Update Failed: {error.message}</ToastTitle>
          </Toast>
        ),
      });
    },
  });

  const handleStatusChange = (newStatus: string) => {
    const statusEnumValue = TaskStatus[newStatus as keyof typeof TaskStatus];
    if (!statusEnumValue || statusEnumValue === item.status) {
      console.warn("Invalid or unchanged status:", newStatus);
      return;
    }

    updateTaskStatusMutation.mutate({
      id: item.id,
      status: statusEnumValue,
    });
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeaderRow}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Select
          onValueChange={handleStatusChange}
          selectedValue={item.status}
          isDisabled={updateTaskStatusMutation.isLoading}
        >
          <SelectTrigger variant="outline" size="sm">
            <SelectInput placeholder="Status" style={styles.selectInput} />
            <Icon as={ChevronDownIcon} mr="$3" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {(Object.keys(TaskStatus) as (keyof typeof TaskStatus)[]).map(
                (status) => (
                  <SelectItem
                    key={status}
                    label={status.replace("_", " ")}
                    value={status}
                  />
                ),
              )}
            </SelectContent>
          </SelectPortal>
        </Select>
      </View>
      {item.description && (
        <Text style={styles.itemDescription}>{item.description}</Text>
      )}
      <View style={styles.itemDetailsRow}>
        <Text style={styles.itemDetailText}>Priority: {item.priority}</Text>
        <Text style={styles.itemDetailText}>
          Due: {item.dueDate ? format(new Date(item.dueDate), "P") : "N/A"}
        </Text>
      </View>
      {item.isRecurring && (
        <View style={styles.itemDetailsRow}>
          <Text style={styles.itemDetailText}>
            Repeat: {item.recurringType}
          </Text>
          {item.nextOccurrence && (
            <Text style={styles.itemDetailTextSmall}>
              Next: {format(new Date(item.nextOccurrence), "P")}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

// Main TaskList Component
export function TaskList() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.task.getAll.useInfiniteQuery(
    {
      limit: 15, // Fetch 15 tasks per page for mobile
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      // Optional: Configure staleTime, cacheTime etc.
    },
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const allTasks = data?.pages.flatMap((page) => page.tasks) ?? [];

  if (isLoading && allTasks.length === 0) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" />
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.errorText}>
          Error loading tasks: {error.message}
        </Text>
      </View>
    );
  }

  if (allTasks.length === 0) {
    return (
      <View style={styles.centeredView}>
        <Text>No tasks assigned to you.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={allTasks}
      renderItem={({ item }) => <TaskItem item={item as TaskOutput} />}
      keyExtractor={(item) => item.id}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() =>
        isFetchingNextPage ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}

// Basic Styling
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  selectInput: {
    fontSize: 12,
  },
  itemDescription: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 10,
  },
  itemDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  itemDetailText: {
    fontSize: 12,
    color: "#333333",
  },
  itemDetailTextSmall: {
    fontSize: 11,
    color: "#007AFF",
  },
  errorText: {
    color: "red",
  },
});
