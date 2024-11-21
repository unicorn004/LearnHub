import { useState } from 'react';
import { Lock, Mail, User, LogIn } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your authentication logic here
    console.log(isLogin ? 'Logging in' : 'Registering', { email, password, username });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="flex">
          <button 
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-4 text-lg font-semibold transition-colors duration-300 ${
              isLogin 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-4 text-lg font-semibold transition-colors duration-300 ${
              !isLogin 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Register
          </button>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="p-8 space-y-6"
        >
          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>

          {isLogin && (
            <div className="flex justify-between items-center">
              <label className="flex items-center text-gray-600">
                <input 
                  type="checkbox" 
                  className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <a 
                href="#" 
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <LogIn className="mr-2" />
            {isLogin ? 'Login' : 'Create Account'}
          </button>

          <div className="text-center text-gray-600 mt-4">
            {isLogin 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline ml-1"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;