import express from "express";
import { runEvaluation } from "./evaluator.js";
import fs from "fs";
import cors from "cors";
import { configDotenv } from "dotenv";
configDotenv();

const app = express();
const PORT = 4000;
const API_KEY = process.env.IOINTELLIGENCE_API_KEY;

app.use(cors());
app.use(express.json()); 

// Health check
app.get("/", (req, res) => {
  res.send("AI Model Evaluation Dashboard Backend");
});

app.get("/models", async (req, res) => {
  try {
    const response = await fetch("https://api.intelligence.io.solutions/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Run evaluation manually
// app.post("/evaluate", async (req, res) => {
//   try {
//     const metrics = await runEvaluation();
//     res.json(metrics);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.post("/evaluate", async (req, res) => {
  try {
    const { model, input } = req.body;
    if (!model || !input) {
      return res.status(400).json({ error: "Model and input are required" });
    }

    const start = Date.now();

    const response = await fetch("https://api.intelligence.io.solutions/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: input }],
        temperature: 0,
      }),
    });

    const data = await response.json();

    console.log(data);
    const latency = Date.now() - start;

    const prediction = data?.choices?.[0]?.message?.content?.trim() || "No prediction";
    const tokens = data?.usage?.total_tokens || 0;

    let confidence = 0.9; // default fallback
    if (data?.choices?.[0]?.logprobs?.content?.length > 0) {
      const tokenConfidences = data.choices[0].logprobs.content.map((t) => Math.exp(t.logprob));
      confidence = tokenConfidences.reduce((a, b) => a + b, 0) / tokenConfidences.length;
    }

    res.json({
      input,
      prediction,
      confidence, // placeholder since API doesn’t return it directly
      latency,
      tokens,
      model,
    });
  } catch (err) {
    console.error("Evaluation error:", err);
    res.status(500).json({ error: "Failed to evaluate input" });
  }
});

// Get last stored metrics
app.get("/metrics", (req, res) => {
  if (!fs.existsSync("./metrics.json")) {
    return res.status(404).json({ error: "No metrics found. Run /evaluate first." });
  }
  const metrics = JSON.parse(fs.readFileSync("./metrics.json"));
  res.json(metrics);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});