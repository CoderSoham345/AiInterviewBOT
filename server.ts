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

  // 1. Resume Parsing Helper
  async function extractTextFromPayload(reqBody: any): Promise<string> {
    const { fileBase64, fileName, mimeType, rawText } = reqBody;
    if (rawText && rawText.trim().length > 0) return rawText;
    if (!fileBase64) return "";

    const buffer = Buffer.from(fileBase64, "base64");
    if (mimeType === "application/pdf" || fileName?.endsWith(".pdf")) {
      try {
        const pdfData = await pdfParse(buffer);
        return pdfData.text || buffer.toString("utf-8");
      } catch (err) {
        return buffer.toString("utf-8");
      }
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName?.endsWith(".docx")
    ) {
      try {
        const docResult = await mammoth.extractRawText({ buffer });
        return docResult.value || buffer.toString("utf-8");
      } catch (err) {
        return buffer.toString("utf-8");
      }
    }
    return buffer.toString("utf-8");
  }

  // Quick Resume Parse
  app.post("/api/resume/parse", async (req, res) => {
    try {
      const extractedText = await extractTextFromPayload(req.body);
      if (!extractedText || extractedText.trim().length < 10) {
        return res.status(400).json({ error: "Could not extract text from document." });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Analyze this candidate resume and extract summary data:
        RESUME:
        ${extractedText.slice(0, 15000)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              topSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experienceYears: { type: Type.STRING },
              highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
              resumeScore: { type: Type.INTEGER, description: "0 to 100 resume quality score" },
              atsScore: { type: Type.INTEGER, description: "0 to 100 default ATS readability score" },
            },
            required: ["summary", "topSkills", "experienceYears", "highlights", "resumeScore", "atsScore"],
          },
        },
      });

      let parsedInsight = {};
      if (response.text) {
        parsedInsight = JSON.parse(response.text);
      }

      res.json({
        text: extractedText,
        fileName: req.body.fileName || "Uploaded_Resume.pdf",
        ...parsedInsight,
      });
    } catch (error: any) {
      console.error("Error parsing resume:", error);
      res.status(500).json({ error: error.message || "Failed to process resume" });
    }
  });

  // Deep Resume Analysis
  app.post("/api/resume/full-analysis", async (req, res) => {
    try {
      const extractedText = await extractTextFromPayload(req.body);
      if (!extractedText || extractedText.trim().length < 10) {
        return res.status(400).json({ error: "No resume text provided." });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Conduct a deep professional resume audit for a candidate:
        RESUME TEXT:
        ${extractedText.slice(0, 18000)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              resumeScore: { type: Type.INTEGER },
              atsScore: { type: Type.INTEGER },
              topSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experienceYears: { type: Type.STRING },
              projects: { type: Type.ARRAY, items: { type: Type.STRING } },
              education: { type: Type.ARRAY, items: { type: Type.STRING } },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: [
              "summary",
              "resumeScore",
              "atsScore",
              "topSkills",
              "experienceYears",
              "projects",
              "education",
              "strengths",
              "weaknesses",
              "missingSkills",
              "recommendedImprovements",
            ],
          },
        },
      });

      let fullAnalysis = {};
      if (response.text) {
        fullAnalysis = JSON.parse(response.text);
      }

      res.json({
        text: extractedText,
        fileName: req.body.fileName || "Resume.pdf",
        ...fullAnalysis,
      });
    } catch (error: any) {
      console.error("Error in full resume analysis:", error);
      res.status(500).json({ error: error.message || "Failed to perform resume analysis" });
    }
  });

  // ATS Checker
  app.post("/api/ats/check", async (req, res) => {
    try {
      const { resumeText, jobDescription } = req.body;
      if (!resumeText || !jobDescription) {
        return res.status(400).json({ error: "Both resume text and job description are required." });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Act as an expert ATS (Applicant Tracking System) Scanner & Hiring Manager. Compare the candidate's resume against the Job Description.

        CANDIDATE RESUME:
        ${resumeText.slice(0, 15000)}

        TARGET JOB DESCRIPTION:
        ${jobDescription.slice(0, 10000)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              atsScore: { type: Type.INTEGER, description: "Overall ATS match score 0-100" },
              formattingScore: { type: Type.INTEGER },
              experienceMatchScore: { type: Type.INTEGER },
              educationMatchScore: { type: Type.INTEGER },
              matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              formattingFeedback: { type: Type.ARRAY, items: { type: Type.STRING } },
              experienceMatchSummary: { type: Type.STRING },
              improvedResumeRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: [
              "atsScore",
              "formattingScore",
              "experienceMatchScore",
              "educationMatchScore",
              "matchedKeywords",
              "missingKeywords",
              "formattingFeedback",
              "experienceMatchSummary",
              "improvedResumeRecommendations",
            ],
          },
        },
      });

      let atsResult = {};
      if (response.text) {
        atsResult = JSON.parse(response.text);
      }

      res.json(atsResult);
    } catch (error: any) {
      console.error("Error in ATS check:", error);
      res.status(500).json({ error: error.message || "Failed to run ATS scanner" });
    }
  });

  // Questions Generator
  app.post("/api/interview/generate-questions", async (req, res) => {
    try {
      const { role, experienceLevel, difficulty, interviewMode, resumeText, count = 5 } = req.body;

      const ai = getGeminiClient();
      const prompt = `You are an elite Lead Interviewer conducting a ${interviewMode || 'Technical'} interview for a ${experienceLevel} ${role} position.
      Difficulty Setting: ${difficulty || 'Medium'}.
      
      Candidate Resume Context:
      ${resumeText ? resumeText.slice(0, 8000) : "No resume attached."}

      Generate ${count} realistic interview questions.
      Ensure questions start accessible and progressively build in depth and difficulty.
      Mix conceptual understanding, real-world scenario handling, trade-offs, and resume-specific deep dives if applicable.`;

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
                question: { type: Type.STRING },
                category: { type: Type.STRING },
                conceptTested: { type: Type.STRING },
                difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
                contextHint: { type: Type.STRING },
              },
              required: ["id", "question", "category", "conceptTested", "difficulty"],
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
      res.status(500).json({ error: error.message || "Failed to generate questions" });
    }
  });

  // Evaluate Single Answer
  app.post("/api/interview/evaluate-answer", async (req, res) => {
    try {
      const { questionId, questionText, userAnswer, role, experienceLevel, resumeText } = req.body;

      if (!userAnswer || userAnswer.trim().length === 0) {
        return res.status(400).json({ error: "Answer cannot be empty." });
      }

      const ai = getGeminiClient();
      const prompt = `You are a Principal Bar Raiser evaluating a candidate's response in a ${experienceLevel} ${role} interview.
      
      QUESTION: "${questionText}"
      CANDIDATE ANSWER: "${userAnswer}"
      
      Resume Context: ${resumeText ? resumeText.slice(0, 3000) : "N/A"}

      Evaluate the response across all 6 core dimensions (scores 0-100):
      1. Confidence Score
      2. Technical Score
      3. Communication Score
      4. Problem Solving Score
      5. Behavioural Score
      6. Overall Score

      Also provide:
      - whatWasGood: 2-3 specific bullet points of praise
      - whatWasMissing: 2-3 specific missing technical points or nuances
      - idealAnswer: A benchmark top 5% candidate response
      - suggestedImprovement: Concrete 2-3 sentence tip on how to restructure or deepen this answer
      - learningResources: Array of 2 relevant topics/resources with title and description`;

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
              problemSolvingScore: { type: Type.INTEGER },
              behaviouralScore: { type: Type.INTEGER },
              overallScore: { type: Type.INTEGER },
              whatWasGood: { type: Type.ARRAY, items: { type: Type.STRING } },
              whatWasMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
              idealAnswer: { type: Type.STRING },
              suggestedImprovement: { type: Type.STRING },
              learningResources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ["title", "description"],
                },
              },
            },
            required: [
              "confidenceScore",
              "technicalScore",
              "communicationScore",
              "problemSolvingScore",
              "behaviouralScore",
              "overallScore",
              "whatWasGood",
              "whatWasMissing",
              "idealAnswer",
              "suggestedImprovement",
              "learningResources",
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
      res.status(500).json({ error: error.message || "Failed to evaluate answer" });
    }
  });

  // Generate Comprehensive Interview Report
  app.post("/api/interview/generate-report", async (req, res) => {
    try {
      const { role, interviewType, experienceLevel, difficulty, durationMinutes, evaluations, resumeFileName } = req.body;

      const ai = getGeminiClient();
      const prompt = `You are a Chief Talent Officer compiling the final Interview Performance Report for a ${experienceLevel} ${role} candidate (${interviewType || 'General'}).

      EVALUATIONS HISTORY:
      ${JSON.stringify(evaluations, null, 2)}

      Generate a comprehensive hiring scorecard report in JSON format including:
      - hiringRecommendation: "Strong Hire", "Hire", "Leaning Hire", or "Needs Preparation"
      - executiveSummary: Comprehensive 3-4 sentence hiring feedback summary
      - strengths: Top 4 candidate strengths
      - weaknesses: Top 4 candidate gaps/weaknesses
      - skillGapAnalysis: Array of objects { skill, status: 'Proficient'|'Developing'|'Gap', note }
      - improvementRoadmap: Array of 4 phases { phase: 'Week 1'|'Week 2'|'Week 3'|'Week 4', title, action }
      - recommendedCourses: Array of 3 recommended learning courses { name, provider, url }
      - recommendedProjects: Array of 2 hands-on practice projects { title, description, tech }
      - nextPrepPlan: 2 sentence conclusion and next interview focus plan`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hiringRecommendation: { type: Type.STRING },
              executiveSummary: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              skillGapAnalysis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    status: { type: Type.STRING },
                    note: { type: Type.STRING },
                  },
                  required: ["skill", "status", "note"],
                },
              },
              improvementRoadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phase: { type: Type.STRING },
                    title: { type: Type.STRING },
                    action: { type: Type.STRING },
                  },
                  required: ["phase", "title", "action"],
                },
              },
              recommendedCourses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    provider: { type: Type.STRING },
                    url: { type: Type.STRING },
                  },
                  required: ["name", "provider", "url"],
                },
              },
              recommendedProjects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    tech: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["title", "description", "tech"],
                },
              },
              nextPrepPlan: { type: Type.STRING },
            },
            required: [
              "hiringRecommendation",
              "executiveSummary",
              "strengths",
              "weaknesses",
              "skillGapAnalysis",
              "improvementRoadmap",
              "recommendedCourses",
              "recommendedProjects",
              "nextPrepPlan",
            ],
          },
        },
      });

      let reportDetails = {};
      if (response.text) {
        reportDetails = JSON.parse(response.text);
      }

      // Compute composite scores
      let sumOverall = 0, sumConf = 0, sumTech = 0, sumComm = 0, sumProblem = 0, sumBehav = 0;
      const count = evaluations.length || 1;

      evaluations.forEach((e: any) => {
        sumOverall += e.overallScore || 0;
        sumConf += e.confidenceScore || 0;
        sumTech += e.technicalScore || 0;
        sumComm += e.communicationScore || 0;
        sumProblem += e.problemSolvingScore || 0;
        sumBehav += e.behaviouralScore || 0;
      });

      const fullReport = {
        id: "rep_" + Date.now().toString(36),
        timestamp: Date.now(),
        role: role || "Software Engineer",
        interviewType: interviewType || "Technical Interview",
        experienceLevel: experienceLevel || "Mid-Level",
        difficulty: difficulty || "Medium",
        durationMinutes: durationMinutes || 20,
        resumeFileName,
        overallScore: Math.round(sumOverall / count),
        confidenceScore: Math.round(sumConf / count),
        technicalScore: Math.round(sumTech / count),
        communicationScore: Math.round(sumComm / count),
        problemSolvingScore: Math.round(sumProblem / count),
        behaviouralScore: Math.round(sumBehav / count),
        evaluations,
        ...reportDetails,
      };

      res.json({ report: fullReport });
    } catch (error: any) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: error.message || "Failed to compile interview report" });
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
    console.log(`AI Interview Coach server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
