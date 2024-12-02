import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getQuestions from '../api/getQuestions';
import QuestionTile from "../components/QuestionTile";

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
// type UserAnswer = {
//   questionId: number;
//   selectedAnswer: string | null;
// };

// Mock data with quiz title
const apiResponse: ApiResponse = {
  title: "General Knowledge Quiz",
  questions:[],
  // questions: [
  //   {
  //     id: 1,
  //     question: "What is the capital of France?",
  //     answers: ["Paris", "London", "Berlin", "Rome"],
  //     correctAnswer: "Paris",
  //     explanation: "Paris is the capital city of France, known for its history, culture, and landmarks like the Eiffel Tower."
  //   },
  //   {
  //     id: 2,
  //     question: "Which planet is known as the Red Planet?",
  //     answers: ["Earth", "Mars", "Venus", "Jupiter"],
  //     correctAnswer: "Mars",
  //     explanation: "Mars is called the Red Planet due to its reddish appearance, caused by iron oxide (rust) on its surface."
  //   },
  //   {
  //     id: 3,
  //     question: "What is the chemical symbol for water?",
  //     answers: ["H2O", "O2", "CO2", "H2"],
  //     correctAnswer: "H2O",
  //     explanation: "H2O represents water, consisting of two hydrogen atoms bonded to one oxygen atom."
  //   },
    // {
    //   id: 4,
    //   question: "Who wrote 'Romeo and Juliet'?",
    //   answers: ["William Shakespeare", "Charles Dickens", "J.K. Rowling", "George Orwell"],
    //   correctAnswer: "William Shakespeare",
    //   explanation: "William Shakespeare, an English playwright, authored 'Romeo and Juliet,' a famous romantic tragedy."
    // },
    // {
    //   id: 5,
    //   question: "Which is the smallest prime number?",
    //   answers: ["1", "2", "3", "5"],
    //   correctAnswer: "2",
    //   explanation: "2 is the smallest prime number as it is only divisible by 1 and itself and is also the only even prime number."
    // },
    // {
    //   id: 6,
    //   question: "What is the square root of 64?",
    //   answers: ["6", "7", "8", "9"],
    //   correctAnswer: "8",
    //   explanation: "The square root of 64 is 8 because 8 × 8 = 64."
    // },
    // {
    //   id: 7,
    //   question: "What is the largest mammal?",
    //   answers: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"],
    //   correctAnswer: "Blue Whale",
    //   explanation: "The Blue Whale is the largest mammal, growing up to 100 feet long and weighing over 200 tons."
    // },
    // {
    //   id: 8,
    //   question: "Which gas do plants absorb for photosynthesis?",
    //   answers: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    //   correctAnswer: "Carbon Dioxide",
    //   explanation: "Plants absorb carbon dioxide from the atmosphere to produce oxygen and glucose during photosynthesis."
    // },
    // {
    //   id: 9,
    //   question: "Who painted the Mona Lisa?",
    //   answers: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
    //   correctAnswer: "Leonardo da Vinci",
    //   explanation: "Leonardo da Vinci, an Italian Renaissance artist, painted the Mona Lisa, one of the most famous artworks in the world."
    // },
    // {
    //   id: 10,
    //   question: "What is the value of Pi up to two decimal places?",
    //   answers: ["3.12", "3.14", "3.16", "3.18"],
    //   correctAnswer: "3.14",
    //   explanation: "Pi is an irrational number used to calculate circles' properties, commonly approximated as 3.14."
    // }
  // ]
};

// Mock API Response Example
console.log(JSON.stringify(apiResponse, null, 2));


const QuestionsPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showBack, setShowBack] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions,setQuestions]:[Question[]|null,(questions:Question[]|null)=>void]=useState<Question[]|null>(null);
  const [loading,setLoading]=useState(true);
  const [currentQuestion,setCurrentQuestion]=useState<Question|null>(null);

  const getGeneratedQuestions=async (text:string)=>{
    const questionsText= await getQuestions(text);
    console.log("this is the response",questionsText)
    console.log("trying to get question1")
    // console.log(questionsText?.split("1.")[1].split("?")[0]+"?")
    const parseAnswer = (text: string, prefix: string[],index:number): string | null => {
      for (const p of prefix) {
        if (text.includes(p)) {
          return text.split(p)[index].split("\n")[0];
        }
      }
      return null;
    };

    const parseCorrectAnswer=(text:string,prefix:string[],index:number,answers:string[]):string|null=>{
      for (const p of prefix){
        const correctAnswer=text?.split("Correct Answer:")[index]?.split("\n")[0]?.trim()
        console.log("Correct Answer with option: ", correctAnswer)
        if(correctAnswer.includes(p)){
          const correctOption=p[0].toLowerCase();
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
        if (text.includes(delimiter)) {
          return text.split(delimiter)[1].split("?")[0] + "?";
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
    // const question2:Question={
    //   id:2,
    //   question:questionsText?.split("2.")[1].split("?")[0]+"?",
    //   answers:[`${questionsText?.split("a) ")[2].split(".")[0]+"."}`,`${questionsText?.split("b) ")[1].split(".")[0]+"."}`,`${questionsText?.split("c) ")[1].split(".")[0]+"."}`,`${questionsText?.split("d) ")[1].split(".")[0]+"."}`],
    //   correctAnswer:`${questionsText?.split('Correct Answer:')[2].split('\n')[0]}`,
    //   explanation:`${questionsText?.split('Explanation:')[2].split('\n')}`,
    // }
    // const question3:Question={
    //   id:1,
    //   question:questionsText?.split("3.")[1].split("?")[0]+"?",
    //   answers:[`${questionsText?.split("a) ")[3].split(".")[0]+"."}`,`${questionsText?.split("b) ")[1].split(".")[0]+"."}`,`${questionsText?.split("c) ")[1].split(".")[0]+"."}`,`${questionsText?.split("d) ")[1].split(".")[0]+"."}`],
    //   correctAnswer:`${questionsText?.split('Correct Answer:')[3].split('\n')[0]}`,
    //   explanation:`${questionsText?.split('Explanation:')[3].split('\n')}`,
    // }
    // const question4:Question={
    //   id:1,
    //   question:questionsText?.split("4.")[1].split("?")[0]+"?",
    //   answers:[`${questionsText?.split("a) ")[4].split(".")[0]+"."}`,`${questionsText?.split("b) ")[1].split(".")[0]+"."}`,`${questionsText?.split("c) ")[1].split(".")[0]+"."}`,`${questionsText?.split("d) ")[1].split(".")[0]+"."}`],
    //   correctAnswer:`${questionsText?.split('Correct Answer:')[4].split('\n')[0]}`,
    //   explanation:`${questionsText?.split('Explanation:')[4].split('\n')}`,
    // }
    // const question5:Question={
    //   id:1,
    //   question:questionsText?.split("5.")[1].split("?")[0]+"?",
    //   answers:[`${questionsText?.split("a) ")[5].split(".")[0]+"."}`,`${questionsText?.split("b) ")[1].split(".")[0]+"."}`,`${questionsText?.split("c) ")[1].split(".")[0]+"."}`,`${questionsText?.split("d) ")[1].split(".")[0]+"."}`],
    //   correctAnswer:`${questionsText?.split('Correct Answer:')[5].split('\n')[0]}`,
    //   explanation:`${questionsText?.split('Explanation:')[5].split('\n')}`,
    // }
    // const question6:Question={
    //   id:1,
    //   question:questionsText?.split("6.")[1].split("?")[0]+"?",
    //   answers:[`${questionsText?.split("a) ")[6].split(".")[0]+"."}`,`${questionsText?.split("b) ")[1].split(".")[0]+"."}`,`${questionsText?.split("c) ")[1].split(".")[0]+"."}`,`${questionsText?.split("d) ")[1].split(".")[0]+"."}`],
    //   correctAnswer:`${questionsText?.split('Correct Answer:')[6].split('\n')[0]}`,
    //   explanation:`${questionsText?.split('Explanation:')[6].split('\n')}`,
    // }
    // const question7:Question={
    //   id:1,
    //   question:questionsText?.split("7.")[1].split("?")[0]+"?",
    //   answers:[`${questionsText?.split("a) ")[7].split(".")[0]+"."}`,`${questionsText?.split("b) ")[1].split(".")[0]+"."}`,`${questionsText?.split("c) ")[1].split(".")[0]+"."}`,`${questionsText?.split("d) ")[1].split(".")[0]+"."}`],
    //   correctAnswer:`${questionsText?.split('Correct Answer:')[7].split('\n')[0]}`,
    //   explanation:`${questionsText?.split('Explanation:')[7].split('\n')}`,
    // }
    // const question8:Question={
    //   id:1,
    //   question:questionsText?.split("8.")[1].split("?")[0]+"?",
    //   answers:[`${questionsText?.split("a) ")[8].split(".")[0]+"."}`,`${questionsText?.split("b) ")[1].split(".")[0]+"."}`,`${questionsText?.split("c) ")[1].split(".")[0]+"."}`,`${questionsText?.split("d) ")[1].split(".")[0]+"."}`],
    //   correctAnswer:`${questionsText?.split('Correct Answer:')[8].split('\n')[0]}`,
    //   explanation:`${questionsText?.split('Explanation:')[8].split('\n')}`,
    // }
    // const question9:Question={
    //   id:1,
    //   question:questionsText?.split("9.")[1].split("?")[0]+"?",
    //   answers:[`${questionsText?.split("a) ")[9].split(".")[0]+"."}`,`${questionsText?.split("b) ")[1].split(".")[0]+"."}`,`${questionsText?.split("c) ")[1].split(".")[0]+"."}`,`${questionsText?.split("d) ")[1].split(".")[0]+"."}`],
    //   correctAnswer:`${questionsText?.split('Correct Answer:')[9].split('\n')[0]}`,
    //   explanation:`${questionsText?.split('Explanation:')[9].split('\n')}`,
    // }
    // const question10:Question={
    //   id:1,
    //   question:questionsText?.split("10.")[1].split("?")[0]+"?",
    //   answers:[`${questionsText?.split("a) ")[10].split(".")[0]+"."}`,`${questionsText?.split("b) ")[1].split(".")[0]+"."}`,`${questionsText?.split("c) ")[1].split(".")[0]+"."}`,`${questionsText?.split("d) ")[1].split(".")[0]+"."}`],
    //   correctAnswer:`${questionsText?.split('Correct Answer:')[10].split('\n')[0]}`,
    //   explanation:`${questionsText?.split('Explanation:')[10].split('\n')}`,
    // }
    return [question1,question2,];
  }
  
  useEffect(()=>{
    const fetchQuestions=async ()=>{
      const questionsGenerated= await getGeneratedQuestions(`JavaScript Hoisting is the behavior where the interpreter moves function and variable declarations to the top of their respective scope before executing the code. This allows variables to be accessed before declaration, aiding in more flexible coding practices and avoiding “undefined” errors during execution.

        What is Hoisting in JavaScript?
        Hoisting is the default behavior in JavaScript where variable and function declarations are moved to the top of their respective scopes during the compilation phase. This guarantees that regardless of where these declarations appear within a scope, they can be accessed throughout that scope.
        
        Features of Hoisting
        Declarations are hoisted, not initializations.
        Allows calling functions before their declarations.
        All variable and function declarations are processed before any code execution.
        Undeclared variables are implicitly created as global variables when assigned a value.`)
        console.log('Questions generated are',questionsGenerated)
        setQuestions(questionsGenerated)
        console.log("Questions: ",questions)
        setLoading(false)
        console.log("Loading: ",loading)
    }
    fetchQuestions()
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
            className="mt-6 bg-blue-600 text-lg text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }


  return (
    (loading)?<>Loading.....</>:(questions)?
    <div className="flex flex-col h-auto w-auto px-4 py-4 bg-gray-100">
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
      />)}

      {showBack&&(
        <button
          className="mt-6 bg-blue-600 text-lg text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={handleNext}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
        </button>
      )}
    </div>:<>No questions fetched.....</>
  );
};

export default QuestionsPage;

