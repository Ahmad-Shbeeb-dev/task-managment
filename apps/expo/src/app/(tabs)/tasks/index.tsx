import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Center, Spinner } from "@gluestack-ui/themed";

import { api } from "~/utils/api";
import { useTheme } from "~/utils/ThemeProvider";
import { Header } from "~/components/Header";
import { EmptyState } from "~/components/tasks/EmptyState";
import { TaskFilters } from "~/components/tasks/TaskFilters";
import { TaskItem } from "~/components/tasks/TaskItem";
import { TaskItemSkeleton } from "~/components/tasks/TaskItemSkeleton";
import { useTasks } from "~/hooks/useTasks";

export default function TasksScreen() {
  const { theme } = useTheme();
  const utils = api.useUtils();

  // Fetch tasks using tRPC hook
  const {
    tasks,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    statusFilter,
    handleStatusFilterChange,
    sortOrder,
    handleSortOrderChange,
  } = useTasks();

  // Handle refresh (pull to refresh)
  const handleRefresh = () => {
    void utils.task.getAll.invalidate();
  };

  // Load more when reaching end of list
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  // Render the footer with loading indicator when fetching more items
  const renderListFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <Center p="$4">
        <Spinner color={theme === "dark" ? "$blue400" : "$blue500"} />
      </Center>
    );
  };

  // Render empty state
  const renderListEmpty = () => {
    if (isLoading) {
      // Render skeleton loading state
      return Array.from({ length: 3 }).map((_, index) => (
        <TaskItemSkeleton key={`skeleton-${index}`} />
      ));
    }

    return (
      <EmptyState
        message={
          statusFilter
            ? `No ${statusFilter.replace("_", " ").toLowerCase()} tasks found.`
            : "No tasks found. Add a task to get started!"
        }
      />
    );
  };

  const renderListHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Header onRefresh={handleRefresh} />
        <TaskFilters
          status={statusFilter}
          sortOrder={sortOrder}
          onStatusChange={handleStatusFilterChange}
          onSortOrderChange={handleSortOrderChange}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#111827" : "#F9FAFB" },
      ]}
      edges={["left", "right", "bottom"]}
    >
      {isLoading ? (
        <FlatList
          data={[]}
          renderItem={() => null}
          keyExtractor={() => "loading"}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderListEmpty}
          ListHeaderComponent={renderListHeader}
        />
      ) : (
        <FlatList
          data={tasks}
          renderItem={({ item, index }) => (
            <TaskItem item={item} index={index} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={renderListFooter}
          ListEmptyComponent={renderListEmpty}
          ListHeaderComponent={renderListHeader}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[theme === "dark" ? "#3B82F6" : "#2563EB"]}
              tintColor={theme === "dark" ? "#3B82F6" : "#2563EB"}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 16,
    marginTop: -16,
  },
});
