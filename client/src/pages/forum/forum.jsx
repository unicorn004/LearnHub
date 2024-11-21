import { useState} from 'react';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Simulated initial questions data
const initialQuestions = [
  {
    id: 1,
    question: "What is React?",
    askedBy: "User1",
    answers: [
      {
        id: 1,
        answer: "React is a JavaScript library for building user interfaces.",
        answeredBy: "User2",
        upvotes: 10,
        downvotes: 2
      }
    ]
  }
];

// Main Application Component
const DiscussionForum = () => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home');
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="container px-4 py-8">
        {selectedQuestion ? (
          <AnswersComponent 
            question={selectedQuestion} 
            onBack={() => setSelectedQuestion(null)}
            onUpdateQuestions={setQuestions}
          />
        ) : (
          <QuestionsComponent 
            questions={questions} 
            onSelectQuestion={setSelectedQuestion} 
            onUpdateQuestions={setQuestions}
          />
        )}
      </div>
    </div>
  );
};

// Questions Component
const QuestionsComponent = ({ questions, onSelectQuestion, onUpdateQuestions }) => {
  const [newQuestion, setNewQuestion] = useState('');

  const handleAddQuestion = async () => {
    if (newQuestion.trim()) {
      try {
        // Simulated API call
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          body: JSON.stringify({
            title: newQuestion,
            userId: 1
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        
        const newQuestionData = await response.json();
        
        const questionToAdd = {
          id: newQuestionData.id,
          question: newQuestion,
          askedBy: 'Current User',
          answers: []
        };

        onUpdateQuestions(prev => [...prev, questionToAdd]);
        setNewQuestion('');
      } catch (error) {
        console.error('Error adding question:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Discussion Forum</h1>
      
      {/* Question Input */}
      <div className="bg-white shadow-md rounded-lg p-4 flex">
        <input 
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div 
            key={q.id} 
            className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectQuestion(q)}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{q.question}</h2>
            <p className="text-gray-600 text-sm">Asked by: {q.askedBy}</p>
            <div className="mt-2 text-sm text-gray-500">
              Answers: {q.answers.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Answers Component
const AnswersComponent = ({ question, onBack, onUpdateQuestions }) => {
  const [answers, setAnswers] = useState(question.answers);
  const [newAnswer, setNewAnswer] = useState('');

  const handleVote = async (answerId, voteType) => {
    try {
      // Simulated API call for voting
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${answerId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          voteType: voteType
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      const updatedAnswers = answers.map(ans => {
        if (ans.id === answerId) {
          return {
            ...ans,
            upvotes: voteType === 'up' ? ans.upvotes + 1 : ans.upvotes,
            downvotes: voteType === 'down' ? ans.downvotes + 1 : ans.downvotes
          };
        }
        return ans;
      });
      
      setAnswers(updatedAnswers);
      
      // Update the parent component's state
      onUpdateQuestions(prev => 
        prev.map(q => 
          q.id === question.id 
            ? {...q, answers: updatedAnswers} 
            : q
        )
      );
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const addNewAnswer = async () => {
    if (newAnswer.trim()) {
      try {
        // Simulated API call
        const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
          method: 'POST',
          body: JSON.stringify({
            body: newAnswer,
            name: 'Current User'
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        
        const newAnswerData = await response.json();
        
        const newAnswerObj = {
          id: newAnswerData.id,
          answer: newAnswer,
          answeredBy: 'Current User',
          upvotes: 0,
          downvotes: 0
        };

        const updatedAnswers = [...answers, newAnswerObj];
        setAnswers(updatedAnswers);
        
        // Update the parent component's state
        onUpdateQuestions(prev => 
          prev.map(q => 
            q.id === question.id 
              ? {...q, answers: updatedAnswers} 
              : q
          )
        );
        
        setNewAnswer('');
      } catch (error) {
        console.error('Error adding answer:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack} 
        className="mb-4 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
      >
        Back to Questions
      </button>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{question.question}</h1>
        <p className="text-gray-600">Asked by: {question.askedBy}</p>
      </div>

      <div className="space-y-4">
        {answers.map((ans) => (
          <div 
            key={ans.id} 
            className="bg-white shadow-md rounded-lg p-4"
          >
            <p className="text-gray-800 mb-2">{ans.answer}</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                Answered by: {ans.answeredBy}
              </p>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleVote(ans.id, 'up')}
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <ThumbsUp size={16} className="mr-1" /> {ans.upvotes}
                </button>
                <button 
                  onClick={() => handleVote(ans.id, 'down')}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <ThumbsDown size={16} className="mr-1" /> {ans.downvotes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your answer..."
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <button 
          onClick={addNewAnswer}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default DiscussionForum;