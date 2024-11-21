import { motion } from 'framer-motion';
import { 
  UserCircle, 
  MessageCircle, 
  BookOpen, 
  LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EdTechPlatform = () => {
  const navigate = useNavigate();

  const routes = [
    { 
      id: 'profile', 
      name: 'Profile', 
      icon: <UserCircle size={48} />,
      description: 'Manage your personal learning profile',
      action: () => navigate('/profile') // Navigate to /profile
    },
    { 
      id: 'community', 
      name: 'Discussion Forum', 
      icon: <MessageCircle size={48} />,
      description: 'Connect with learners worldwide',
      action: () => navigate('/forum') // Navigate to /forum
    },
    { 
      id: 'resources', 
      name: 'Resource Sharing', 
      icon: <BookOpen size={48} />,
      description: 'Discover and share study materials',
      action: () => navigate('/resource-sharing') // Navigate to /resource-sharing
    },
    { 
      id: 'dashboard', 
      name: 'Room', 
      icon: <LayoutDashboard size={48} />,
      description: 'Talk with your friends and excel',
      action: () => navigate('/chat') // Navigate to /chat
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">LearnHub</div>
          <div className="flex space-x-4">
            {routes.map(route => (
              <motion.button
                key={route.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={route.action}
              >
                {route.icon}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-16 container mx-auto px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-gray-800 mb-6"
        >
          Empower Your Learning Journey
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Discover, Learn, and Grow with Our Comprehensive Educational Platform
        </motion.p>
      </header>

      {/* Route Cards */}
      <section className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
        {routes.map(route => (
          <motion.div
            key={route.id}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)"
            }}
            className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer"
            onClick={route.action}
          >
            <div className="text-blue-600 mb-4 flex justify-center">
              {route.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{route.name}</h3>
            <p className="text-gray-600">{route.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">LearnHub</h4>
            <p className="text-gray-400">Transforming education through technology and community.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            {routes.map(route => (
              <div key={route.id} className="mb-2">
                <button 
                  className="text-gray-300 hover:text-white"
                  onClick={route.action}
                >
                  {route.name}
                </button>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              {/* Add social media icons here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EdTechPlatform;