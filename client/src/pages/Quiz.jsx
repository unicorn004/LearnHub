import { useState, useEffect } from "react";
import axios from "axios";

export default function QuizComponent() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quiz/random/20');
        setQuestions(response.data);
        setAnswers(Array(response.data.length).fill(null));
        setMarkedForReview(Array(response.data.length).fill(false));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle timer logic
  useEffect(() => {
    if (isSubmitted || loading) return;

    const timer = setInterval(() => {
      if (timerSeconds > 0) {
        setTimerSeconds(timerSeconds - 1);
      } else if (timerMinutes > 0) {
        setTimerMinutes(timerMinutes - 1);
        setTimerSeconds(59);
      } else {
        // Time's up - submit quiz automatically
        clearInterval(timer);
        handleSubmitConfirm();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timerMinutes, timerSeconds, isSubmitted, loading]);

  // Navigation functions
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Handle answer selection
  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  // Toggle mark for review
  const toggleMarkForReview = () => {
    const newMarkedForReview = [...markedForReview];
    newMarkedForReview[currentQuestionIndex] = !newMarkedForReview[currentQuestionIndex];
    setMarkedForReview(newMarkedForReview);
  };

  // Submit functions
  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const handleSubmitConfirm = () => {
    // Calculate score
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswerIndex) {
        correct++;
      }
    });
    setScore(correct);
    setIsSubmitted(true);
    setShowSubmitDialog(false);
  };

  // Get status color for question navigator
  const getQuestionStatusColor = (index) => {
    const isAttempted = answers[index] !== null;
    const isMarked = markedForReview[index];

    if (isAttempted && isMarked) return "bg-purple-500"; // Attempted & marked
    if (isAttempted) return "bg-green-500"; // Attempted
    if (isMarked) return "bg-yellow-400"; // Not attempted but marked
    return "bg-gray-300"; // Not attempted
  };

  // Format time for display
  const formatTime = (minutes, seconds) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">No questions available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 h-full max-w-6xl mx-auto">
      {/* Main Question Area */}
      <div className="w-full md:w-3/4 flex flex-col">
        {/* Timer */}
        <div className="flex items-center justify-end mb-2 text-lg font-semibold">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mr-2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className={timerMinutes < 5 ? "text-red-500" : ""}>
            {formatTime(timerMinutes, timerSeconds)}
          </span>
        </div>

        {/* Question Card */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1}</h2>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="review"
                  checked={markedForReview[currentQuestionIndex]}
                  onChange={toggleMarkForReview}
                  className="mr-2 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="review" className="text-sm font-medium">Mark for review</label>
              </div>
            </div>
            <p className="mt-2 text-gray-700">
              {questions[currentQuestionIndex].text}
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    name="options"
                    id={`option-${index}`}
                    checked={answers[currentQuestionIndex] === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`option-${index}`} className="ml-3 block text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t flex justify-between">
            <button
              onClick={goToPrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-md ${currentQuestionIndex === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Previous
            </button>
            <button
              onClick={goToNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`px-4 py-2 rounded-md ${currentQuestionIndex === questions.length - 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar with Question Navigator */}
      <div className="w-full md:w-1/4 mt-4 md:mt-0">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Question Navigator</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`
                    w-full h-10 flex items-center justify-center rounded 
                    ${getQuestionStatusColor(index)} 
                    ${currentQuestionIndex === index ? 'ring-2 ring-offset-2 ring-black' : ''}
                    text-white font-medium
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="text-sm font-medium">Legend:</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-gray-300 mr-2"></div>
                  <span className="text-sm">Not attempted</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
                  <span className="text-sm">Attempted</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-purple-500 mr-2"></div>
                  <span className="text-sm">Attempted & marked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-yellow-400 mr-2"></div>
                  <span className="text-sm">Not attempted & marked</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t">
            <button 
              onClick={handleSubmitClick}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold">Submit Quiz</h3>
              <p className="mt-2 text-gray-600">
                Are you sure you want to submit? You won't be able to change your answers after submission.
                {answers.filter(answer => answer === null).length > 0 && (
                  <p className="text-red-500 mt-2">
                    Warning: You have {answers.filter(answer => answer === null).length} unanswered questions!
                  </p>
                )}
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Screen */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold">
                  You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
                </p>
              </div>
              
              <div className="space-y-6">
                {questions.map((question, index) => {
                  const isCorrect = answers[index] === question.correctAnswerIndex;
                  const selectedAnswer = answers[index] !== null ? question.options[answers[index]] : "Not attempted";
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">Question {index + 1}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="mt-2 font-semibold">{question.text}</p>
                      
                      <div className="mt-3 space-y-2">
                        <div>
                          <span className="font-medium">Your answer:</span> 
                          <span className={`ml-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {selectedAnswer}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div>
                            <span className="font-medium">Correct answer:</span> 
                            <span className="ml-2 text-green-700">
                              {question.options[question.correctAnswerIndex]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Take Another Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}