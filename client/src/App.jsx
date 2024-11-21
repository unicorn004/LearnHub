import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth'; 
import ChatApp from './pages/Chats/chat';
import DiscussionForum from './pages/forum/forum';
import MultiStepForm from './pages/matchmaking/form';
import ProfilePage from './pages/Profile';
import EdTechPlatform from './pages/Home';
import ResourceSharingPage from './pages/Resource';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<EdTechPlatform />} />
          <Route path="/chat" element={<ChatApp />} />
          <Route path="/forum" element={<DiscussionForum />} />
          <Route path="/match-making-form" element={<MultiStepForm />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* Correct route for Profile */}
          <Route path="/resource-sharing" element={<ResourceSharingPage />} /> {/* Correct route for Resource Sharing */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;