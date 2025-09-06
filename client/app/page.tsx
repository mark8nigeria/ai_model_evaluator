"use client"

import { useState } from "react"
import { ModelSelector } from "@/components/model-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EvaluationResult {
  input: string
  prediction: string
  confidence: number
  latency: number
  tokens: number
  model: string
}

export default function Dashboard() {
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEvaluationResult = (result: EvaluationResult) => {
    setEvaluationResult(result)
    setLoading(false)
  }

  const handleEvaluationStart = () => {
    setLoading(true)
    setEvaluationResult(null)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Model Evaluator</h1>
          <p className="text-muted-foreground">Test AI models with your input and get real-time evaluation results</p>
        </div>

        <ModelSelector onEvaluationResult={handleEvaluationResult} onEvaluationStart={handleEvaluationStart} />

        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-muted-foreground">Evaluating...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {evaluationResult && (
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Input</label>
                  <p className="text-sm bg-muted p-3 rounded-md">{evaluationResult.input}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Model</label>
                  <p className="text-sm font-medium">{evaluationResult.model}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Prediction</label>
                <p className="text-sm bg-green-50 dark:bg-green-950 p-3 rounded-md border border-green-200 dark:border-green-800">
                  {evaluationResult.prediction}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Confidence</label>
                  <p className="text-lg font-semibold">{(evaluationResult.confidence * 100).toFixed(1)}%</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Latency</label>
                  <p className="text-lg font-semibold">{evaluationResult.latency}ms</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Tokens</label>
                  <p className="text-lg font-semibold">{evaluationResult.tokens}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
