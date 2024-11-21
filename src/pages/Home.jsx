import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircle, 
  MessageCircle, 
  BookOpen, 
  LayoutDashboard, 
  LogIn, 
  // Github, 
  // Linkedin, 
  // Twitter 
} from 'lucide-react';

const EdTechPlatform = () => {
  const [activeRoute, setActiveRoute] = useState(null);

  const routes = [
    // { 
    //   id: 'login', 
    //   name: 'Login/Register', 
    //   icon: <LogIn size={48} />,
    //   description: 'Access your personalized learning journey'
    // },
    { 
      id: 'profile', 
      name: 'Profile', 
      icon: <UserCircle size={48} />,
      description: 'Manage your personal learning profile'
    },
    { 
      id: 'community', 
      name: 'Community', 
      icon: <MessageCircle size={48} />,
      description: 'Connect with learners worldwide'
    },
    { 
      id: 'resources', 
      name: 'Resource Sharing', 
      icon: <BookOpen size={48} />,
      description: 'Discover and share study materials'
    },
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={48} />,
      description: 'Track your learning progress'
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
                onClick={() => setActiveRoute(route.id)} // Handle route change
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
            className="bg-white p-6 rounded-lg shadow-md text-center"
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
                <a href={`#${route.id}`} className="text-gray-300 hover:text-white">
                  {route.name}
                </a>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              {/* <Github className="text-gray-300 hover:text-white cursor-pointer" />
              <Linkedin className="text-gray-300 hover:text-white cursor-pointer" />
              <Twitter className="text-gray-300 hover:text-white cursor-pointer" /> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EdTechPlatform;
