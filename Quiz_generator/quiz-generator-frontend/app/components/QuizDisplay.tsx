type QuizItem = {
  question: string;
  options: string[];
  answer: string;
};

type QuizDisplayProps = {
  quiz: QuizItem[];  // now an array of quiz objects
};

export default function QuizDisplay({ quiz }: QuizDisplayProps) {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded">
      <h2 className="text-lg font-bold mb-2">Generated Quiz</h2>
      {quiz.map((item, index) => (
        <div key={index} className="mb-4 p-3 border border-gray-300 rounded bg-white">
          <h3 className="font-semibold">{item.question}</h3>
          <ul className="list-disc list-inside">
            {item.options.map((option, i) => (
              <li key={i}>{option}</li>
            ))}
          </ul>
          <p className="mt-1 font-medium">Answer: {item.answer}</p>
        </div>
      ))}
    </div>
  );
}
