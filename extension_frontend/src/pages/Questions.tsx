import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
      
      <div className="w-full max-w-2xl bg-white opacity-35 p-6 rounded-lg shadow-lg">
        <div className="flex w-full space-between">
        <h1 className="text-2xl font-bold mb-6 text-center">Questions</h1>
        <svg onClick={()=>{
          navigate('/');
        }} className="home_pic" xmlns="http://www.w3.org/2000/svg"  viewBox="0,0,256,256" width="48px" height="48px" fill-rule="nonzero"><g fill="#8a2be2" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" ><g transform="scale(5.33333,5.33333)"><path d="M39.5,43h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-9c0,-1.105 -0.895,-2 -2,-2h-4c-1.105,0 -2,0.895 -2,2v9c0,1.381 -1.119,2.5 -2.5,2.5h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-19.087c0,-2.299 1.054,-4.471 2.859,-5.893l14.212,-11.199c0.545,-0.428 1.313,-0.428 1.857,0l14.214,11.199c1.805,1.422 2.858,3.593 2.858,5.891v19.089c0,1.381 -1.119,2.5 -2.5,2.5z"></path></g></g></svg>
        </div>
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
