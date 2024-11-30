import { useState } from "react";

const QuestionsPage = () => {
  const questions = [
    {
      id: 1,
      question: 'What is 1+1',
      options: ['1', '0', '2', '3'],
    },
    {
      id: 2,
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    },
   
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = optionIndex; 
    setSelectedAnswers(updatedAnswers);
  };

  const getAnswers = () => {
    return selectedAnswers.map((answerIndex, questionIndex) => {
      if (answerIndex === undefined) {
        return `No answer selected for Question ${questionIndex + 1}`;
      }
      return {
        question: questions[questionIndex].question,
        selectedOption: questions[questionIndex].options[answerIndex],
      };
    });
  };

  const handleSubmit = () => {
    const answers = getAnswers();
    console.log("Selected Answers:", selectedAnswers); 
    console.log("Retrieved Answers:", answers); 
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Questions</h1>
        {questions.map((q, questionIndex) => (
  <div key={q.id} className="mb-6">
    <p className="text-lg font-medium mb-4">{`${questionIndex + 1}. ${q.question}`}</p>
    <div className="space-y-2">
      {q.options.map((option, i) => (
        <label key={i} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name={`question-${questionIndex}`} 
            value={i}
            checked={selectedAnswers[questionIndex] === i} 
            onChange={() => handleOptionChange(questionIndex, i)} 
            className="form-radio h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  </div>
))}

        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-black hover:text-white transition duration-200"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default QuestionsPage;
