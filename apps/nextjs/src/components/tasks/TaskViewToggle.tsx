import { IconLayoutColumns, IconList } from "@tabler/icons-react";

import type { ViewMode } from "~/types";
import { Toggle } from "../ui/Toggle";

export const TaskViewToggle = ({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
}) => {
  return (
    <div className="mb-4 flex justify-end">
      <div className="inline-flex rounded-md border border-gray-200 shadow-sm dark:border-gray-700">
        <Toggle
          pressed={viewMode === "list"}
          onPressedChange={() => onViewModeChange("list")}
          aria-label="List view"
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-l-md rounded-r-none px-3"
        >
          <IconList size={18} className="mr-1" />
          List
        </Toggle>
        <Toggle
          pressed={viewMode === "kanban"}
          onPressedChange={() => onViewModeChange("kanban")}
          aria-label="Kanban view"
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-l-none rounded-r-md px-3"
        >
          <IconLayoutColumns size={18} className="mr-1" />
          Kanban
        </Toggle>
      </div>
    </div>
  );
};
