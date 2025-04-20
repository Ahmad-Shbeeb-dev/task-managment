import { z } from "zod";

// We don't need to import TaskStatus directly here if we define it in Zod
// import { TaskStatus } from "@acme/db"; // Import the enum

// Input schema for creating a task
export const createTaskInputSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  assignedToId: z.string().min(1, { message: "Assigned user is required" }), // Assuming user ID is a string (ObjectId)
  isRecurring: z.boolean().default(false),
  recurringType: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
});

// Input schema for updating a task
export const updateTaskInputSchema = z.object({
  id: z.string().min(1), // Assuming task ID is a string (ObjectId)
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(), // Allow clearing description
  dueDate: z.date().optional().nullable(), // Allow clearing due date
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  assignedToId: z.string().min(1).optional(),
  isRecurring: z.boolean().optional(),
  recurringType: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional().nullable(), // Allow clearing recurring type
});

// Define the status enum for Zod validation
const taskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

// Input schema for getting tasks (can be expanded with filters/pagination)
export const getTasksInputSchema = z
  .object({
    // Filters
    status: taskStatusEnum.optional(), // Use Zod enum for validation
    // assignedToId: z.string().optional(), // Can add more filters later
    // Add pagination, sorting etc. as needed
    limit: z.number().min(1).max(100).default(20),
    cursor: z.string().nullish(), // cursor for infinite scrolling
  })
  .optional(); // Making the whole input optional for simple GET all
