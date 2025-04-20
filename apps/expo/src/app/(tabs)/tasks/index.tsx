import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Badge,
  BadgeText,
  Box,
  Center,
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
  Spinner,
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

// Use inferred type for a single task from the API output
type TaskItemType = RouterOutputs["task"]["getAll"]["tasks"][number];

// Simplified TaskItem component for mobile
const TaskItem = ({ item }: { item: TaskItemType }) => {
  const utils = api.useUtils();
  const toast = useToast();

  const updateTaskStatusMutation = api.task.update.useMutation({
    onSuccess: async () => {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="success" variant="accent">
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
      // await utils.task.getStats.invalidate(); // Invalidate stats if shown on mobile
    },
    onError: (error) => {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="error" variant="accent">
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

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "HIGH":
        return "$red600";
      case "MEDIUM":
        return "$orange600";
      case "LOW":
        return "$coolGray500";
      default:
        return "$coolGray800";
    }
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

  return (
    <Box
      borderWidth="$1"
      borderColor="$borderLight200"
      borderRadius="$lg"
      p="$4"
      mb="$3"
      bg="$white"
    >
      <VStack space="sm">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="sm" flex={1} mr="$2">
            {item.title}
          </Heading>
          <Select
            selectedValue={item.status}
            onValueChange={(value) => handleStatusChange(value as TaskStatus)}
            isDisabled={updateTaskStatusMutation.isLoading}
            minWidth={120}
          >
            <SelectTrigger variant="outline" size="sm">
              <SelectInput placeholder="Status" />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {(["TODO", "IN_PROGRESS", "DONE"] as const).map(
                  (status: TaskStatus) => (
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
        </HStack>
        {item.description && (
          <Text size="sm" color="$coolGray600">
            {item.description}
          </Text>
        )}
        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Text size="xs" color="$coolGray500">
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
          <Text size="xs" color="$blue600">
            Next: {format(new Date(item.nextOccurrence), "P")}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

// Skeleton component for TaskItem
const TaskItemSkeleton = () => {
  return (
    <Box
      borderWidth="$1"
      borderColor="$borderLight200"
      borderRadius="$lg"
      p="$4"
      mb="$3"
      bg="$white"
    >
      <VStack space="sm">
        <HStack justifyContent="space-between" alignItems="center">
          {/* Title Skeleton */}
          <Box h="$5" w="$3/5" bg="$coolGray200" borderRadius="$sm" />
          {/* Status Select Skeleton */}
          <Box h="$8" w={120} bg="$coolGray200" borderRadius="$sm" />
        </HStack>
        {/* Description Skeleton */}
        <Box h="$4" w="$4/5" bg="$coolGray200" borderRadius="$sm" />
        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          {/* Due Date Skeleton */}
          <Box h="$4" w="$1/3" bg="$coolGray200" borderRadius="$sm" />
          {/* Priority Skeleton */}
          <Box h="$4" w="$16" bg="$coolGray200" borderRadius="$sm" />
        </HStack>
      </VStack>
    </Box>
  );
};

export default function TasksScreen() {
  const utils = api.useUtils();
  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false);

  // Fetch tasks using tRPC hook
  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = api.task.getAll.useInfiniteQuery(
    {
      limit: 10, // Fetch 10 tasks per page
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  // Flatten pages for FlatList
  const allTasks = data?.pages.flatMap((page) => page.tasks) ?? [];

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setIsRefetchingByUser(true);
    await refetch();
    setIsRefetchingByUser(false);
  }, [refetch]);

  // Determine if the RefreshControl should be spinning
  // Show spinner if it's the initial load OR if manually refreshing
  const isRefreshing = isRefetchingByUser && isFetching;

  const renderListFooter = () => {
    if (!hasNextPage) return null;
    if (isFetchingNextPage) {
      return <Spinner my="$4" />;
    }
    // Optionally add a "Load More" button if needed, FlatList's onEndReached is often sufficient
    return null;
  };

  const renderListEmpty = () => {
    return (
      <Center flex={1} mt="$10">
        <Text>No tasks assigned to you.</Text>
      </Center>
    );
  };

  const renderListHeader = () => {
    return <Heading mb="$4">My Tasks</Heading>;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <VStack flex={1} p="$4">
        {isLoading && !isFetching && allTasks.length === 0 ? (
          <>
            {renderListHeader()}
            {/* Render Skeletons */}
            <VStack space="md">
              {[...Array(5)].map((_, index) => (
                <TaskItemSkeleton key={index} />
              ))}
            </VStack>
          </>
        ) : error ? (
          <>
            {renderListHeader()}
            <Center flex={1}>
              <Text color="$red700">Error loading tasks: {error.message}</Text>
            </Center>
          </>
        ) : (
          <FlatList
            data={allTasks}
            renderItem={({ item }) => <TaskItem item={item} />}
            keyExtractor={(item) => item.id}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderListFooter}
            ListEmptyComponent={renderListEmpty}
            ListHeaderComponent={renderListHeader}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </VStack>
    </SafeAreaView>
  );
}
