import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth'; // Import your Auth component
import ChatApp from './pages/Chats/chat';
import DiscussionForum from './pages/forum/forum';
import MultiStepForm from './pages/matchmaking/form';
import ProfilePage from './pages/Profile';
import EdTechPlatform from './pages/Home';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<EdTechPlatform />} /> {/* Render Home/EdTech platform */}
          <Route path="/auth" element={<Auth />} /> {/* Render Auth page */}
          <Route path="/chat" element={<ChatApp />} /> {/* Render Chat page */}
          <Route path="/forum" element={<DiscussionForum />} /> {/* Render Forum page */}
          <Route path="/match-making-form" element={<MultiStepForm />} /> {/* Render Matchmaking form */}
          <Route path="/profile" element={<ProfilePage />} /> {/* Render Profile page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;