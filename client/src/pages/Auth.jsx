import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { Lock, Mail, User, LogIn, FileText, Bookmark, Layers, List } from "lucide-react";
import apiRoutes from "../api/apiRoutes"; // Import API routes

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [topicsOfInterest, setTopicsOfInterest] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [coursework, setCoursework] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login API call
        const response = await apiRoutes.loginUser({ email, password });
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userid" , response.data.user._id);
        localStorage.setItem("username" , response.data.user.name);
        setMessage("Logged in successfully!");
        navigate("/home"); // Redirect to /home after successful login
      } else {
        // Register API call
        const data = {
          name: username,
          email,
          password,
          bio,
          topicsOfInterest: topicsOfInterest.split(","),
          syllabus: syllabus.split(","),
          coursework: coursework.split(","),
        };
        await apiRoutes.registerUser(data);
        setMessage("Registered successfully! Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="flex">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-4 text-lg font-semibold transition-colors duration-300 ${
              isLogin ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-4 text-lg font-semibold transition-colors duration-300 ${
              !isLogin ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {!isLogin && (
            <>
              {/* Registration form fields */}
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
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Additional registration fields */}
            </>
          )}

          {/* Login/Registration common fields */}
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <LogIn className="mr-2" />
            {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
          </button>

          {message && (
            <div className="text-center text-gray-600 mt-4">
              <p className={`text-${message.includes("successfully") ? "green" : "red"}-500`}>
                {message}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;