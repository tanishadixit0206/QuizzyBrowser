
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubjectiveQuestionTile from "../components/SubjectiveQuestionTile";
import "../styles/Questions.css";

type Question = {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: string;
  explanation: string;
};

type ApiResponse = {
  title: string;
  questions: Question[];
};

// Mock data with quiz title
const apiResponse: ApiResponse = {
  title: "Subjective Interview Questions",
  questions: [
    {
      id: 1,
      question: "Explain the concept of closures in JavaScript.",
      answers: [],
      correctAnswer: "",
      explanation: "Closures are functions that refer to independent (free) variables. In other words, the function defined in the closure 'remembers' the environment in which it was created."
    },
    {
      id: 2,
      question: "What is the difference between SQL and NoSQL databases?",
      answers: [],
      correctAnswer: "",
      explanation: "SQL databases are relational and use structured query language for defining and manipulating data, while NoSQL databases are non-relational and provide a mechanism for storage and retrieval of data that is modeled in means other than the tabular relations used in SQL."
    },
    // Add more subjective questions here
  ]
};

const SubjectiveQuestionsPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showBack, setShowBack] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
//   const [resetTimer, setResetTimer] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  const questions = apiResponse.questions;

  const handleAnswerChange = (answer: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const handleReveal = () => {
    setShowBack(true);
  };

  const handleNext = () => {
    setShowBack(false);
    // setResetTimer(true); // Reset the timer for the next question
    setBookmarked(false); // Reset the bookmarked state for the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
    // setResetTimer(false); // Set resetTimer to false after resetting the timer
  };

  const calculateScore = () => {
    return selectedAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
  };
  const addToBookmarks = (question:string,answer:string) => {

    chrome.storage.local.get(["saved_questions"]).then((result)=>{
    const current_saved:{[key:string]:string|number}[]=result["saved_questions"]||[];
    if(!Array.isArray(current_saved)){
      console.error("why");
      return;
    }
    current_saved.push({
      'id':current_saved.length+1,
      'question':question,
      'answer':answer});
    chrome.storage.local.set({"saved_questions":current_saved}).then(()=>{
      console.log("saved it my maan");
    })
    
  })
  setBookmarked(true);
  console.log("Add to Bookmarks");
}
  
const removeFromBookmarks = (question: string) => {
  chrome.storage.local.get(["saved_questions"]).then((result) => {
    const current_saved: {[key:string]:string|number}[] = result["saved_questions"] || [];
    
    if (!Array.isArray(current_saved)) {
      console.error("Saved questions is not an array");
      return;
    }
    
    // Filter out the item with the matching question
    const updated_saved = current_saved.filter(item => item['question'] !== question);
    
    // Reindex the remaining items to ensure consecutive IDs
    const reindexed_saved = updated_saved.map((item, index) => ({
      ...item,
      'id': index + 1
    }));
    
    // Save the updated and reindexed array back to storage
    chrome.storage.local.set({"saved_questions": reindexed_saved}).then(() => {
      console.log(`Question removed successfully`);
      setBookmarked(false);
    }).catch((error) => {
      console.error("Error saving updated bookmarks:", error);
    });
  }).catch((error) => {
    console.error("Error retrieving bookmarks:", error);
  });
}

  if (quizCompleted) {
    const score = calculateScore();
    const totalQuestions = questions.length;
    const percentageScore = ((score / totalQuestions) * 100).toFixed(2);

    return (
      <div className="flex flex-col items-center h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-blue-600">Quiz Completed!</h1>
          <div className="mb-6">
            <p className="text-xl mb-2">Your Score:</p>
            <div className="text-4xl font-bold text-green-600">
              {score} / {totalQuestions}
            </div>
            <p className="text-lg mt-2 text-gray-700">
              {percentageScore}%
            </p>
          </div>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`p-3 rounded-lg ${
                  selectedAnswers[index] === question.correctAnswer 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}
              >
                <p className="font-semibold mb-1">{question.question}</p>
                <p className="text-sm">
                  Your Answer: <span className={
                    selectedAnswers[index] === question.correctAnswer 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }>
                    {selectedAnswers[index] || 'No answer'}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Correct Answer: {question.correctAnswer}
                </p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border my-0"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-auto w-auto px-4 py-4 bg-gray-100">
      <div className="QuesHeadingDiv">
        <h1 className="QuestionsHeading">Questions - {apiResponse.title}</h1>
        <svg onClick={()=>{
          navigate('/');
        }} className="home_pic" xmlns="http://www.w3.org/2000/svg"  viewBox="0,0,256,256" width="48px" height="48px" fill-rule="nonzero"><g fill="#8a2be2" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" ><g transform="scale(5.33333,5.33333)"><path d="M39.5,43h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-9c0,-1.105 -0.895,-2 -2,-2h-4c-1.105,0 -2,0.895 -2,2v9c0,1.381 -1.119,2.5 -2.5,2.5h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-19.087c0,-2.299 1.054,-4.471 2.859,-5.893l14.212,-11.199c0.545,-0.428 1.313,-0.428 1.857,0l14.214,11.199c1.805,1.422 2.858,3.593 2.858,5.891v19.089c0,1.381 -1.119,2.5 -2.5,2.5z"></path></g></g></svg>
      </div>
      <SubjectiveQuestionTile
        question={currentQuestion.question}
        onAnswerChange={handleAnswerChange}
        explanation={currentQuestion.explanation}
        showBack={showBack}
        onReveal={handleReveal}
        // resetTimer={resetTimer}
        bookmarked={bookmarked}
        addToBookmarks={addToBookmarks}
        removeFromBookmarks={removeFromBookmarks}
      />
      {showBack && (
        <button
          className="mt-6 bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border my-0"
          onClick={handleNext}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
        </button>
      )}
    </div>
  );
};

export default SubjectiveQuestionsPage;