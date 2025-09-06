"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Model {
  id: string
  name: string
  status: string
  version: string
}

interface ModelSelectorProps {
  onEvaluationResult: (result: any) => void
  onEvaluationStart: () => void
}

export function ModelSelector({ onEvaluationResult, onEvaluationStart }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState("")
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchingModels, setFetchingModels] = useState(true)

  const fetchModels = async () => {
  try {
    const response = await fetch("https://io-ai-project.onrender.com/models")
    const data = await response.json()

    if (Array.isArray(data) && data.length > 0) {
      setModels(data)
      setSelectedModel(data[0].id)
    } else {
      const fallbackModels = [
        { id: "bert-base", name: "BERT Base", status: "active", version: "v2.1" },
        { id: "gpt-3.5", name: "GPT-3.5 Turbo", status: "active", version: "v1.3" },
        { id: "roberta-large", name: "RoBERTa Large", status: "active", version: "v1.8" },
      ]
      setModels(fallbackModels)
      setSelectedModel(fallbackModels[0].id)
    }
  } catch (error) {
    console.error("[v0] Failed to fetch models:", error)
    const fallbackModels = [
      { id: "bert-base", name: "BERT Base", status: "active", version: "v2.1" },
      { id: "gpt-3.5", name: "GPT-3.5 Turbo", status: "active", version: "v1.3" },
    ]
    setModels(fallbackModels)
    setSelectedModel(fallbackModels[0].id)
  } finally {
    setFetchingModels(false)
  }
}

  const evaluateText = async () => {
    if (!inputText.trim() || !selectedModel) return;

    setLoading(true);
    onEvaluationStart();

    try {
      const response = await fetch("https://io-ai-project.onrender.com/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          input: inputText.trim(),
        }),
      });

      const data = await response.json();

      onEvaluationResult(data);
    } catch (error) {
      console.error("Evaluation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels()
  }, [])

  const currentModel = models.find((model) => model.id === selectedModel)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Evaluation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Model</label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select value={selectedModel} onValueChange={setSelectedModel} disabled={fetchingModels || loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(models) && models.length > 0 ? (
                    models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center space-x-2">
                          <span>{model.id}</span>
                          <Badge variant={model.status === "active" ? "default" : "secondary"}>
                            {model.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      No models available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            {currentModel && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{currentModel.version}</Badge>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Input Text</label>
          <Textarea
            placeholder="Enter text to evaluate with the selected model..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            rows={4}
          />
        </div>

        <Button
          onClick={evaluateText}
          disabled={!inputText.trim() || !selectedModel || loading || fetchingModels}
          className="w-full"
        >
          {loading ? "Evaluating..." : "Evaluate"}
        </Button>
      </CardContent>
    </Card>
  )
}
