import fs from "fs";
import { configDotenv } from "dotenv";
configDotenv();

const API_KEY = process.env.IOINTELLIGENCE_API_KEY;
const API_URL = "https://api.intelligence.io.solutions/api/v1/chat/completions";

// Call to io.net API for evaluation
export async function classifyText(model, text) {
  const start = Date.now();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: `Classify sentiment: "${text}"` }],
      temperature: 0,
    }),
  });

  const data = await response.json();
  const latency = Date.now() - start;

  const prediction = data?.choices?.[0]?.message?.content?.trim() || "Unknown";
  const tokens = data?.usage?.total_tokens || 0;

  return { prediction, latency, tokens };
}

// Batch run evaluation using dataset.json
export async function runEvaluation(model) {
  const dataset = JSON.parse(fs.readFileSync("./dataset.json"));
  let correct = 0;
  let totalLatency = 0;
  let totalTokens = 0;

  const results = [];

  for (const item of dataset) {
    const { input, expected } = item;
    const { prediction, latency, tokens } = await classifyText(model, input);

    const isCorrect = prediction.toLowerCase().includes(expected.toLowerCase());
    if (isCorrect) correct++;

    totalLatency += latency;
    totalTokens += tokens;

    results.push({ input, expected, prediction, isCorrect, latency, tokens });
  }

  const accuracy = (correct / dataset.length) * 100;
  const avgLatency = totalLatency / dataset.length;
  const avgTokens = totalTokens / dataset.length;

  const metrics = { accuracy, avgLatency, avgTokens, results };

  fs.writeFileSync("./metrics.json", JSON.stringify(metrics, null, 2));
  return metrics;
}