"use client";

import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import type { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "sonner";

import type { TaskStatus } from "@acme/db";

import { api } from "~/utils/api";
import { TASK_STATUSES } from "~/utils/constants";
import { cn } from "~/utils/ui";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { MotionCard, MotionDiv } from "~/components/ui/MotionComponents";
import type { TaskOutput } from "~/types";
import { TaskItem } from "./TaskItem";
import { TaskItemSkeleton } from "./TaskItemSkeleton";

// Define the column titles and colors
const COLUMN_CONFIG: Record<
  TaskStatus,
  { title: string; color: string; hoverColor: string }
> = {
  TODO: {
    title: "To Do",
    color: "bg-blue-200/20 dark:bg-blue-950/30",
    hoverColor: "hover:bg-blue-100/80 dark:hover:bg-blue-950/50",
  },
  IN_PROGRESS: {
    title: "In Progress",
    color: "bg-amber-200/20 dark:bg-amber-950/30",
    hoverColor: "hover:bg-amber-100/80 dark:hover:bg-amber-950/50",
  },
  DONE: {
    title: "Done",
    color: "bg-green-50 dark:bg-green-950/30",
    hoverColor: "hover:bg-green-100/80 dark:hover:bg-green-950/50",
  },
};

interface KanbanBoardProps {
  tasks: TaskOutput[];
  isLoading: boolean;
  onAddTask?: () => void;
}

export const KanbanBoard = ({
  tasks,
  isLoading,
  onAddTask,
}: KanbanBoardProps) => {
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TASK_STATUSES.map((status, index) => (
          <MotionCard
            key={status}
            animateType="fadeIn"
            delay={index * 0.15}
            className={cn(
              "flex flex-col rounded-xl border border-transparent p-0",
              COLUMN_CONFIG[status].color,
            )}
          >
            <div className="border-b border-gray-200/40 p-4 dark:border-gray-700/40">
              <h2 className="text-xl font-semibold tracking-tight">
                {COLUMN_CONFIG[status].title}
              </h2>
            </div>
            <div className="space-y-3 p-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <TaskItemSkeleton key={i} isKanbanView={true} />
              ))}
            </div>
          </MotionCard>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TASK_STATUSES.map((status, index) => (
          <MotionCard
            key={status}
            animateType="fadeIn"
            delay={index * 0.15}
            className={cn(
              "flex min-h-[350px] flex-col rounded-xl border border-transparent p-0 transition-colors duration-200",
              COLUMN_CONFIG[status].color,
              COLUMN_CONFIG[status].hoverColor,
            )}
          >
            <div className="border-b border-gray-200/40 p-4 dark:border-gray-700/40">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">
                  {COLUMN_CONFIG[status].title}
                </h2>
                <Badge
                  variant="outline"
                  className="font-medium dark:border-gray-700"
                >
                  {groupedTasks[status]?.length || 0}
                </Badge>
              </div>
            </div>

            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex h-full flex-grow flex-col p-3"
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
                          className={cn(
                            " mb-3",
                            snapshot.isDragging
                              ? "z-10 scale-[1.02] opacity-75"
                              : "",
                          )}
                          style={provided.draggableProps.style}
                          data-task-id={task.id}
                        >
                          <TaskItem task={task} isKanbanView={true} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {groupedTasks[status]?.length === 0 && (
                    <MotionDiv
                      className="flex h-full items-center justify-center p-8 text-sm text-gray-500"
                      animateType="fadeIn"
                      delay={0.3}
                    >
                      {status === "TODO" && onAddTask ? (
                        <div className="flex flex-col items-center gap-2 text-center">
                          <p>No tasks</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 gap-1"
                            onClick={onAddTask}
                          >
                            <IconPlus className="h-3.5 w-3.5" />
                            Add Task
                          </Button>
                        </div>
                      ) : (
                        "No tasks"
                      )}
                    </MotionDiv>
                  )}
                </div>
              )}
            </Droppable>
          </MotionCard>
        ))}
      </div>
    </DragDropContext>
  );
};
