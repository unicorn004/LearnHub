import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth'; // Import your Auth component
import ChatApp from './pages/Chats/chat';
import DiscussionForum from './pages/forum/forum';
import MultiStepForm from './pages/matchmaking/form';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Auth />} /> {/* Render Auth page */}
          <Route path="/chat" element={<ChatApp />} /> {/* Render Chat page */}
          {/* You can add more routes here for different pages */}
          <Route path="/forum" element={<DiscussionForum />} />
          <Route path="/match-making-form" element={<MultiStepForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;