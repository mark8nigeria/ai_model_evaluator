"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"

const lineData = [
  { name: "Week 1", accuracy: 88, precision: 85, recall: 82 },
  { name: "Week 2", accuracy: 90, precision: 87, recall: 84 },
  { name: "Week 3", accuracy: 92, precision: 89, recall: 86 },
  { name: "Week 4", accuracy: 94, precision: 92, recall: 89 },
]

const barData = [
  { metric: "Accuracy", current: 94.2, previous: 92.1 },
  { metric: "Precision", current: 91.8, previous: 90.3 },
  { metric: "Recall", current: 89.3, previous: 90.1 },
  { metric: "F1 Score", current: 90.5, previous: 90.2 },
]

interface PerformanceChartProps {
  title: string
  type: "line" | "bar"
}

export function PerformanceChart({ title, type }: PerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {type === "line" ? "Performance trends over the last 4 weeks" : "Current vs previous evaluation"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            accuracy: { label: "Accuracy", color: "hsl(var(--chart-1))" },
            precision: { label: "Precision", color: "hsl(var(--chart-2))" },
            recall: { label: "Recall", color: "hsl(var(--chart-3))" },
            current: { label: "Current", color: "hsl(var(--chart-1))" },
            previous: { label: "Previous", color: "hsl(var(--chart-2))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            {type === "line" ? (
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[80, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                <Line type="monotone" dataKey="precision" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                <Line type="monotone" dataKey="recall" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              </LineChart>
            ) : (
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis domain={[80, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="current" fill="hsl(var(--chart-1))" />
                <Bar dataKey="previous" fill="hsl(var(--chart-2))" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
