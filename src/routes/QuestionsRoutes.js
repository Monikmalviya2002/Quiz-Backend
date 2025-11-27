import express from "express";
import Question from "../models/Question.js";

const QuestionRouter = express.Router();

/**
 * GET /api/questions
 * Returns all questions.
 */
         QuestionRouter.get("/questions", async (req, res) => {
         try {
    const questions = await Question.find().select("-__v");
    res.json(questions);
  } catch (error) {
    console.error("getQuestions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/questions
 * Create a new question
 * Body: { question, options: [..4], correctAnswer: index, explanation }
 */
QuestionRouter.post("/questions", async (req, res) => {
  try {
    const { question, options, correctAnswer, explanation } = req.body;
    if (!question || !options || options.length !== 4 || typeof correctAnswer !== "number" || !explanation) {
      return res.status(400).json({ message: "Invalid request body. See docs." });
    }
    const q = new Question({ question, options, correctAnswer, explanation });
    const saved = await q.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("createQuestion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/submit
 * Accepts user answers and returns score + detailed review
 * Body: { answers: [index|null,...] }
 */
QuestionRouter.post("/submit", async (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "answers must be an array" });
    }

    const questions = await Question.find().select("-__v");

    let score = 0;
    const review = questions.map((q, i) => {
      const userAnswer = answers[i] === undefined ? null : answers[i];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) score++;

      return {
        questionId: q._id,
        question: q.question,
        options: q.options,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: isCorrect ? null : q.explanation
      };
    });

    res.json({
      totalQuestions: questions.length,
      score,
      review
    });
  } catch (error) {
    console.error("submitAnswers error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default QuestionRouter;
