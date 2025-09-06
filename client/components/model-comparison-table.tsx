import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const comparisonData = [
  {
    model: "BERT Base",
    accuracy: 94.2,
    precision: 91.8,
    recall: 89.3,
    f1Score: 90.5,
    trainingTime: "2.3h",
    status: "active",
  },
  {
    model: "RoBERTa Large",
    accuracy: 95.1,
    precision: 93.2,
    recall: 91.7,
    f1Score: 92.4,
    trainingTime: "4.1h",
    status: "active",
  },
  {
    model: "GPT-3.5 Turbo",
    accuracy: 92.8,
    precision: 89.5,
    recall: 87.2,
    f1Score: 88.3,
    trainingTime: "1.8h",
    status: "training",
  },
  {
    model: "DistilBERT",
    accuracy: 89.4,
    precision: 86.1,
    recall: 84.7,
    f1Score: 85.4,
    trainingTime: "1.2h",
    status: "deprecated",
  },
]

export function ModelComparisonTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Comparison</CardTitle>
        <CardDescription>Compare performance metrics across all models</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Accuracy</TableHead>
              <TableHead className="text-right">Precision</TableHead>
              <TableHead className="text-right">Recall</TableHead>
              <TableHead className="text-right">F1 Score</TableHead>
              <TableHead className="text-right">Training Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonData.map((model) => (
              <TableRow key={model.model}>
                <TableCell className="font-medium">{model.model}</TableCell>
                <TableCell className="text-right">{model.accuracy}%</TableCell>
                <TableCell className="text-right">{model.precision}%</TableCell>
                <TableCell className="text-right">{model.recall}%</TableCell>
                <TableCell className="text-right">{model.f1Score}%</TableCell>
                <TableCell className="text-right">{model.trainingTime}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      model.status === "active" ? "default" : model.status === "training" ? "secondary" : "outline"
                    }
                  >
                    {model.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
