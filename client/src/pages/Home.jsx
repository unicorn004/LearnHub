import { motion } from 'framer-motion';
import { 
  UserCircle, 
  MessageCircle, 
  BookOpen, 
  LayoutDashboard,
  LogOut,
  BrainCircuit,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const EdTechPlatform = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    navigate('/');
  };

  const routes = [
    { 
      id: 'profile', 
      name: 'Profile', 
      icon: <UserCircle className="w-6 h-6" />,
      description: 'Customize your learning experience',
      action: () => navigate('/profile'),
      color: 'from-purple-500 to-indigo-600'
    },
    { 
      id: 'community', 
      name: 'Forum', 
      icon: <MessageCircle className="w-6 h-6" />,
      description: 'Connect with global learners',
      action: () => navigate('/forum'),
      color: 'from-cyan-500 to-blue-600'
    },
    { 
      id: 'resources', 
      name: 'Resources', 
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Access study materials',
      action: () => navigate('/resource-sharing'),
      color: 'from-emerald-500 to-green-600'
    },
    { 
      id: 'dashboard', 
      name: 'Room', 
      icon: <LayoutDashboard className="w-6 h-6" />,
      description: 'Collaborate with peers',
      action: () => navigate('/chat'),
      color: 'from-amber-500 to-orange-600'
    },
    { 
      id: 'quiz', 
      name: 'Quiz', 
      icon: <BrainCircuit className="w-6 h-6" />,
      description: 'Test your knowledge',
      action: () => navigate('/quiz'),
      color: 'from-rose-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute top-2/3 left-1/3 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-15"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Sparkles className="text-cyan-400 mr-2 w-8 h-8" />
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">NeoLearn</div>
            </motion.div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {routes.map(route => (
                <motion.button
                  key={route.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center"
                  onClick={route.action}
                >
                  <span className={`mr-2 bg-gradient-to-r ${route.color} p-1.5 rounded-full flex items-center justify-center`}>
                    {route.icon}
                  </span>
                  {route.name}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white font-medium hover:opacity-90 transition-opacity flex items-center"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5 mr-1" />
                Sign Out
              </motion.button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4 space-y-2"
            >
              {routes.map(route => (
                <motion.button
                  key={route.id}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full text-left px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex items-center"
                  onClick={() => {
                    route.action();
                    setIsMenuOpen(false);
                  }}
                >
                  <span className={`mr-3 bg-gradient-to-r ${route.color} p-2 rounded-full`}>
                    {route.icon}
                  </span>
                  {route.name}
                </motion.button>
              ))}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="block w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-700 font-medium hover:opacity-90 transition-opacity flex items-center"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </motion.button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-16 container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            Accelerate Your Learning Journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Discover the future of education with AI-powered learning paths, adaptive quizzes, and immersive collaboration
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20">
              Explore Features
            </button>
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full font-medium transition-colors border border-gray-600">
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </header>

      {/* Feature Cards */}
      <section className="container mx-auto px-4 pb-16 z-10 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              className="backdrop-blur-sm bg-gray-800/40 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all cursor-pointer group"
              onClick={route.action}
            >
              <div className={`h-2 bg-gradient-to-r ${route.color}`}></div>
              <div className="p-6">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${route.color} mb-4 group-hover:scale-110 transition-transform`}>
                  {route.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">{route.name}</h3>
                <p className="text-gray-400">{route.description}</p>
                <div className="mt-6 flex justify-end">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="text-cyan-400 flex items-center text-sm font-medium"
                  >
                    Access now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="backdrop-blur-sm bg-gray-800/30 border border-gray-700 rounded-2xl p-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold text-cyan-400 mb-2">10K+</div>
              <div className="text-gray-400">Active Learners</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-400">Expert Courses</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-gray-400">Satisfaction Rate</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-emerald-400 mb-2">24/7</div>
              <div className="text-gray-400">Learning Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 backdrop-blur-sm bg-gray-900/80 py-12 mt-16 relative z-10">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="text-cyan-400 mr-2 w-6 h-6" />
              <h4 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">NeoLearn</h4>
            </div>
            <p className="text-gray-400 mb-4">Transforming the future of education through advanced technology and global community.</p>
            <div className="flex space-x-4">
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
              </button>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </button>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {routes.map(route => (
                <li key={route.id}>
                  <button 
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                    onClick={route.action}
                  >
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    {route.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  Contact Support
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  Community Guidelines
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} NeoLearn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default EdTechPlatform;