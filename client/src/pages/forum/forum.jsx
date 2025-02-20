import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react';

// Main Application Component
const DiscussionForum = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/forum/posts', {
          headers: {
            'x-auth-token': token
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

// Questions Component
const QuestionsComponent = ({ questions, onSelectQuestion, onUpdateQuestions, loading, error }) => {
  QuestionsComponent.propTypes = {
    questions: PropTypes.array.isRequired,
    onSelectQuestion: PropTypes.func.isRequired,
    onUpdateQuestions: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string
  };

  const [newQuestion, setNewQuestion] = useState('');

  const handleAddQuestion = async () => {
    if (newQuestion.trim()) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("You must be logged in to ask a question.");
        return;
      }

      try {
        // Check for toxic content
        const checkResponse = await fetch('http://localhost:5000/api/forum/check-toxic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({ text: newQuestion })
        });


        if (!checkResponse.ok) {
          throw new Error('Failed to check for toxic content');
        }

        const checkResult = await checkResponse.json();
        if (!checkResult.success) {
          alert("Your question contains toxic words. Please revise it.");
          return;
        }

        // If content is clean, proceed to add question
        const response = await fetch('http://localhost:5000/api/forum/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({
            title: newQuestion,
            content: newQuestion
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error details:', errorData);
          throw new Error('Failed to add question');
        }

        const newQuestionData = await response.json();
        onUpdateQuestions(prev => [...prev, newQuestionData]);
        setNewQuestion("");
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
        {loading ? (
          <div className="text-center py-4">Loading discussions...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">Error: {error}</div>
        ) : questions.length > 0 ? (
          questions.map((q) => (
            <div 
              key={q._id} 
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelectQuestion(q)}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{q.title}</h2>
              <p className="text-gray-600 text-sm">Asked by: {q.user?.name || 'Anonymous'}</p>
              <div className="mt-2 text-sm text-gray-500">
                Answers: {q.comments?.length || 0}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">No discussions found</div>
        )}
      </div>
    </div>
  );
};

// Answers Component
const AnswersComponent = ({ question, onBack, onUpdateQuestions }) => {
  AnswersComponent.propTypes = {
    question: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onUpdateQuestions: PropTypes.func.isRequired
  };

  const [answers, setAnswers] = useState(question.comments || []);
  const [newAnswer, setNewAnswer] = useState('');

  const handleVote = async (answerId, voteType) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/forum/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          postId: question._id,
          commentId: answerId,
          voteType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const updatedPost = await response.json();
      setAnswers(updatedPost.comments);
      onUpdateQuestions(prev => 
        prev.map(q => 
          q._id === question._id 
            ? {...q, comments: updatedPost.comments} 
            : q
        )
      );
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const addNewAnswer = async () => {
    if (newAnswer.trim()) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("You must be logged in to post an answer.");
        return;
      }
      
      try {
        // Check for toxic content
        const checkResponse = await fetch('http://localhost:5000/api/forum/check-toxic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },

          body: JSON.stringify({ text: newAnswer })
        });


        if (!checkResponse.ok) {
          throw new Error('Failed to check for toxic content');
        }

        const checkResult = await checkResponse.json();
        if (!checkResult.success) {
          alert("Your answer contains toxic words. Please revise it.");
          return;
        }

        // Add the answer
        const response = await fetch('http://localhost:5000/api/forum/comment', {

          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({
            postId: question._id,
            content: newAnswer
          })
        });

        if (!response.ok) {
          throw new Error('Failed to add answer');
        }

        const updatedPost = await response.json();
        setAnswers(updatedPost.comments);
        onUpdateQuestions(prev => 
          prev.map(q => 
            q._id === question._id 
              ? {...q, comments: updatedPost.comments} 
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{question.title}</h1>
        <p className="text-gray-600">Asked by: {question.user?.name || 'Anonymous'}</p>
      </div>

      <div className="space-y-4">
        {answers.map((ans) => (
          <div 
            key={ans._id} 
            className="bg-white shadow-md rounded-lg p-4"
          >
            <p className="text-gray-800 mb-2">{ans.content}</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                Answered by: {ans.user?.name || 'Anonymous'}
              </p>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleVote(ans._id, 'upvote')}
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <ThumbsUp size={16} className="mr-1" /> {ans.upvotes}
                </button>
                <button 
                  onClick={() => handleVote(ans._id, 'downvote')}
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
          className="bg-blue-500 text-white px=4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default DiscussionForum;
