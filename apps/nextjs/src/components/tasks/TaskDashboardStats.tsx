"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TaskStatus } from "@acme/db";

import { api } from "~/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Skeleton } from "~/components/ui/Skeleton";

// Define colors for charts (customize as needed)
const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: "#ef4444", // Red
  IN_PROGRESS: "#f97316", // Orange
  DONE: "#22c55e", // Green
};

const CHART_HEIGHT = 300;

export function TaskDashboardStats() {
  const { data: statsData, isLoading, error } = api.task.getStats.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[20px] w-[150px] rounded-full" />
          <Skeleton className={`h-[${CHART_HEIGHT}px] w-full`} />
          <Skeleton className="h-[20px] w-[200px] rounded-full" />
          <Skeleton className={`h-[${CHART_HEIGHT}px] w-full`} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Task Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            Error loading statistics: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!statsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No statistics available.</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for Status Chart (Bar or Pie)
  const statusChartData = Object.entries(statsData.statusCounts)
    .map(([status, count]) => ({
      name: status.replace("_", " "),
      value: count,
      // Add fill color for Pie chart
      fill: STATUS_COLORS[status as TaskStatus] || "#8884d8",
    }))
    .filter((item) => item.value > 0); // Filter out statuses with 0 tasks

  // Prepare data for Completed Over Time Chart (Line)
  const completedChartData = statsData.completedOverTime.map((item) => ({
    date: item.date,
    Completed: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Tasks by Status Chart (Using Bar Chart) */}
        <div>
          <h3 className="mb-4 text-lg font-medium">Tasks by Status</h3>
          {statusChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Tasks" barSize={40}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground">
              No tasks found for status chart.
            </p>
          )}
        </div>

        {/* Completed Tasks Over Time Chart (Using Line Chart) */}
        <div>
          <h3 className="mb-4 text-lg font-medium">
            Completed Tasks (Last 7 Days)
          </h3>
          {completedChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <LineChart data={completedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Completed"
                  stroke="#22c55e"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground">
              No completed tasks in the last 7 days.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
