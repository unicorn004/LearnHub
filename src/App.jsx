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
          {/* <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Welcome to EdTech App
          </h1> */}
          <Routes>
            <Route path="/" element={<EdTechPlatform/>} /> {/* Render Auth page */}
            <Route path="/chat" element={<ChatApp/>} /> {/* Render Auth page */}
            {/* You can add more routes here for different pages */}
            <Route path="/forum" element={<DiscussionForum/>} />
            <Route path="/match-making-form" element={<MultiStepForm/>} />
            <Route path="/match-making-form" element={<MultiStepForm/>} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/auth" element={<Auth/>} />



          </Routes>
        </div>
      
    </Router>
  );
}

export default App;