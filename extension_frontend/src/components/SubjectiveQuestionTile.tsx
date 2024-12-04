import React, { useState, useEffect } from "react";
import { FaMicrophone, FaRegBookmark, FaBookmark ,FaMicrophoneSlash } from "react-icons/fa";
import "../styles/LanguageDropdown.css"
import translate from "../api/translate";

interface SubjectiveQuestionTileProps {
    isCorrect:boolean,
    question: string;
    onAnswerChange: (answer: string) => void;
    explanation: string;
    showBack: boolean;
    onReveal: (question:string,submittedAns:string) => void;
    bookmarked: boolean;
    addToBookmarks: (question: string, answer: string) => void;
    removeFromBookmarks: (question:string) => void;
    currentAnswer: string; // New prop to control the textarea value
    submitAns:(s:string)=>void;
}

const SubjectiveQuestionTile: React.FC<SubjectiveQuestionTileProps> = ({
   isCorrect,
    question,
    onAnswerChange,
    explanation,
    showBack,
    onReveal,
    bookmarked,
    addToBookmarks,
    removeFromBookmarks,
    currentAnswer, // New prop
    submitAns
}) => {
  const [answer, setAnswer] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingError, ] = useState<string | null>(null);
  const [audio,setAudio]=useState<Blob|null>(null);
  // const mediaRecorder = useRef<MediaRecorder | null>(null);
  // const audioChunks = useRef<Blob[]>([]);
  // const audioStream = useRef<MediaStream | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [explanationTranslated,setExplanationTranslated]=useState<string>(explanation);

  // Update local state when currentAnswer prop changes
  useEffect(() => {
    setAnswer(currentAnswer);
  }, [currentAnswer, question]); // Reset when question changes

  useEffect(()=>{
    chrome.runtime.sendMessage({type:"GET_AUDIO"},(response)=>{
      console.log("Response of get audio",response)
      const arrayBuffer = new Uint8Array(response.data).buffer;
      const audioBlob = new Blob([arrayBuffer], { type: "audio/webm" });
      setAudio(audioBlob)
    });
  },[isRecording])

  useEffect(()=>{
    console.log("Recieved audio: ",audio)
  },[audio])

  const handleAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = event.target.value;
    setAnswer(newAnswer);
    onAnswerChange(newAnswer);
  };

  const startRecording = async () => {
    setIsRecording(true);
    chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
      if(tabs[0]){
        chrome.tabs.sendMessage(
          tabs[0].id?tabs[0].id:0,
          {type:"START_RECORDING"}
        )
      }
    })
    // try {
    //   // Check if browser supports audio recording
    //   if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    //     setRecordingError("Audio recording is not supported in this browser.");
    //     return;
    //   }

    //   // Request audio permissions
    //   audioStream.current = await navigator.mediaDevices.getUserMedia({ 
    //     audio: true
    //   });

    //   // Create media recorder
    //   mediaRecorder.current = new MediaRecorder(audioStream.current);
      
    //   // Reset audio chunks
    //   audioChunks.current = [];

    //   // Setup event listeners
    //   mediaRecorder.current.ondataavailable = (event) => {
    //     audioChunks.current.push(event.data);
    //   };

    //   mediaRecorder.current.onstop = () => {
    //     // Stop all tracks to release the microphone
    //     if (audioStream.current) {
    //       audioStream.current.getTracks().forEach(track => track.stop());
    //     }

    //     // Create and play audio
    //     if (audioChunks.current.length > 0) {
    //       const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
    //       const audioUrl = URL.createObjectURL(audioBlob);
    //       const audio = new Audio(audioUrl);
    //       audio.play();
    //     }

    //     setIsRecording(false);
    //   };

    //   // Start recording
    //   mediaRecorder.current.start();
    //   setIsRecording(true);
    //   setRecordingError(null);

    // } catch (error) {
    //   console.error("Error starting audio recording:", error);
      
    //   // Specific error messages
    //   if (error instanceof DOMException) {
    //     switch (error.name) {
    //       case 'NotAllowedError':
    //         setRecordingError("Microphone access denied. Please check your browser settings.");
    //         break;
    //       case 'NotFoundError':
    //         setRecordingError("No microphone found. Please connect a microphone.");
    //         break;
    //       default:
    //         setRecordingError("Failed to access microphone. Please check your permissions.");
    //     }
    //   } else {
    //     setRecordingError("An unexpected error occurred during recording.");
    //   }
      
    //   setIsRecording(false);
    // }
  };

  const stopRecording = () => {
    chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
      if(tabs[0]){
        chrome.tabs.sendMessage(
          tabs[0].id?tabs[0].id:0,
          {type:"STOP_RECORDING"}
        )
      }
    })
    setIsRecording(false);
    // try {
    //   if (mediaRecorder.current && isRecording) {
    //     mediaRecorder.current.stop();
    //   }
    // } catch (error) {
    //   console.error("Error stopping recording:", error);
    //   setRecordingError("Failed to stop recording.");
    // }
  };

  const handleBookmarkClick = () => {
    if (bookmarked) {
      removeFromBookmarks(question);
    } else {
      addToBookmarks(question,explanation);
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  const translateExplanation = async () => {
    if(selectedLanguage==='en'){
      setExplanationTranslated(explanation)
      console.log(explanationTranslated)
    }else{
      const tranlatedResponse=await translate(explanation,selectedLanguage);
      console.log(tranlatedResponse)
      setExplanationTranslated(tranlatedResponse?tranlatedResponse:explanationTranslated)
      console.log(`Translating to ${selectedLanguage}`);
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
            {recordingError && (
          <div className="text-red-500 mb-2 text-sm text-center">
            {recordingError}
          </div>
        )}
              {isRecording ? (
                <button
                  className="bg-red-600 text-white p-2 rounded-full"
                  onClick={stopRecording}
                >
                  <FaMicrophoneSlash  className="bg-[blueviolet] p-2 rounded-full text-4xl cursor-pointer transition-transform transform hover:scale-110" />

                </button>
              ) : (
                <button
                  className=" text-white p-2 rounded-full"
                  onClick={startRecording}
                >
                  <FaMicrophone className="bg-[blueviolet] p-2 rounded-full text-4xl cursor-pointer transition-transform transform hover:scale-110" />
                </button>
              )}
            </div>
            <button
              className="mt-6 bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border"
              onClick={()=>{
                submitAns(answer);
                onReveal(question,answer);
                

              }}
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
            <div className="scrollable">
            <p>
            <strong className="text-lg"> {isCorrect?"Correct":"Wrong"}</strong>

            </p>
            <p className="mb-4">
              <strong className="text-lg">Your Answer:</strong>{" "}
              <span className="text-lg font-bold">{answer || "No answer"}</span>
            </p>
            
            <p className="mb-4">
              <strong className="text-lg">Explanation:</strong>{" "}
              <span className="text-gray-700 text-lg italic">{explanationTranslated}</span>
            </p>
            <div className="flex space-between mt-1 items-center">
                            <button
                                className=" bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border"
                                onClick={translateExplanation}
                            >
                                Translate
                            </button>
                            <div className="dropdown-container">
                                <select className="dropdown-select" onChange={handleLanguageChange} value={selectedLanguage}>
                                    <option value="en">English (en)</option>
                                    <option value="ja">Japanese (ja)</option>
                                    <option value="es">Spanish (es)</option>
                                </select>
                            </div>
                            </div>         
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectiveQuestionTile;