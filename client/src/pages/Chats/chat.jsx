import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Send } from "lucide-react";
import PropTypes from 'prop-types';
import axios from "axios";
import { getAuthHeader } from "../../api/apiRoutes";
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
  LeftSidebar.propTypes = {
    onRoomSelect: PropTypes.func.isRequired
  };

  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const currentUserId = localStorage.getItem("userid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/chat/getAllRooms", {
          headers: getAuthHeader(),
          params: { userId: currentUserId }
        });
        setRooms(response.data || []);
      } catch (err) {
        console.error("Error fetching rooms", err);
        setRooms([]);
      }
    };

    if (!currentUserId) navigate("/login");
    else fetchRooms();
  }, [currentUserId, navigate]);

  const handleRoomSelect = (room) => {
    console.log("Selected Room:", room);
    onRoomSelect(room);
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat/createRoom",
        { roomName: newRoomName, userId: currentUserId },
        { headers: getAuthHeader() }
      );

      setRooms([...rooms, response.data]);
      setNewRoomName("");
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="w-1/4 bg-gray-100 border-r p-4">
      <h2 className="text-xl font-bold mb-4">Chat Rooms</h2>
      
      <div className="mb-4 flex">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Enter room name"
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={handleCreateRoom}
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors"
        >
          Create
        </button>
      </div>

      <div className="space-y-2">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="flex items-center justify-between p-3 bg-white rounded shadow hover:bg-gray-200 transition-colors"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-800 truncate">{room.name}</div>
            </div>
            <button
              onClick={() => handleRoomSelect(room)}
              className="ml-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


const RightChatArea = ({ selectedRoom }) => {
  RightChatArea.propTypes = {
    selectedRoom: PropTypes.object
  };

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userid");
  const userName = localStorage.getItem("username");

  useEffect(() => {
    if (!userId) navigate("/login");
    if (!selectedRoom) return;

    console.log("Updated selectedRoom:", selectedRoom);
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["polling", "websocket"]
    });
    
    newSocket.on("connect", () => console.log("Socket connected:", newSocket.id));
    newSocket.on("connect_error", (err) => console.error("Socket error:", err));
    setSocket(newSocket);

    newSocket.emit("joinRoom", selectedRoom._id);
    newSocket.on("previousMessages", (messages) => {
      setMessages(messages);
    });
    newSocket.on("serverSendsMsg", (message) => {
      console.log("Received message from server:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => newSocket.disconnect();
  }, [selectedRoom, navigate, userId]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket) {
      console.log("Sending message:", inputMessage, "to room:", selectedRoom._id);
      const messageData = { text: inputMessage, userId, name: userName, roomId: selectedRoom._id };
      socket.emit("serverRcvsMsg", messageData);
      setInputMessage("");
    }
    else{
      console.log("Socket not connected or message empty");
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
      <div className="bg-green-500 text-white p-4 font-bold">
        {selectedRoom.name || "No Room Selected"}
      </div>

      <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 p-3 rounded max-w-md ${
              message.user && message.user._id === userId ? "bg-green-100 ml-auto" : "bg-white mr-auto"
            }`}
          >
            <div className="font-semibold text-sm mb-1">
              {message.user && message.user._id === userId ? "You" : message.user?.name || "Unknown"}
            </div>
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