import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getQuestions from '../api/getQuestions';
import QuestionTile from "../components/QuestionTile";
// import {gfgExtractor} from '../utils/scraping/final_gfg';

// Define TypeScript types
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
  title: "General Knowledge Quiz",
  questions:[],

};

// Mock API Response Example
console.log(JSON.stringify(apiResponse, null, 2));

const QuestionsPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showBack, setShowBack] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [questions,setQuestions]:[Question[]|null,(questions:Question[]|null)=>void]=useState<Question[]|null>(null);
  const [loading,setLoading]=useState(true);
  const [currentQuestion,setCurrentQuestion]=useState<Question|null>(null);
  const [scrapedData,setScrapedData]=useState<{[heading:string]:string}|null>(null);
  
  const getGeneratedQuestions=async (text:string)=>{
    const questionsText= await getQuestions(text);
    // console.log("this is the response",questionsText)
    console.log("trying to get question1")
    // console.log(questionsText?.split("1.")[1].split("?")[0]+"?")
    const parseAnswer = (text: string, prefix: string[],index:number): string | null => {
      for (const p of prefix) {
        if (text?.includes(p)) {
          return text?.split(p)[index]?.split("\n")[0];
        }
      }
      return null;
    };

    const parseCorrectAnswer=(text:string,prefix:string[],index:number,answers:string[]):string|null=>{
      for (const p of prefix){
        const correctAnswer=text?.split("Correct Answer:")[index]?.split("\n")[0]?.trim()
        console.log("Correct Answer with option: ", correctAnswer)
        if(correctAnswer?.includes(p)){
          const correctOption=p[0]?.toLowerCase();
          console.log("Correct Option: ",correctOption)
          if(correctOption==='a'){
            return answers[0];
          }else if(correctOption==='b'){
            return answers[1];
          }else if(correctOption==='c'){
            return answers[2];
          }else if(correctOption==='d'){
            return answers[3];
          }
          // return correctAnswer.split(p)[1]?.trim();
        }
      }
      return null;
    }
    
    const parseQuestion = (text: string,delimiters:string[]): string => {
      // const delimiters = ["1.", "1:"];
      for (const delimiter of delimiters) {
        if (text?.includes(delimiter)) {
          return text?.split(delimiter)[1]?.split("?")[0] + "?";
        }
      }
      return "Question not found.";
    };
    const question1: Question = {
      id: 1,
      question: parseQuestion(questionsText?questionsText:``,["1.", "1:"]),
      answers: [
        parseAnswer(questionsText?questionsText:``, ["a) ", "a.", "A)"],1) || "Answer A not found.",
        parseAnswer(questionsText?questionsText:``, ["b) ", "b.", "B)"],1) || "Answer B not found.",
        parseAnswer(questionsText?questionsText:``, ["c) ", "c.", "C)"],1) || "Answer C not found.",
        parseAnswer(questionsText?questionsText:``, ["d) ", "d.", "D)"],1) || "Answer D not found.",
      ],
      correctAnswer: parseCorrectAnswer(questionsText?questionsText:``,["a) ", "a.", "A)","b) ", "b.", "B)","c) ", "c.", "C)","d) ", "d.", "D)"],1,[
        parseAnswer(questionsText?questionsText:``, ["a) ", "a.", "A)"],1) || "Answer A not found.",
        parseAnswer(questionsText?questionsText:``, ["b) ", "b.", "B)"],1) || "Answer B not found.",
        parseAnswer(questionsText?questionsText:``, ["c) ", "c.", "C)"],1) || "Answer C not found.",
        parseAnswer(questionsText?questionsText:``, ["d) ", "d.", "D)"],1) || "Answer D not found.",
      ])|| "Correct answer not found.",
      explanation: questionsText?.split("Explanation:")[1]?.split("\n")[0]?.trim() || "Explanation not found.",
    };
    console.log("Question 1: ",question1);
    const question2: Question = {
      id: 2,
      question: parseQuestion(questionsText?questionsText:``,["2.", "2:"]),
      answers: [
        parseAnswer(questionsText?questionsText:``, ["a) ", "a.", "A)"],2) || "Answer A not found.",
        parseAnswer(questionsText?questionsText:``, ["b) ", "b.", "B)"],2) || "Answer B not found.",
        parseAnswer(questionsText?questionsText:``, ["c) ", "c.", "C)"],2) || "Answer C not found.",
        parseAnswer(questionsText?questionsText:``, ["d) ", "d.", "D)"],2) || "Answer D not found.",
      ],
      correctAnswer: parseCorrectAnswer(questionsText?questionsText:``,["a) ", "a.", "A)","b) ", "b.", "B)","c) ", "c.", "C)","d) ", "d.", "D)"],2,[
        parseAnswer(questionsText?questionsText:``, ["a) ", "a.", "A)"],2) || "Answer A not found.",
        parseAnswer(questionsText?questionsText:``, ["b) ", "b.", "B)"],2) || "Answer B not found.",
        parseAnswer(questionsText?questionsText:``, ["c) ", "c.", "C)"],2) || "Answer C not found.",
        parseAnswer(questionsText?questionsText:``, ["d) ", "d.", "D)"],2) || "Answer D not found.",
      ])|| "Correct answer not found.",
      explanation: questionsText?.split("Explanation:")[2]?.split("\n")[0]?.trim() || "Explanation not found.",
    };
    return [question1,question2,];
  }
  
  useEffect(()=>{
    const fetchQuestions=async ()=>{
      console.log("This is the scraped Data: ",scrapedData)
      let questionsGenerated:Question[]|null=null;
      if(scrapedData){
        console.log("getting Questions")
        for (const heading of Object.keys(scrapedData)){
          console.log("This is the heading of my array",heading)
          const content = scrapedData[heading];
          console.log("This is my content",content)
          if (questionsGenerated) {
            const newQuestions = await getGeneratedQuestions(content);
            console.log("This is the question generated in this iteration",newQuestions)
            questionsGenerated.push(...newQuestions);
            console.log("These are the questions generated till now",questionsGenerated)
        }else{
            console.log("This is my first element",content)
            questionsGenerated = await getGeneratedQuestions(content);
            console.log("These are the questions generated till now",questionsGenerated)
        }
        }

      }
        console.log('Questions generated are',questionsGenerated)
        setQuestions(questionsGenerated)
        console.log("Questions: ",questions)
    }
    fetchQuestions()
  },[scrapedData])

  useEffect(()=>{
    if(questions){
      setLoading(false)
      console.log("Loading: ",loading)
    }
  },[questions])
  useEffect(()=>{
    chrome.runtime.sendMessage({type:"GET_DATA"},(response)=>{
      console.log(response)
      setScrapedData(response.data)
    });
  },[])
  useEffect(()=>{
    setCurrentQuestion(questions?questions[currentQuestionIndex]:null);
    console.log("currentQuestion",currentQuestion)
  },[loading,questions,currentQuestionIndex])
  // const questions = apiResponse.questions;

  const handleAnswerSelect = (answer: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const handleReveal = () => {
    setShowBack(true);
  };

  const handleNext = () => {
    setShowBack(false);
    setResetTimer(!resetTimer);
    if(questions){
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizCompleted(true);
      }
    }
  };

  const calculateScore = () => {
    if(questions){
      return selectedAnswers.filter((answer, index) => 
        answer === questions[index].correctAnswer
      ).length;
    }
    return
  };

  if (quizCompleted) {
    const score = calculateScore();
    const totalQuestions = questions?.length;
    const percentageScore = (score&&totalQuestions)?((score / totalQuestions) * 100).toFixed(2):0;

    return (
      (loading)?<>Loading...</>:
      <div className="flex overflow-y-scroll flex-col items-center h-screen bg-gray-100 p-4 custom-scroll">
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
            {(questions)?(questions.map((question, index) => (
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
            ))):<></>
}
          </div>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }


  return (
    (loading)?<>Loading.....</>:(questions&&scrapedData)?
    <div className="flex overflow-y-scroll custom-scroll flex-col h-auto w-auto px-4 py-4 transpDiv" style={{"background":"none"}}>
      {/* <div className="QuesHeadingDiv">
        <h1 className="QuestionsHeading">Questions - {apiResponse.title}</h1>
        <svg onClick={()=>{
          navigate('/');
        }} className="home_pic" xmlns="http://www.w3.org/2000/svg"  viewBox="0,0,256,256" width="48px" height="48px" fill-rule="nonzero"><g fill="#8a2be2" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" ><g transform="scale(5.33333,5.33333)"><path d="M39.5,43h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-9c0,-1.105 -0.895,-2 -2,-2h-4c-1.105,0 -2,0.895 -2,2v9c0,1.381 -1.119,2.5 -2.5,2.5h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-19.087c0,-2.299 1.054,-4.471 2.859,-5.893l14.212,-11.199c0.545,-0.428 1.313,-0.428 1.857,0l14.214,11.199c1.805,1.422 2.858,3.593 2.858,5.891v19.089c0,1.381 -1.119,2.5 -2.5,2.5z"></path></g></g></svg>
      </div> */}
      <>Questions</>
      {(currentQuestion)&&(<QuestionTile
        question={currentQuestion.question}
        answers={currentQuestion.answers}
        selectedAnswer={selectedAnswers[currentQuestionIndex] || null}
        correctAnswer={currentQuestion.correctAnswer}
        explanation={currentQuestion.explanation}
        onAnswerSelect={handleAnswerSelect}
        showBack={showBack}
        onReveal={handleReveal}
        resetTimer={resetTimer}
      />)}

      {showBack&&(
        <button
          className=" bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border my-0"
          onClick={handleNext}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
        </button>
      )}
    </div>:<>No questions fetched.....</>
  );
};

export default QuestionsPage;