import React, { useState, useRef } from "react";
import { FaMicrophone, FaRegBookmark, FaBookmark } from "react-icons/fa";

interface SubjectiveQuestionTileProps {
  question: string;
  onAnswerChange: (answer: string) => void;
  explanation: string;
  showBack: boolean;
  onReveal: () => void;
//   resetTimer: boolean;
    bookmarked: boolean;
    addToBookmarks: (question: string, answer: string) => void;
    removeFromBookmarks: (question:string) => void;
}

const SubjectiveQuestionTile: React.FC<SubjectiveQuestionTileProps> = ({
  question,
  onAnswerChange,
  explanation,
  showBack,
  onReveal,
//   resetTimer,
  bookmarked,
  addToBookmarks,
  removeFromBookmarks,
}) => {
  const [answer, setAnswer] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);


  const handleAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = event.target.value;
    setAnswer(newAnswer);
    onAnswerChange(newAnswer);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      setIsRecording(false);
    };
    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  const handleBookmarkClick = () => {
    if (bookmarked) {
      removeFromBookmarks(question);
    } else {
      addToBookmarks(question,explanation);
    }
  };

  return (
    <div className="question-tile-container">
      <div 
        className={`flip-card ${showBack ? "flipped" : ""}`}
      >
        {/* {!showBack && (
          <div className="z-10 timer-bar" style={{ width: "100%" }}></div>
        )} */}
        
        {/* Front Side */}
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xl font-bold text-gray-800 flex-grow">{question}</p>
            </div>
            <textarea
              className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none"
              placeholder="Write your answer here..."
              value={answer}
              onChange={handleAnswerChange}
            />
            <div className="mt-4 flex justify-center">
              {isRecording ? (
                <button
                  className="bg-red-600 text-white p-2 rounded-full"
                  onClick={stopRecording}
                >
                  <FaMicrophone />
                </button>
              ) : (
                <button
                  className="bg-blue-600 text-white p-2 rounded-full"
                  onClick={startRecording}
                >
                  <FaMicrophone />
                </button>
              )}
            </div>
            <button
              className="mt-6 bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border"
              onClick={onReveal}
            >
              Reveal Answer
            </button>
          </div>
    
          {/* Back Side */}
          <div className="flip-card-back">
          {bookmarked ? (
              <FaBookmark 
                onClick={handleBookmarkClick}
                className="text-2xl cursor-pointer transition-transform transform hover:scale-110"  
              />
            ) : (
              <FaRegBookmark 
                onClick={handleBookmarkClick}
                className="text-2xl cursor-pointer transition-transform transform hover:scale-110"  
              />
            )}
            <p className="mb-4">
              <strong className="text-lg">Your Answer:</strong>{" "}
              <span className="text-lg font-bold">{answer || "No answer"}</span>
            </p>
            <p className="mb-4">
              <strong className="text-lg">Explanation:</strong>{" "}
              <span className="text-gray-700 text-lg italic">{explanation}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectiveQuestionTile;