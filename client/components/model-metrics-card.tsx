import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface ModelMetricsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
}

export function ModelMetricsCard({ title, value, change, trend, description }: ModelMetricsCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs">
          <span className={trendColor}>{change}</span>
          <span className="text-muted-foreground">from last evaluation</span>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
