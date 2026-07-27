import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as pdfParseModule from "pdf-parse";
import mammoth from "mammoth";

const pdfParse: any = (pdfParseModule as any).default || pdfParseModule;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "25mb" }));

  // Helper to initialize Gemini SDK safely
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // API 1: Parse Resume
  app.post("/api/resume/parse", async (req, res) => {
    try {
      const { fileBase64, fileName, mimeType, rawText } = req.body;
      let extractedText = rawText || "";

      if (!extractedText && fileBase64) {
        const buffer = Buffer.from(fileBase64, "base64");
        
        if (mimeType === "application/pdf" || fileName?.endsWith(".pdf")) {
          try {
            const pdfData = await pdfParse(buffer);
            extractedText = pdfData.text || "";
          } catch (pdfErr) {
            console.warn("pdf-parse fallback, using raw string representation", pdfErr);
            extractedText = buffer.toString("utf-8");
          }
        } else if (
          mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          fileName?.endsWith(".docx")
        ) {
          try {
            const docResult = await mammoth.extractRawText({ buffer });
            extractedText = docResult.value || "";
          } catch (docErr) {
            console.warn("docx-parse fallback", docErr);
            extractedText = buffer.toString("utf-8");
          }
        } else {
          extractedText = buffer.toString("utf-8");
        }
      }

      if (!extractedText || extractedText.trim().length < 10) {
        return res.status(400).json({
          error: "Could not extract meaningful text from file. Please paste or try another document.",
        });
      }

      // Use Gemini to structure resume insights
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Analyze this candidate resume text and extract key summary information in JSON format:
        
        RESUME TEXT:
        ${extractedText.slice(0, 15000)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "Professional 2-3 sentence overview" },
              topSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of top 6-10 technical and soft skills",
              },
              experienceYears: { type: Type.STRING, description: "Estimated experience level (e.g. 3 years)" },
              highlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key achievements, past companies, or notable projects",
              },
            },
            required: ["summary", "topSkills", "experienceYears", "highlights"],
          },
        },
      });

      let parsedInsight = { summary: "", topSkills: [], experienceYears: "Unspecified", highlights: [] };
      try {
        if (response.text) {
          parsedInsight = JSON.parse(response.text);
        }
      } catch (e) {
        console.error("JSON parse error for resume insights", e);
      }

      res.json({
        text: extractedText,
        fileName: fileName || "Resume.pdf",
        ...parsedInsight,
      });
    } catch (error: any) {
      console.error("Error parsing resume:", error);
      res.status(500).json({ error: error.message || "Failed to process resume file" });
    }
  });

  // API 2: Generate Questions
  app.post("/api/interview/generate-questions", async (req, res) => {
    try {
      const { role, customRole, experienceLevel, interviewMode, resumeText, count = 5 } = req.body;
      const targetRole = role === "Custom" ? customRole || "Software Engineer" : role;

      const ai = getGeminiClient();
      const prompt = `You are an expert tech interviewer hiring for a ${experienceLevel} ${targetRole} role.
      ${interviewMode ? `Interview Focus: ${interviewMode}.` : ""}
      
      Candidate Resume Context:
      ${resumeText ? resumeText.slice(0, 6000) : "No resume provided."}

      Generate ${count} realistic, challenging, and highly relevant mock interview questions for this target role and experience level.
      Blend questions that probe both technical expertise, domain knowledge, real-world scenario solving, and resume achievements if available.
      Make each question distinct, realistic, and clear.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                question: { type: Type.STRING, description: "The interview question text" },
                category: { type: Type.STRING, description: "Technical, Behavioral, System Design, or Resume Specific" },
                conceptTested: { type: Type.STRING, description: "The core skill or concept tested" },
                contextHint: { type: Type.STRING, description: "A subtle guidance hint if candidate gets stuck" },
              },
              required: ["id", "question", "category", "conceptTested"],
            },
          },
        },
      });

      let questions = [];
      if (response.text) {
        questions = JSON.parse(response.text);
      }

      res.json({ questions });
    } catch (error: any) {
      console.error("Error generating questions:", error);
      res.status(500).json({ error: error.message || "Failed to generate interview questions" });
    }
  });

  // API 3: Evaluate Answer
  app.post("/api/interview/evaluate-answer", async (req, res) => {
    try {
      const { questionId, questionText, userAnswer, role, customRole, experienceLevel, resumeText } = req.body;
      const targetRole = role === "Custom" ? customRole || "Software Engineer" : role;

      if (!userAnswer || userAnswer.trim().length === 0) {
        return res.status(400).json({ error: "Candidate response cannot be empty." });
      }

      const ai = getGeminiClient();
      const prompt = `You are a tough but constructive Lead Interviewer assessing a ${experienceLevel} ${targetRole} candidate.
      
      QUESTION:
      "${questionText}"
      
      CANDIDATE'S ANSWER:
      "${userAnswer}"
      
      Candidate Resume Context (for grounding):
      ${resumeText ? resumeText.slice(0, 3000) : "N/A"}

      Evaluate the candidate's answer thoroughly and quantitatively.
      Provide scores from 0 to 100 for:
      - Confidence Score (assertiveness, clarity, structural delivery, lack of excessive filler/uncertainty)
      - Technical Score (accuracy, depth, best practices, edge cases handled)
      - Communication Score (structure, conciseness, articulation, logical flow)
      - Overall Score (weighted composite of overall performance on this question)

      Also provide:
      - strengths: 2-3 specific positive aspects of their answer
      - areasToImprove: 2-3 specific gaps, inaccuracies, or missing details
      - idealAnswer: A exemplary model answer (2-4 paragraphs or concise code/explanation) showing what a top 5% candidate would say
      - keyTakeaway: One single memorable piece of advice for this question`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              confidenceScore: { type: Type.INTEGER },
              technicalScore: { type: Type.INTEGER },
              communicationScore: { type: Type.INTEGER },
              overallScore: { type: Type.INTEGER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              areasToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
              idealAnswer: { type: Type.STRING },
              keyTakeaway: { type: Type.STRING },
            },
            required: [
              "confidenceScore",
              "technicalScore",
              "communicationScore",
              "overallScore",
              "strengths",
              "areasToImprove",
              "idealAnswer",
              "keyTakeaway",
            ],
          },
        },
      });

      let evalData = {};
      if (response.text) {
        evalData = JSON.parse(response.text);
      }

      res.json({
        questionId,
        questionText,
        userAnswer,
        ...evalData,
      });
    } catch (error: any) {
      console.error("Error evaluating answer:", error);
      res.status(500).json({ error: error.message || "Failed to evaluate candidate response" });
    }
  });

  // API 4: Generate Report
  app.post("/api/interview/generate-report", async (req, res) => {
    try {
      const { role, customRole, experienceLevel, interviewMode, evaluations, resumeFileName } = req.body;
      const targetRole = role === "Custom" ? customRole || "Software Engineer" : role;

      const ai = getGeminiClient();
      const prompt = `You are the Principal Technical Hiring Bar Raiser compiling a final Mock Interview Evaluation Report for a ${experienceLevel} ${targetRole} candidate.

      Interview Mode: ${interviewMode || "General"}
      Evaluated Questions & Answers:
      ${JSON.stringify(evaluations, null, 2)}

      Generate a comprehensive summary report in JSON with:
      - executiveSummary: High-level hiring recommendation summary (e.g., "Strong Hire", "Leaning Hire", "Needs Preparation") with 3-4 sentences of context.
      - strengthsSummary: Top 3-5 overall candidate superpowers shown across the interview.
      - keyWeaknesses: Top 3-4 major gaps or growth areas.
      - actionPlan: An array of 3-5 prioritized actionable learning steps with 'topic', 'description', and 'resourceOrExercise'.
      - recommendedQuestions: 3 tailored follow-up practice questions for their next iteration.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              strengthsSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyWeaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              actionPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    topic: { type: Type.STRING },
                    description: { type: Type.STRING },
                    resourceOrExercise: { type: Type.STRING },
                  },
                  required: ["topic", "description", "resourceOrExercise"],
                },
              },
              recommendedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["executiveSummary", "strengthsSummary", "keyWeaknesses", "actionPlan", "recommendedQuestions"],
          },
        },
      });

      let reportData = {};
      if (response.text) {
        reportData = JSON.parse(response.text);
      }

      // Compute aggregates
      let totalConfidence = 0;
      let totalTechnical = 0;
      let totalCommunication = 0;
      let totalOverall = 0;
      const count = evaluations.length || 1;

      evaluations.forEach((e: any) => {
        totalConfidence += e.confidenceScore || 0;
        totalTechnical += e.technicalScore || 0;
        totalCommunication += e.communicationScore || 0;
        totalOverall += e.overallScore || 0;
      });

      const report = {
        id: "rep_" + Date.now().toString(36),
        timestamp: Date.now(),
        role: targetRole,
        experienceLevel,
        interviewMode,
        resumeFileName,
        overallScore: Math.round(totalOverall / count),
        confidenceScore: Math.round(totalConfidence / count),
        technicalScore: Math.round(totalTechnical / count),
        communicationScore: Math.round(totalCommunication / count),
        questionsCount: count,
        evaluations,
        ...reportData,
      };

      res.json({ report });
    } catch (error: any) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: error.message || "Failed to generate interview report" });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
