"use client";

import { useEffect, useState } from "react";
import type { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "sonner";

import type { TaskStatus } from "@acme/db";

import { api } from "~/utils/api";
import { TASK_STATUSES } from "~/utils/constants";
import type { TaskOutput } from "~/types";
import { TaskItem } from "./TaskItem";
import { TaskItemSkeleton } from "./TaskItemSkeleton";

// Define the column titles
const COLUMN_TITLES: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

interface KanbanBoardProps {
  tasks: TaskOutput[];
  isLoading: boolean;
}

export const KanbanBoard = ({ tasks, isLoading }: KanbanBoardProps) => {
  // Helper function to group tasks by status
  const getGroupedTasks = (
    taskList: TaskOutput[],
  ): Record<TaskStatus, TaskOutput[]> => {
    const grouped: Record<TaskStatus, TaskOutput[]> = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };

    taskList.forEach((task) => {
      grouped[task.status]?.push(task);
    });

    return grouped;
  };

  // State for grouped tasks
  const [groupedTasks, setGroupedTasks] = useState<
    Record<TaskStatus, TaskOutput[]>
  >(() => getGroupedTasks(tasks));

  // API utilities
  const utils = api.useUtils();

  // Status update mutation
  const updateTaskStatusMutation = api.task.update.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.task.getAll.invalidate(),
        utils.task.getStats.invalidate(),
      ]);
    },
    onError: (error) => {
      toast.error(`Failed to update task status: ${error.message}`);
      setGroupedTasks(getGroupedTasks(tasks));
    },
  });

  // Update grouped tasks when the tasks prop changes
  useEffect(() => {
    setGroupedTasks(getGroupedTasks(tasks));
  }, [tasks]);

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If no destination or dropped in the same position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Create a deep copy of the grouped tasks
    const newGroupedTasks = { ...groupedTasks };

    // Get source and destination statuses
    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    // Find the task being moved
    const sourceColumn = [...newGroupedTasks[sourceStatus]];
    const [movedTask] = sourceColumn.splice(source.index, 1);

    if (!movedTask) return;

    // Moving to a different column
    if (sourceStatus !== destinationStatus) {
      // Update the task status
      const updatedTask = { ...movedTask, status: destinationStatus };

      // Update destination column
      const destinationColumn = [...newGroupedTasks[destinationStatus]];
      destinationColumn.splice(destination.index, 0, updatedTask);

      // Update the state
      newGroupedTasks[sourceStatus] = sourceColumn;
      newGroupedTasks[destinationStatus] = destinationColumn;
      setGroupedTasks(newGroupedTasks);

      // Persist the change
      updateTaskStatusMutation.mutate({
        id: draggableId,
        status: destinationStatus,
      });
    } else {
      // Moving within the same column
      sourceColumn.splice(destination.index, 0, movedTask);
      newGroupedTasks[sourceStatus] = sourceColumn;
      setGroupedTasks(newGroupedTasks);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TASK_STATUSES.map((status) => (
          <div
            key={status}
            className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <h2 className="mb-4 text-lg font-semibold">
              {COLUMN_TITLES[status]}
            </h2>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <TaskItemSkeleton key={i} isKanbanView={true} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TASK_STATUSES.map((status) => (
          <div
            key={status}
            className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <h2 className="mb-4 text-lg font-semibold">
              {COLUMN_TITLES[status]}
            </h2>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex min-h-[200px] flex-grow flex-col space-y-3"
                >
                  {groupedTasks[status]?.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                      isDragDisabled={status === "DONE"} // Disable dragging for DONE tasks
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${snapshot.isDragging ? "opacity-75" : ""}`}
                          data-task-id={task.id}
                        >
                          <TaskItem task={task} isKanbanView={true} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {groupedTasks[status]?.length === 0 && (
                    <div className="flex h-full items-center justify-center p-8 text-sm text-gray-500">
                      No tasks
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
