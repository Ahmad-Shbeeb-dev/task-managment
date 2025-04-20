import React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Box,
  Center,
  Heading,
  HStack,
  ScrollView,
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
  View,
  VStack,
} from "@gluestack-ui/themed";
import type { TaskPriority, TaskStatus } from "@prisma/client";
import Calendar from "assets/icons/calendar.svg";
import Chart from "assets/icons/chart.svg";
import Event from "assets/icons/event.svg";
import Graph from "assets/icons/graph.svg";
import Meal from "assets/icons/meal.svg";
import PaperClip from "assets/icons/paperclip.svg";
import { format } from "date-fns";
import { nanoid } from "nanoid/non-secure";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/utils/api";
import { TASK_STATUSES } from "~/utils/constants";
import { HomeCarousel } from "~/components/HomeCarousel";
import { HomeHeader } from "~/components/HomeHeader";
import { HomeNewsCard } from "~/components/HomeNewsCard";
import { SectionLink } from "~/components/SectionLink";

// Use inferred type for a single task from the API output
type TaskItemType = RouterOutputs["task"]["getAll"]["tasks"][number];

const CARDS = [
  {
    header: "New Photos",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, odio.",
    date: new Date(),
    backgroundColor: "#EBEBEB",
    dividerIconColor: "#383838",
    images: [
      "https://s3-alpha-sig.figma.com/img/8762/92ee/94f28ed851ea1d722f991d6e5be8808b?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=q16Kpcogsm5kXE3qRC9c1ely8OqDGgYBowSuPd6MiGD8i2wRAv7CZcsjJWInJbiRBUdLUld~Anuo6El2ukfLHF5bIAm0lvVUNvPjxlgOLL6H1YJEXjJWlewyf-gEVp-JTPcRLM21ANPnbnWb2Hjykpl603YP9ZJCYJOexkoUl-BwE6Qe9N-UGEsSvNiN8JXF2GnTdBcWVa9TcE20zNL0BBlR1WPiHDbeafxn2SQ~nOW2j8ZkwZ8eOCMpKR~wXzP7jylwWREsLChOTAJRiy5~GPXVYefwCS7Kx5EdLhgtnIFYOhLO0LzSDn1hJpB4HAuRN6IWlflBBFiRj3B~CSANjQ__",
      "https://s3-alpha-sig.figma.com/img/7ba4/1ea1/7a06244dab07c2b793be873b086802d4?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Z53HU1yWGChWCELmqtbY6qU~WhC9UYocjzIpRdk2RZ~L1BMhwU2vK9M7hjtcOuiDjb12bq0~q2OBABtKNolbiMojTvdSDQUiZ4of5kxyxVyNOzcGvbjzWOmkcUaNvyF~k1TqQzTIVEnGSnfNzm2PUPyGkgeujQBZXSBZUUmsFTxV5kvnnM9cW2bKUzKTGP7mdFIx--EOZeLd8lMgDtyfAJ9PYZjA1zFXa0WPFnnG1NKwSAi~huWrzL5BaIvrcD4ter5BTCENE0cfKofIwTqTYV76KYvJnjgWNCYu12cXEDIgD9DH2fII9Se3f37GxFeaRIn7kt1-G6lnrYX1VblxwA__",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      "https://s3-alpha-sig.figma.com/img/7ba4/1ea1/7a06244dab07c2b793be873b086802d4?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Z53HU1yWGChWCELmqtbY6qU~WhC9UYocjzIpRdk2RZ~L1BMhwU2vK9M7hjtcOuiDjb12bq0~q2OBABtKNolbiMojTvdSDQUiZ4of5kxyxVyNOzcGvbjzWOmkcUaNvyF~k1TqQzTIVEnGSnfNzm2PUPyGkgeujQBZXSBZUUmsFTxV5kvnnM9cW2bKUzKTGP7mdFIx--EOZeLd8lMgDtyfAJ9PYZjA1zFXa0WPFnnG1NKwSAi~huWrzL5BaIvrcD4ter5BTCENE0cfKofIwTqTYV76KYvJnjgWNCYu12cXEDIgD9DH2fII9Se3f37GxFeaRIn7kt1-G6lnrYX1VblxwA__",
    ] as string[],
  },
] as const;

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

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "DONE":
        return "$green600";
      case "IN_PROGRESS":
        return "$blue600";
      case "TODO":
        return "$red600";
      default:
        return "$coolGray800";
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
                {TASK_STATUSES.map((status) => (
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
          <Text size="xs" color={getPriorityColor(item.priority)}>
            {item.priority}
          </Text>
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

export default function HomeScreen() {
  // Fetch tasks using tRPC hook
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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

  const renderListFooter = () => {
    if (!hasNextPage) return null;
    if (isFetchingNextPage) {
      return <Spinner my="$4" />;
    }
    // Optionally add a "Load More" button if needed, FlatList's onEndReached is often sufficient
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <ScrollView>
        <HomeHeader />
        <Text fontSize="$sm" color="#777" ml={22}>
          Recommended courses
        </Text>
        <HomeCarousel />
        <Text fontSize="$sm" color="#777" ml={22} mt="$4">
          Keep in touch with your child
        </Text>
        <ScrollView flexDirection="row" py={5} horizontal ml={22} h={130}>
          <SectionLink
            ImgSource={Graph}
            imgbgColor="#C1E2F4"
            title="Reports"
            linkHref=""
          />
          <SectionLink
            ImgSource={PaperClip}
            imgbgColor="#D5FFA9"
            title="Supplies"
            linkHref=""
          />
          <SectionLink
            ImgSource={Event}
            imgbgColor="#FECECD"
            title="Events"
            linkHref=""
          />
          <SectionLink
            ImgSource={Meal}
            imgbgColor="#FFE4A7"
            title="Meal Plan"
            linkHref=""
          />
          <SectionLink
            ImgSource={Calendar}
            imgbgColor="#B4C2F8"
            title="Activities Program"
            linkHref=""
          />
        </ScrollView>

        <HStack px="$4.5" justifyContent="space-between" alignItems="center">
          <VStack>
            <Text color="$black">Today's News</Text>
            <Text size="xs" color="#7C7C7C">
              {format(new Date(), "EEEE, d LLL")}
            </Text>
          </VStack>
          <Chart />
        </HStack>
        {/* {Attendances?.map((card) => <HomeNewsCard key={nanoid()} {...card} />)} */}
      </ScrollView>
      <VStack flex={1} p="$4">
        <Heading mb="$4">My Tasks</Heading>
        {isLoading && allTasks.length === 0 ? (
          <Center flex={1}>
            <Spinner size="large" />
          </Center>
        ) : error ? (
          <Center flex={1}>
            <Text color="$red700">Error loading tasks: {error.message}</Text>
          </Center>
        ) : allTasks.length === 0 ? (
          <Center flex={1}>
            <Text>No tasks assigned to you.</Text>
          </Center>
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
          />
        )}
      </VStack>
    </SafeAreaView>
  );
}
