"use client";

import { useState } from "react";
import Loader from "./Loader";
import QuizDisplay from "./QuizDisplay";

type QuizItem = {
  question: string;
  options: string[];
  answer: string;
};

export default function QuizForm() {
  const [text, setText] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizItem[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setQuiz(null);

    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, difficulty }),
      });

      if (!res.ok) {
        console.error("API error:", await res.text());
        setQuiz(null);
        return;
      }

      const data = await res.json();
      setQuiz(data.quiz || null);
    } catch (err) {
      console.error("Request failed:", err);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border p-2 rounded"
          rows={5}
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <select
          className="border p-2 rounded w-full"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Generate Quiz
        </button>
      </form>

      {loading && <Loader />}
      {quiz && <QuizDisplay quiz={quiz} />}
    </div>
  );
}
