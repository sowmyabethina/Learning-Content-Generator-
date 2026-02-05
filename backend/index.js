import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

import { generateQuestions } from "../pdf/questionGenerator.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// In-Memory Quiz Store
// ===============================
const answerStore = {};


// =================================================
// ✅ NEW: READ PDF API (FIXES YOUR ERROR)
// =================================================
app.post("/read-pdf", async (req, res) => {
  try {
    const { github_url } = req.body;

    if (!github_url) {
      return res.status(400).json({
        error: "github_url is required"
      });
    }

    console.log("📄 Reading PDF:", github_url);

    // Call MCP Server
    const rpcBody = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "read_github_pdf",
        arguments: { github_url }
      }
    };

    const response = await fetch("http://localhost:3333", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rpcBody)
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("PDF Server Error:", txt);

      return res.status(500).json({
        error: "PDF service failed"
      });
    }

    const data = await response.json();

    console.log("📦 MCP Response:", data);

    if (!data?.result?.text) {
      return res.status(500).json({
        error: "No text extracted",
        raw: data
      });
    }

    return res.json({
      text: data.result.text
    });

  } catch (err) {
    console.error("❌ /read-pdf error:", err);

    return res.status(500).json({
      error: "PDF extraction failed",
      details: err.message
    });
  }
});


// =================================================
// ✅ Generate Questions From Text (PDF Content)
// Used by Frontend /generate
// =================================================
app.post("/generate", async (req, res) => {
  try {
    const { docText, topic } = req.body;

    let text = "";

    // From extracted PDF
    if (docText && docText.trim().length > 100) {
      text = docText;
      console.log("📄 Generating from PDF text");
    }

    // From topic
    else if (topic && topic.trim()) {
      text = `Generate questions on topic: ${topic}`;
      console.log("📌 Generating from topic:", topic);
    }

    else {
      return res.status(400).json({
        error: "docText or topic required"
      });
    }

    console.log("📝 Text length:", text.length);

    // Call Gemini
    const questions = await generateQuestions(text);

    if (!Array.isArray(questions)) {
      throw new Error("Invalid Gemini response");
    }

    const quizId = `quiz_${Date.now()}`;

    answerStore[quizId] = {
      questions,
      answers: questions.map(q => q.answer)
    };

    res.setHeader("X-Quiz-Id", quizId);

    console.log("✅ Quiz generated:", quizId);

    return res.json(questions);

  } catch (err) {
    console.error("❌ /generate error:", err);

    return res.status(500).json({
      error: "Question generation failed",
      details: err.message
    });
  }
});



// =================================================
// Evaluate
// =================================================
app.post("/evaluate-quiz", (req, res) => {
  const { quizId, answers } = req.body;

  const stored = answerStore[quizId];

  if (!stored) {
    return res.status(404).json({
      error: "Quiz not found"
    });
  }

  let correct = 0;

  stored.answers.forEach((ans, i) => {
    if ((ans || "").toLowerCase() === (answers[i] || "").toLowerCase()) {
      correct++;
    }
  });

  const total = stored.answers.length;
  const score = Math.round((correct / total) * 100);

  return res.json({
    success: true,
    correct,
    wrong: total - correct,
    score
  });
});


// =================================================
// Start Server
// =================================================
const PORT = 5000;

app.listen(PORT, () => {
  console.log("✅ Backend running on http://localhost:" + PORT);
});
