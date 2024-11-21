import React, { useState, useEffect } from 'react';
import { Menu, Send } from 'lucide-react';

// Main App Component
const ChatApp = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="flex h-screen">
      <LeftSidebar onRoomSelect={setSelectedRoom} />
      <RightChatArea selectedRoom={selectedRoom} />
    </div>
  );
};

// Left Sidebar Component
const LeftSidebar = ({ onRoomSelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5'];

  const handleRoomSelect = (room) => {
    onRoomSelect(room);
    setIsMenuOpen(false);
  };

  return (
    <div className="w-1/4 bg-gray-100 border-r p-4">
      {/* Room List */}
      <div className="space-y-2">
        {rooms.map((room) => (
          <div 
            key={room} 
            onClick={() => handleRoomSelect(room)}
            className="p-3 bg-white rounded shadow hover:bg-gray-200 cursor-pointer transition-colors"
          >
            {room}
          </div>
        ))}
      </div>
    </div>
  );
};

// Right Chat Area Component
const RightChatArea = ({ selectedRoom }) => {
  const [chatData, setChatData] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Fetch data when a room is selected
  useEffect(() => {
    const fetchChatData = async () => {
      if (selectedRoom) {
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
          const data = await response.json();
          console.log(data);
          // Create a message object from the API data
          const newMessage = {
            id: data.id,
            userId: data.userId,
            text: data.title,
            completed: data.completed
          };
          
          // Update messages with the new message
          setMessages([newMessage]);
          setChatData(data);
        } catch (error) {
          console.error('Error fetching chat data:', error);
        }
      }
    };

    fetchChatData();
  }, [selectedRoom]);

  // Handle message input
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        userId: 'You',
        text: inputMessage,
        completed: false
      };
      
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  if (!selectedRoom) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-50 text-gray-500">
        Please select a room to start chatting
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col">
      {/* Room Header */}
      <div className="bg-green-500 text-white p-4 font-bold">
        {selectedRoom}
      </div>

      {/* Chat Area */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-3 p-3 rounded max-w-md ${
              message.userId === 'You' 
                ? 'bg-green-100 ml-auto' 
                : 'bg-white mr-auto'
            }`}
          >
            <div className="font-semibold text-sm mb-1">
              {message.userId}
            </div>
            <div className="text-gray-800">
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Area */}
      <div className="flex p-4 bg-white border-t">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-grow p-2 border rounded-l mr-2"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage}
          className="bg-green-500 text-white p-2 rounded-r"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatApp;