import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Menu, Send } from "lucide-react";
import axios from "axios";
// import { USER_ID, USER_NAME } from "../constant";
import { useNavigate } from "react-router-dom";

const ChatApp = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="flex h-screen">
      <LeftSidebar onRoomSelect={setSelectedRoom} />
      <RightChatArea selectedRoom={selectedRoom} />
    </div>
  );
};

const LeftSidebar = ({ onRoomSelect }) => {
  const [rooms, setRooms] = useState([]);
  const currentUserId = localStorage.getItem("userid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/chat/getAllRooms", { userId: currentUserId });
        console.log(response);
        setRooms(response.data.chats);
      } catch (err) {
        console.error("Error fetching rooms", err);
      }
    };

    if (!currentUserId) navigate("/login");
    else fetchRooms();
  }, [currentUserId, navigate]);

  const handleRoomSelect = (room) => {
    onRoomSelect(room);
  };

  return (
    <div className="w-1/4 bg-gray-100 border-r p-4">
      <h2 className="text-xl font-bold mb-4">Chat Rooms</h2>
      <div className="space-y-2">
        {rooms.map((room) => (
          <div
            key={room.roomName}
            onClick={() => handleRoomSelect(room.roomName)}
            className="p-3 bg-white rounded shadow hover:bg-gray-200 cursor-pointer transition-colors"
          >
            {room.roomName}
          </div>
        ))}
      </div>
    </div>
  );
};

const RightChatArea = ({ selectedRoom }) => {
  const [socket, setSocket] = useState(null);
  const [prevMessages, setPrevMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userid");
  const userName = localStorage.getItem("username");

  useEffect(() => {
    if (!userId) navigate("/login");

    const fetchPreviousMessages = async () => {
      if (selectedRoom) {
        try {
          const response = await axios.get(`http://localhost:5000/api/chat/${selectedRoom}`);
          setPrevMessages(response.data.messages);
        } catch (err) {
          console.error("Error fetching previous messages", err);
        }
      }
    };

    fetchPreviousMessages();

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    const joinRoom = () => {
      newSocket.emit("joinRoom", selectedRoom);
      newSocket.on("serverSendsMsg", (message) => {
        setNewMessages((prev) => [...prev, message]);
      });
    };

    joinRoom();

    return () => {
      newSocket.disconnect();
    };
  }, [selectedRoom, navigate, userId]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket) {
      const messageData = {
        text: inputMessage,
        userId,
        name: userName,
      };
      socket.emit("serverRcvsMsg", messageData);
      setInputMessage("");
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
      <div className="bg-green-500 text-white p-4 font-bold">{selectedRoom}</div>

      <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
        {prevMessages.map((message, index) => {
          const user = message.user && message.user[0];
          return (
            <div
              key={index}
              className={`mb-3 p-3 rounded max-w-md ${
                user?._id?.toString() === userId ? "bg-green-100 ml-auto" : "bg-white mr-auto"
              }`}
            >
              <div className="font-semibold text-sm mb-1">
                {user?.name}
              </div>
              <div className="text-gray-800">{message.text}</div>
            </div>
          );
        })}

        {newMessages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 p-3 rounded max-w-md ${
              message.userId === userId ? "bg-green-100 ml-auto" : "bg-white mr-auto"
            }`}
          >
            <div className="font-semibold text-sm mb-1">{message.name || "You"}</div>
            <div className="text-gray-800">{message.text}</div>
          </div>
        ))}
      </div>

      <div className="flex p-4 bg-white border-t">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-grow p-2 border rounded-l mr-2"
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className="bg-green-500 text-white p-2 rounded-r">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
