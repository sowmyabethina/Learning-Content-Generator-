import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser
} from "@clerk/clerk-react";

import { useState } from "react";
import "./App.css";

// Components
import { TopBar, PdfExtraction, ExtractedContentPreview, Quiz, QuizResult, TopicInput, LearningQuestions, PersonalizedContent, LevelTest, LevelResult, ContentRecommendations, SuccessMessage } from "./components";

function App() {
  // ==========================================
  // STEP 1: PDF Extraction & Content States
  // ==========================================
  const [githubLink, setGithubLink] = useState("");
  // const [pdfFile, setPdfFile] = useState(null);  // Optional: for future file upload feature
  const [extractedContent, setExtractedContent] = useState("");
  const [isExtracted, setIsExtracted] = useState(false);
  // const [extractionSuccess, setExtractionSuccess] = useState(false);  // Optional: tracking extracted state

  // ==========================================
  // STEP 2: Quiz & Questions States
  // ==========================================
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(null);
  const [selected, setSelected] = useState("");
  const [showResult, setShowResult] = useState(false);
  // Server-side quiz id and user answers for evaluation
  const [quizId, setQuizId] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  // ==========================================
  // STEP 3: Topic Input State
  // ==========================================
  const [topic, setTopic] = useState("");
  const [showTopicInput, setShowTopicInput] = useState(false);

  // ==========================================
  // STEP 4: Learning Preference Questions
  // ==========================================
  // After topic input, collect learning style preferences
  const [learningQuestions, setLearningQuestions] = useState([]);
  const [learningIndex, setLearningIndex] = useState(0);
  const [learningSelected, setLearningSelected] = useState("");
  const [learningAnswers, setLearningAnswers] = useState([]);
  const [showLearningQuestions, setShowLearningQuestions] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [learningStyleId, setLearningStyleId] = useState(null);
  const [showPersonalizedContent, setShowPersonalizedContent] = useState(false);
  const [personalizedContent, setPersonalizedContent] = useState(null);

  // ==========================================
  // STEP 5: Level Assessment Test States
  // ==========================================
  // After user enters topic, assess their knowledge level on that topic
  const [levelTestQuestions, setLevelTestQuestions] = useState([]);
  const [levelTestIndex, setLevelTestIndex] = useState(0);
  const [levelTestSelected, setLevelTestSelected] = useState("");
  const [levelTestAnswers, setLevelTestAnswers] = useState([]);
  const [showLevelTest, setShowLevelTest] = useState(false);
  const [detectedLevel, setDetectedLevel] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [levelTestScore, setLevelTestScore] = useState(0);
  const [showLevelResult, setShowLevelResult] = useState(false);

  // ==========================================
  // STEP 5: Personalized Quiz States
  // ==========================================
  // These states manage the adaptive/personalized quiz flow.
  const [personalizedQuestions, setPersonalizedQuestions] = useState([]);
  const [personalIndex, setPersonalIndex] = useState(0);
  const [personalSelected, setPersonalSelected] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [showPersonalizedQuiz, setShowPersonalizedQuiz] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [personalAnswers, setPersonalAnswers] = useState([]); // store selections for topic generation
  // eslint-disable-next-line no-unused-vars
  const [showGenerateTopicButton, setShowGenerateTopicButton] = useState(false);
  const [generatedTopics, setGeneratedTopics] = useState([]);

  // Get Clerk user for personalization hints (kept optional)
  const { user } = useUser();

  // General states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================
  // HELPER: Parse MCQ text into structured questions
  // ==========================================
  const parseQuestionsFromText = (text) => {
    const questions = [];
    if (!text || typeof text !== "string") return [];
    
    // Split by MCQ section header and extract MCQ section
    const sections = text.split(/\*\*Multiple-Choice Questions\*\*|\*\*Multiple Choice Questions\*\*/i);
    const mcqSection = sections.length > 1 ? sections[1] : text;
    
    // Split questions by numbered pattern (1., 2., 3., etc.)
    const questionBlocks = mcqSection.split(/\n(?=\d+\.)/);
    
    for (const block of questionBlocks) {
      const lines = block.trim().split("\n").filter(l => l.trim());
      if (lines.length < 4) continue;
      
      // Extract question text (first line, remove number)
      let questionText = lines[0].replace(/^\d+\.\s*/, "").trim();
      // Remove URL artifacts if present
      questionText = questionText.replace(/http[s]?:\/\/\S+/g, "").trim();
      
      // Extract options (lines with A), B), C), D))
      const options = [];
      let correctAnswer = null;
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Match option pattern: A) or A. at start of line
        const optionMatch = line.match(/^([A-D])[.)]\s*(.+?)(?:\s*\*?Correct Answer:\*?.*)?$/i);
        if (optionMatch) {
          // optionMatch[1] contains the option letter (A, B, C, D)
          let optionText = optionMatch[2].trim();
          
          // Clean up option text
          optionText = optionText.replace(/\*?Correct Answer:\*?\s*[A-D]?\s*$/i, "").trim();
          
          if (optionText && optionText.length > 0) {
            options.push(optionText);
          }
          
          // Check if this line contains the correct answer marker
          if (line.match(/\*?Correct Answer:\*?\s*([A-D])/i)) {
            const match = line.match(/\*?Correct Answer:\*?\s*([A-D])/i);
            correctAnswer = match[1];
          }
        }
      }
      
      // Ensure we have at least 3 options and a valid question
      if (questionText && options.length >= 3) {
        // If we have more than 4, trim to 4
        const finalOptions = options.slice(0, 4);
        
        let answerIndex = 0;
        if (correctAnswer) {
          answerIndex = correctAnswer.charCodeAt(0) - 65;
          // Ensure answerIndex is valid
          if (answerIndex < 0 || answerIndex >= finalOptions.length) {
            answerIndex = 0;
          }
        }
        
        questions.push({
          question: questionText,
          options: finalOptions,
          answer: finalOptions[answerIndex] || finalOptions[0]
        });
      }
    }
    
    return questions;
  };


  // =========================================
  // Reset all states for a new session
  // =========================================
  const resetAllStates = () => {
    setQuestions([]);
    setIndex(0);
    setScore(0);
    setSelected("");
    setQuizId(null);
    setUserAnswers([]);
    setCorrectCount(null);
    setShowResult(false);
    setTopic("");
    setShowTopicInput(false);
    setLearningQuestions([]);
    setLearningIndex(0);
    setLearningSelected("");
    setLearningAnswers([]);
    setShowLearningQuestions(false);
    setLearningStyleId(null);
    setShowPersonalizedContent(false);
    setPersonalizedContent(null);
    setExtractedContent("");
    setIsExtracted(false);
    setGithubLink("");
    setError("");
    setSuccessMessage("");
    setLevelTestQuestions([]);
    setLevelTestIndex(0);
    setLevelTestSelected("");
    setLevelTestAnswers([]);
    setShowLevelTest(false);
    setDetectedLevel(null);
    setLevelTestScore(0);
    setShowLevelResult(false);
    setGeneratedTopics([]);
    setPersonalizedQuestions([]);
    setPersonalIndex(0);
    setPersonalSelected("");
    setShowPersonalizedQuiz(false);
    setPersonalAnswers([]);
    setShowGenerateTopicButton(false);
  };


  // =========================================
  // Reset states for new level assessment
  // =========================================
  const resetLevelAssessment = () => {
    setShowLevelResult(false);
    setShowTopicInput(true);
    setTopic("");
    setDetectedLevel(null);
    setLevelTestScore(0);
  };


  // =========================================
  // Reset states for new topic
  // =========================================
  const resetForNewTopic = () => {
    setTopic("");
    setShowPersonalizedContent(false);
    setPersonalizedContent(null);
    setShowResult(true);
  };


  // =========================================
  // Reset for content recommendations
  // =========================================
  const resetForContentRecommendations = () => {
    setGeneratedTopics([]);
    setTopic("");
    setDetectedLevel(null);
    setShowTopicInput(true);
  };


  // =========================================
  // Reset for new session from content recommendations
  // =========================================
  const resetFromContentRecommendations = () => {
    setQuestions([]);
    setIndex(0);
    setScore(0);
    setSelected("");
    setQuizId(null);
    setUserAnswers([]);
    setCorrectCount(null);
    setShowResult(false);
    setTopic("");
    setExtractedContent("");
    setIsExtracted(false);
    setGithubLink("");
    setError("");
    setSuccessMessage("");
    setGeneratedTopics([]);
    setDetectedLevel(null);
    setLevelTestQuestions([]);
    setLevelTestIndex(0);
    setLevelTestSelected("");
    setLevelTestAnswers([]);
    setShowLevelTest(false);
    setLevelTestScore(0);
    setShowLevelResult(false);
  };


  // =========================================
  // STEP 1: EXTRACT DOCUMENT FROM GITHUB PDF
  // =========================================
  const extractDocument = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (!githubLink.trim()) {
        setError("Please paste a GitHub PDF link");
        setLoading(false);
        return;
      }

      // Step 1a: Extract PDF content from GitHub
      const res = await fetch("http://localhost:5000/read-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github_url: githubLink })
      });

      const data = await res.json();

      if (!data.text) {
        setError("Failed to extract PDF. Please check the link and try again.");
        setLoading(false);
        return;
      }

      // Step 1b: Store extracted content
      setExtractedContent(data.text);
      setIsExtracted(true);
      
      // Show success message
      setSuccessMessage("✅ PDF extracted successfully!");
      
      // Clear the message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err) {
      console.error(err);
      setError("Document extraction failed. Make sure the PDF link is correct.");
    }

    setLoading(false);
  };


  // =========================================
  // STEP 5: Generate Personalized Quiz
  // =========================================
  const generatePersonalizedQuiz = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const profile = user ? { id: user.id, fullName: user.fullName, primaryEmail: user.primaryEmailAddress?.emailAddress || null } : {};

      // IMPORTANT: Personalized quiz focuses on learning preferences, NOT topic-based questions
      const payload = {
        userProfile: profile
      };

      const res = await fetch("http://localhost:5000/generate-from-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server ${res.status}: ${txt}`);
      }

      const data = await res.json();

      // Expecting JSON array of questions
      if (Array.isArray(data) && data.length > 0) {
        setPersonalizedQuestions(data);
        setPersonalIndex(0);
        setPersonalSelected("");
        setPersonalAnswers([]);
        setShowPersonalizedQuiz(true);
        setShowGenerateTopicButton(false);
      } else {
        setError("Learning preference assessment returned no questions");
      }

    } catch (err) {
      console.error("Personalized generation error:", err);
      setError(`Learning assessment failed: ${err.message}`);
    }

    setLoading(false);
  };


  // =========================================
  // Personalized Quiz: Next Question
  // =========================================
  const nextPersonalQuestion = () => {
    // record answer
    setPersonalAnswers(prev => [...prev, personalSelected]);

    setPersonalSelected("");

    if (personalIndex + 1 < personalizedQuestions.length) {
      setPersonalIndex(personalIndex + 1);
    } else {
      // Finished personalized quiz: do NOT show result, show success message
      setShowPersonalizedQuiz(false);
      setSuccessMessage("✅ Personalized assessment completed!");
      setTimeout(() => setSuccessMessage(""), 3000);
      // Now show the Generate Content button
      setShowGenerateTopicButton(true);
    }
  };


  // =========================================
  // Generate Level Assessment Test
  // =========================================
  const generateLevelTest = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (!topic.trim()) {
        setError("Please enter a topic");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/generate-level-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server ${res.status}: ${txt}`);
      }

      const data = await res.json();

      // Expecting JSON array of questions
      if (Array.isArray(data) && data.length > 0) {
        setLevelTestQuestions(data);
        setLevelTestIndex(0);
        setLevelTestSelected("");
        setLevelTestAnswers([]);
        setShowLevelTest(true);
        setShowTopicInput(false);
        setShowLevelResult(false);
        setSuccessMessage("💡 Level Assessment Started!");
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        setError("Level test generation failed - no questions received");
      }

    } catch (err) {
      console.error("Level test generation error:", err);
      setError(`Assessment generation failed: ${err.message}`);
    }

    setLoading(false);
  };


  // =========================================
  // Next Level Test Question
  // =========================================
  const nextLevelTestQuestion = () => {
    if (!levelTestSelected) {
      return;
    }

    const nextAnswers = [...levelTestAnswers, levelTestSelected];
    setLevelTestAnswers(nextAnswers);
    setLevelTestSelected("");

    if (levelTestIndex + 1 < levelTestQuestions.length) {
      setLevelTestIndex(levelTestIndex + 1);
    } else {
      // Level test completed - evaluate immediately
      evaluateAndShowLevel(nextAnswers);
    }
  };


  // =========================================
  // Evaluate Level and Show Result
  // =========================================
  const evaluateAndShowLevel = async (finalAnswers) => {
    try {
      const correctAnswers = levelTestQuestions.map(q => q.answer);

      const resp = await fetch("http://localhost:5000/evaluate-level", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: finalAnswers,
          correctAnswers: correctAnswers
        })
      });

      if (resp.ok) {
        const result = await resp.json();
        if (result.success) {
          setDetectedLevel(result.level);
          setLevelTestScore(result.percentage);
          setShowLevelTest(false);
          setShowLevelResult(true);
          setSuccessMessage(`✨ Your level: ${result.level}`);
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      } else {
        throw new Error("Server evaluation failed");
      }
    } catch (err) {
      console.error("Level evaluation error:", err);
      setError(`Level evaluation failed: ${err.message}`);
    }
  };


  // =========================================
  // Generate Content Based on Level
  // =========================================
  const getContentForLevel = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        level: detectedLevel,
        topic: topic,
        userProfile: user ? { id: user.id, fullName: user.fullName } : {}
      };

      const res = await fetch("http://localhost:5000/generate-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server ${res.status}: ${txt}`);
      }

      const data = await res.json();
      if (data && Array.isArray(data.topics)) {
        setGeneratedTopics(data.topics);
        setShowLevelResult(false);
        setShowGenerateTopicButton(false);
        setSuccessMessage("📚 Content generated based on your level!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError("Content generation returned unexpected format");
      }

    } catch (err) {
      console.error("Content generation error:", err);
      setError(`Content generation failed: ${err.message}`);
    }

    setLoading(false);
  };


  // =========================================
  // STEP 2B: GENERATE LEARNING PREFERENCE QUESTIONS
  // =========================================
  const generateLearningQuestions = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/generate-learning-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server ${res.status}: ${errorData}`);
      }

      const data = await res.json();
      console.log("✅ Learning questions received:", data.length, "questions");

      if (Array.isArray(data) && data.length === 5) {
        setLearningQuestions(data);
        setLearningIndex(0);
        setLearningSelected("");
        setLearningAnswers([]);
        setShowLearningQuestions(true);
        setShowTopicInput(false);
        setSuccessMessage("");
      } else {
        setError("Invalid learning questions format from server");
      }

    } catch (err) {
      console.error("❌ Learning questions error:", err);
      setError(`Failed to load learning questions: ${err.message}`);
    }

    setLoading(false);
  };


  // =========================================
  // STEP 2C: NEXT LEARNING PREFERENCE QUESTION
  // =========================================
  const nextLearningQuestion = () => {
    if (!learningSelected) {
      return;
    }

    // Convert option value to index for backend
    const currentQuestion = learningQuestions[learningIndex];
    const answerIndex = currentQuestion?.options?.indexOf(learningSelected) ?? 0;
    
    // Record the selected option index
    const nextAnswers = [...learningAnswers, answerIndex];
    setLearningAnswers(nextAnswers);
    setLearningSelected("");

    if (learningIndex + 1 < learningQuestions.length) {
      // Move to next question
      setLearningIndex(learningIndex + 1);
    } else {
      // Learning questions completed - evaluate and generate content
      evaluateLearningStyle(nextAnswers);
    }
  };


  // =========================================
  // STEP 2D: EVALUATE LEARNING STYLE
  // =========================================
  const evaluateLearningStyle = async (answers) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/evaluate-learning-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answers,
          topic: topic
        })
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server ${res.status}: ${errorData}`);
      }

      const result = await res.json();
      console.log("✅ Learning style evaluated:", result.success);

      if (result.success) {
        setLearningStyleId(result.styleId);
        setShowLearningQuestions(false);
        
        // Hide loading and auto-generate personalized content
        await generatePersonalizedContent(result.styleId);
      }

    } catch (err) {
      console.error("❌ Learning style evaluation error:", err);
      setError(`Evaluation failed: ${err.message}`);
      setLoading(false);
    }
  };


  // =========================================
  // STEP 2E: GENERATE PERSONALIZED CONTENT
  // =========================================
  const generatePersonalizedContent = async (styleId) => {
    try {
      const res = await fetch("http://localhost:5000/generate-personalized-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic,
          styleId: styleId
        })
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server ${res.status}: ${errorData}`);
      }

      const content = await res.json();
      console.log("✅ Personalized content generated for topic:", topic);

      setPersonalizedContent(content);
      setShowPersonalizedContent(true);
      setSuccessMessage("📚 Personalized learning path created for you!");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err) {
      console.error("❌ Content generation error:", err);
      setError(`Content generation failed: ${err.message}`);
    }

    setLoading(false);
  };


  // =========================================
  // STEP 2: GENERATE QUESTIONS FROM CONTENT
  // =========================================
  const generateQuiz = async (useExtractedContent = true) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      let res;
      let payload = {};

      // Option 1: Generate from extracted document content
      if (useExtractedContent && extractedContent) {
        console.log("🚀 Generating quiz from extracted content, length:", extractedContent.length);
        payload = {
          docText: extractedContent.substring(0, 12000)
        };

        res = await fetch("http://localhost:5000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      // Option 2: Generate from user-entered topic
      else if (topic.trim()) {
        console.log("🚀 Generating quiz from topic:", topic);
        payload = { topic: topic };
        res = await fetch("http://localhost:5000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      else {
        setError("Please extract a PDF first or enter a topic");
        setLoading(false);
        return;
      }

      console.log("📡 Response status:", res.status);

      // Capture server-side quiz id header if provided
      try {
        const qid = res.headers.get("X-Quiz-Id");
        if (qid) {
          console.log("Captured quiz id:", qid);
          setQuizId(qid);
        }
      } catch (e) {
        // ignore
      }

      if (!res.ok) {
        const errorData = await res.text();
        console.error("❌ Server error:", errorData);
        setError(`Server error: ${res.status} - ${errorData}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("📨 Response data:", data);

      let parsedQuestions = [];

      if (Array.isArray(data)) {
        // NEW: Gemini returns JSON array directly
        console.log("✅ Direct JSON format detected, count:", data.length);
        parsedQuestions = data.map(q => ({
          question: q.question,
          options: Array.isArray(q.options) ? q.options : [q.options],
          answer: q.answer || q.options[0]
        }));
        // If backend set a quiz id in header, capture it for evaluation
        try {
          const qid = res.headers.get("X-Quiz-Id");
          if (qid) setQuizId(qid);
        } catch (e) {
          console.warn("Could not read quiz id header", e);
        }
      } else if (data.questions) {
        // OLD: Handle nested response structure: {questions: {questions: "..."}}
        let questionsText = typeof data.questions === 'object' ? data.questions.questions : data.questions;
        
        console.log("📝 Questions text length:", questionsText ? questionsText.length : 0);
        
        // Try to parse as JSON first
        try {
          const jsonParsed = JSON.parse(questionsText);
          if (Array.isArray(jsonParsed)) {
            console.log("✅ JSON array detected from text");
            parsedQuestions = jsonParsed.map(q => ({
              question: q.question,
              options: Array.isArray(q.options) ? q.options : [q.options],
              answer: q.answer || q.options[0]
            }));
          } else {
            throw new Error("Not an array");
          }
        } catch (e) {
          console.log("📄 Parsing as text format");
          parsedQuestions = parseQuestionsFromText(questionsText);
        }
      } else if (data.error) {
        console.error("❌ API Error:", data.error);
        setError(`API Error: ${data.error}`);
        setLoading(false);
        return;
      } else {
        console.error("❌ Unknown response format:", data);
        setError("Unexpected response format from server");
        setLoading(false);
        return;
      }

      console.log("✅ Parsed questions count:", parsedQuestions.length);

      if (parsedQuestions.length > 0) {
        const normalized = parsedQuestions.map(q => {
          let correct = q.answer;

          // Convert A/B/C/D → option text
          if (typeof correct === "string" && /^[A-D]$/i.test(correct)) {
            const idx = correct.toUpperCase().charCodeAt(0) - 65;
            correct = q.options[idx];
          }

          // Convert number → option text
          if (typeof correct === "number") {
            correct = q.options[correct];
          }

          return {
            ...q,
            answer: correct?.trim()
          };
        });

        setQuestions(normalized);
        setIndex(0);
        setScore(0);
        setUserAnswers([]);
        setCorrectCount(null);
        setSelected("");
        setShowResult(false);
        setShowTopicInput(false);
        setSuccessMessage("✅ Questions generated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        console.log("🎉 Quiz ready with", parsedQuestions.length, "questions");
      } else {
        console.error("❌ Failed to parse any questions");
        setError("Could not parse questions. Please try again.");
      }

    } catch (err) {
      console.error("💥 Error:", err);
      setError(`Error: ${err.message}`);
    }

    setLoading(false);
  };


  // ==========================
  // Next Question
  // ==========================
  const nextQuestion = () => {
    // Record user's answer for this question
    if (!selected) {
      return;
    }

    const nextUserAnswers = [...userAnswers, selected];
    setUserAnswers(nextUserAnswers);

    setSelected("");

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      // Quiz completed - evaluate against server-stored answer key if available
      setSuccessMessage("✅ Quiz completed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      const evaluateAndShow = async () => {
        try {
          // If we have a server-side quizId, use it; otherwise fall back to client-side scoring
          if (quizId) {
            const resp = await fetch("http://localhost:5000/evaluate-quiz", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quizId, answers: nextUserAnswers })
            });

            if (resp.ok) {
              const result = await resp.json();
              if (result && result.success) {
                setScore(Number(result.score) || 0);
                setCorrectCount(Number(result.correct) || 0);
                setShowResult(true);
              } else {
                const correct = result.correct || 0;
                const total = (questions && questions.length) || 0;
                const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
                setScore(percent);
                setCorrectCount(correct);
                setShowResult(true);
              }
            } else {
              console.error("Evaluation API failed", resp.status);
              const clientCorrect = questions.reduce((acc, q, i) => acc + ((q.answer || "").toString().trim().toLowerCase() === (nextUserAnswers[i] || "").toString().trim().toLowerCase() ? 1 : 0), 0);
              const percent = questions.length > 0 ? Math.round((clientCorrect / questions.length) * 100) : 0;
              setScore(percent);
              setCorrectCount(clientCorrect);
              setShowResult(true);
            }
          } else {
            const clientCorrect = questions.reduce((acc, q, i) => acc + ((q.answer || "").toString().trim().toLowerCase() === (nextUserAnswers[i] || "").toString().trim().toLowerCase() ? 1 : 0), 0);
            const percent = questions.length > 0 ? Math.round((clientCorrect / questions.length) * 100) : 0;
            setScore(percent);
            setCorrectCount(clientCorrect);
            setShowResult(true);
          }
        } catch (err) {
          console.error("Evaluation error:", err);
          const clientCorrect = questions.reduce((acc, q, i) => acc + ((q.answer || "").toString().trim().toLowerCase() === (nextUserAnswers[i] || "").toString().trim().toLowerCase() ? 1 : 0), 0);
          const percent = questions.length > 0 ? Math.round((clientCorrect / questions.length) * 100) : 0;
          setScore(percent);
          setShowResult(true);
        }
      };

      evaluateAndShow();
    }
  };


  // ==========================
  // UI
  // ==========================
  return (

    <div className="container">

      {/* Logged Out */}

      <SignedOut>

        <div className="login-box">
          <h2>Login to Continue</h2>
          <SignIn />
        </div>

      </SignedOut>


      {/* Logged In */}

      <SignedIn>

        <TopBar />


        {/* Header */}

        <div className="header">
          <h1>Personalized Learning Platform</h1>
        </div>


        {/* Success Message */}
        <SuccessMessage successMessage={successMessage} />


        {/* ============================= */}
        {/* EXTRACTION STEP */}
        {/* ============================= */}
        {!isExtracted && (
          <PdfExtraction 
            githubLink={githubLink}
            setGithubLink={setGithubLink}
            extractDocument={extractDocument}
            loading={loading}
            error={error}
          />
        )}


        {/* ============================= */}
        {/* EXTRACTED CONTENT PREVIEW */}
        {/* ============================= */}
        {isExtracted && !questions.length && !showTopicInput && (
          <ExtractedContentPreview 
            extractedContent={extractedContent}
            generateQuiz={generateQuiz}
            loading={loading}
            onBack={() => {
              setGithubLink("");
              setExtractedContent("");
              setIsExtracted(false);
              setError("");
            }}
          />
        )}


        {/* ============================= */}
        {/* QUIZ STEP */}
        {/* ============================= */}
        {questions.length > 0 && !showResult && (
          <Quiz 
            questions={questions}
            index={index}
            selected={selected}
            setSelected={setSelected}
            nextQuestion={nextQuestion}
          />
        )}


        {/* ============================= */}
        {/* QUIZ RESULT & TOPIC INPUT */}
        {/* ============================= */}
        {showResult && !showTopicInput && (
          <QuizResult 
            correctCount={correctCount}
            questions={questions}
            score={score}
            onAssessLevel={() => setShowTopicInput(true)}
            onNewSession={resetAllStates}
          />
        )}


        {/* ============================= */}
        {/* TOPIC INPUT */}
        {/* ============================= */}
        {showTopicInput && (
          <TopicInput 
            topic={topic}
            setTopic={setTopic}
            onGenerateLearningQuestions={generateLearningQuestions}
            onBack={() => {
              setShowTopicInput(false);
              setShowResult(true);
            }}
            loading={loading}
            error={error}
          />
        )}


        {/* ============================= */}
        {/* LEARNING PREFERENCE QUESTIONS */}
        {/* ============================= */}
        {showLearningQuestions && learningQuestions.length > 0 && (
          <LearningQuestions 
            learningQuestions={learningQuestions}
            learningIndex={learningIndex}
            learningSelected={learningSelected}
            setLearningSelected={setLearningSelected}
            nextLearningQuestion={nextLearningQuestion}
            loading={loading}
          />
        )}


        {/* ============================= */}
        {/* PERSONALIZED LEARNING CONTENT */}
        {/* ============================= */}
        {showPersonalizedContent && personalizedContent && (
          <PersonalizedContent 
            personalizedContent={personalizedContent}
            onUnderstood={() => {
              setTopic("");
              setShowPersonalizedContent(false);
              setPersonalizedContent(null);
              setShowResult(true);
            }}
            onBack={() => {
              setShowPersonalizedContent(false);
              setPersonalizedContent(null);
              setShowResult(true);
            }}
          />
        )}


        {/* ============================= */}
        {/* LEVEL ASSESSMENT TEST */}
        {/* ============================= */}
        {showLevelTest && levelTestQuestions.length > 0 && (
          <LevelTest 
            levelTestQuestions={levelTestQuestions}
            levelTestIndex={levelTestIndex}
            levelTestSelected={levelTestSelected}
            setLevelTestSelected={setLevelTestSelected}
            nextLevelTestQuestion={nextLevelTestQuestion}
          />
        )}


        {/* ============================= */}
        {/* LEVEL ASSESSMENT RESULT */}
        {/* ============================= */}
        {showLevelResult && detectedLevel && (
          <LevelResult 
            detectedLevel={detectedLevel}
            topic={topic}
            getContentForLevel={getContentForLevel}
            loading={loading}
            onBack={resetLevelAssessment}
          />
        )}


        {/* ============================= */}
        {/* CONTENT RECOMMENDATIONS */}
        {/* ============================= */}
        {generatedTopics.length > 0 && !showLevelResult && (
          <ContentRecommendations 
            generatedTopics={generatedTopics}
            detectedLevel={detectedLevel}
            topic={topic}
            onAssessAnother={resetForContentRecommendations}
            onNewSession={resetFromContentRecommendations}
          />
        )}


      </SignedIn>

    </div>
  );
}

export default App;
