import React, { useState, useEffect, useRef } from 'react';
import apiRoutes from '../api/apiRoutes';

const AIChat = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState('chat');
  const messagesEndRef = useRef(null);

  // Load the initial greeting message when the component mounts
  useEffect(() => {
    const fetchGreeting = async () => {
      setLoading(true);
      try {
        const greetingMessage = await apiRoutes.askAI('');
        setMessages([
          { sender: 'bot', content: greetingMessage.answer || 'Hello! How can I help you today?' }
        ]);
      } catch (error) {
        console.error('Error fetching greeting:', error);
        setMessages([
          { sender: 'bot', content: 'Hello! How can I help you today?' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGreeting();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const userMessage = question;
    setQuestion('');
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', content: userMessage }
    ]);
    
    setLoading(true);
    try {
      const response = await apiRoutes.askAI(userMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', content: response.answer || 'I\'m not sure how to respond to that.' }
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', content: 'Sorry, I encountered an error processing your request.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'chat', label: 'Chat' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Elisa AI</h1>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`w-full text-left p-2 rounded ${
                  activeMenu === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
                onClick={() => setActiveMenu(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 p-4 border-t border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Recent Conversations</h2>
          <div className="space-y-2">
            <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">Study Plan</div>
            <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">Research Questions</div>
            <div className="p-2 hover:bg-gray-700 rounded cursor-pointer">Exam Prep</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 shadow">
          <h2 className="text-xl font-semibold">Ask Elisa</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white mr-2'
                    : 'bg-gray-200 text-gray-800 ml-2'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 p-3 rounded-lg ml-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t">
          <form onSubmit={handleAskAI} className="flex space-x-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your study-related question"
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Thinking...' : 'Ask Elisa'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;