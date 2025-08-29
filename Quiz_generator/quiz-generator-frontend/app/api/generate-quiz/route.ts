import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, difficulty } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const prompt = `
      Generate 3 multiple choice questions from the following text.
      Difficulty: ${difficulty || "medium"}.
      Text: """${text}"""

      Format strictly as:
      Q: <question>
      A) <option1>
      B) <option2>
      C) <option3>
      D) <option4>
      Answer: <correct option letter>
    `;

    console.log("Prompt sent to Ollama:", prompt);

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from Ollama API:", errorText);
      throw new Error(`Failed to get response from Ollama API: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.response;

    console.log("Raw Ollama output:", rawText);

    // Regex to extract Q, options, and Answer
    const regex =
      /Q:\s*(.+?)\s*A\)\s*(.+?)\s*B\)\s*(.+?)\s*C\)\s*(.+?)\s*D\)\s*(.+?)\s*Answer:\s*([A-D])/g;

    const quiz: { question: string; options: string[]; answer: string }[] = [];
    let match;
    while ((match = regex.exec(rawText)) !== null) {
      quiz.push({
        question: match[1].trim(),
        options: [match[2].trim(), match[3].trim(), match[4].trim(), match[5].trim()],
        answer: match[6].trim(),
      });
    }

    if (quiz.length === 0) {
      return NextResponse.json({
        quiz: [
          {
            question: "No valid quiz extracted",
            options: ["N/A", "N/A", "N/A", "N/A"],
            answer: "N/A",
          },
        ],
      });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}
