import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Lock, 
  Mail, 
  User, 
  LogIn, 
  FileText, 
  Bookmark, 
  Layers, 
  List, 
  Camera,
  Sparkles,
  ChevronRight,
  Fingerprint,
  Users,
  Loader2
} from "lucide-react";
import apiRoutes from "../api/apiRoutes";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [role, setRole] = useState("student");
  const [topicsOfInterest, setTopicsOfInterest] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [coursework, setCoursework] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await apiRoutes.uploadResource(formData);
      return response.data.url;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw new Error("Error uploading profile picture.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      let profilePictureUrl = "";
      if (profilePicture) {
        const pictureResponse = await uploadProfilePicture(profilePicture);
        profilePictureUrl = pictureResponse;
      }

      if (isLogin) {
        const response = await apiRoutes.loginUser({ email, password });
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userid", response.data.user._id);
        localStorage.setItem("username", response.data.user.name);
        setMessage("Logged in successfully!");
        navigate("/home");
      } else {
        const data = {
          name: username,
          email,
          password,
          bio,
          profilePicture: profilePictureUrl,
          role,
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
      setMessage(error.response?.data?.msg || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute top-2/3 left-1/3 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-15"></div>
      </div>
      
      <div className="w-full max-w-xl backdrop-blur-xl bg-gray-800/50 border border-gray-700 shadow-2xl rounded-2xl overflow-hidden z-10">
        {/* Header with logo */}
        <div className="text-center p-6 border-b border-gray-700">
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="text-cyan-400 mr-2 w-8 h-8" />
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">NeoLearn</div>
          </div>
          <p className="text-gray-400">Access your personalized learning experience</p>
        </div>
        
        {/* Toggle buttons */}
        <div className="flex p-1 m-4 bg-gray-700/50 rounded-xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-3 text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center ${
              isLogin 
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <LogIn className={`h-4 w-4 mr-2 ${isLogin ? "text-white" : "text-gray-400"}`} />
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-3 text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center ${
              !isLogin 
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Fingerprint className={`h-4 w-4 mr-2 ${!isLogin ? "text-white" : "text-gray-400"}`} />
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {!isLogin && (
            <>
              {/* Registration form fields with futuristic design */}
              <div className="space-y-5 p-4 rounded-xl bg-gray-700/30 border border-gray-600">
                <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-cyan-400" />
                  Profile Information
                </h3>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-gray-200"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <textarea
                    placeholder="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-gray-200"
                  />
                </div>

                {/* Profile Picture Upload with preview */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Profile Picture</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <img 
                          src={URL.createObjectURL(profilePicture)} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <div className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm text-gray-300 flex items-center">
                          <Camera className="h-4 w-4 mr-2" />
                          <span>Choose file</span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setProfilePicture(e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Role selection with enhanced design */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`flex items-center justify-center p-3 rounded-lg border ${
                        role === "student"
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                          : "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
                      } transition-colors`}
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("admin")}
                      className={`flex items-center justify-center p-3 rounded-lg border ${
                        role === "admin"
                          ? "border-purple-500 bg-purple-500/10 text-purple-400"
                          : "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
                      } transition-colors`}
                    >
                      <Fingerprint className="h-5 w-5 mr-2" />
                      Admin
                    </button>
                  </div>
                </div>
              </div>

              {/* Learning preferences section */}
              <div className="space-y-5 p-4 rounded-xl bg-gray-700/30 border border-gray-600">
                <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center">
                  <Bookmark className="h-5 w-5 mr-2 text-cyan-400" />
                  Learning Preferences
                </h3>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bookmark className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Topics of Interest (comma separated)"
                    value={topicsOfInterest}
                    onChange={(e) => setTopicsOfInterest(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-gray-200"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Syllabus (comma separated)"
                    value={syllabus}
                    onChange={(e) => setSyllabus(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-gray-200"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <List className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Coursework (comma separated)"
                    value={coursework}
                    onChange={(e) => setCoursework(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-gray-200"
                  />
                </div>
              </div>
            </>
          )}

          {/* Common authentication fields */}
          <div className="space-y-5 p-4 rounded-xl bg-gray-700/30 border border-gray-600">
            <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center">
              <LogIn className="h-5 w-5 mr-2 text-cyan-400" />
              {isLogin ? "Login Details" : "Account Credentials"}
            </h3>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-gray-200"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-gray-200"
                required
              />
            </div>

            {isLogin && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-cyan-600 focus:ring-cyan-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-gray-400">
                    Remember me
                  </label>
                </div>
                <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center group"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {isLogin ? "Login to your account" : "Create your account"}
                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {message && (
            <div className={`py-3 px-4 rounded-lg text-center ${message.includes("successfully") ? "bg-green-900/30 border border-green-700 text-green-400" : "bg-red-900/30 border border-red-700 text-red-400"}`}>
              {message}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center p-6 text-gray-500 text-sm border-t border-gray-700">
          {isLogin ? (
            <p>Don't have an account yet? <button onClick={() => setIsLogin(false)} className="text-cyan-400 hover:underline">Create an account</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setIsLogin(true)} className="text-cyan-400 hover:underline">Login here</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;