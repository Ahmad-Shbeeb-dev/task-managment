import React from "react";
import { StyleSheet } from "react-native";
import {
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
} from "@gluestack-ui/themed";
import type { TaskStatus } from "@prisma/client";

import { TASK_STATUSES } from "~/utils/constants";
import { useTheme } from "~/utils/ThemeProvider";
import { AnimatedBox } from "~/components/ui/MotionComponents";

interface TaskFiltersProps {
  status: TaskStatus | "ALL";
  sortOrder: "asc" | "desc";
  onStatusChange: (status: TaskStatus | "ALL") => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  status,
  sortOrder,
  onStatusChange,
  onSortOrderChange,
}) => {
  const { theme } = useTheme();

  return (
    <AnimatedBox
      animateType="fadeIn"
      delay={0.2}
      style={[
        styles.container,
        {
          backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
          borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
        },
      ]}
    >
      <HStack space="md" alignItems="center" justifyContent="space-between">
        <Text
          size="sm"
          style={{ color: theme === "dark" ? "#F3F4F6" : "#6B7280" }}
        >
          Filters:
        </Text>

        {/* Status Filter */}
        <Select
          selectedValue={status ?? "ALL"}
          onValueChange={(value) => {
            onStatusChange(value as TaskStatus | "ALL");
          }}
          minWidth={130}
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
              <SelectItem label="All" value="ALL" />
              {TASK_STATUSES.map((statusOption: TaskStatus | "ALL") => (
                <SelectItem
                  key={statusOption}
                  label={statusOption.replace("_", " ")}
                  value={statusOption}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>

        {/* Sort Order Filter */}
        <Select
          selectedValue={sortOrder}
          onValueChange={(value) => {
            onSortOrderChange(value as "asc" | "desc");
          }}
          minWidth={130}
        >
          <SelectTrigger
            variant="outline"
            size="sm"
            style={{
              borderColor: theme === "dark" ? "#4B5563" : "#E5E7EB",
            }}
          >
            <SelectInput
              placeholder="Sort"
              color={theme === "dark" ? "#F9FAFB" : "#374151"}
            />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Newest first" value="desc" />
              <SelectItem label="Oldest first" value="asc" />
            </SelectContent>
          </SelectPortal>
        </Select>
      </HStack>
    </AnimatedBox>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
  },
});
