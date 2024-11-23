import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, LogIn, FileText, Bookmark, Layers, List, Camera } from "lucide-react"; // Add Camera for profile picture
import apiRoutes from "../api/apiRoutes"; // Import API routes

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(""); // For profile picture
  const [role, setRole] = useState("student"); // For role (student/admin)
  const [topicsOfInterest, setTopicsOfInterest] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [coursework, setCoursework] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to upload the profile picture
  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Append the file to the form data
    try {
      // Send the image file to the backend (you may need to change the API endpoint here)
      const response = await apiRoutes.uploadResource(formData);
      return response.data.url; // Assuming the backend returns the URL of the uploaded image
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
        // Upload the profile picture if selected
        const pictureResponse = await uploadProfilePicture(profilePicture);
        profilePictureUrl = pictureResponse; // Get the URL of the uploaded image
      }

      if (isLogin) {
        // Login logic
        const response = await apiRoutes.loginUser({ email, password });
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userid", response.data.user._id);
        localStorage.setItem("username", response.data.user.name);
        setMessage("Logged in successfully!");
        navigate("/home"); // Redirect after login
      } else {
        // Register logic
        const data = {
          name: username,
          email,
          password,
          bio,
          profilePicture: profilePictureUrl, // Include profile picture URL
          role,
          topicsOfInterest: topicsOfInterest.split(","),
          syllabus: syllabus.split(","),
          coursework: coursework.split(","),
        };
        await apiRoutes.registerUser(data);
        setMessage("Registered successfully! Please login.");
        setIsLogin(true); // Switch to login form after registration
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.msg || "An error occurred. Please try again.");
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
            className={`w-1/2 py-4 text-lg font-semibold transition-colors duration-300 ${isLogin ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-4 text-lg font-semibold transition-colors duration-300 ${!isLogin ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
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

              {/* Profile Picture Upload */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Camera className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="file"
                  onChange={(e) => setProfilePicture(e.target.files[0])} // Handle file input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role selection */}
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Topics of Interest */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Bookmark className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Topics of Interest (comma separated)"
                  value={topicsOfInterest}
                  onChange={(e) => setTopicsOfInterest(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Syllabus */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Layers className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Syllabus (comma separated)"
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Coursework */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <List className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Coursework (comma separated)"
                  value={coursework}
                  onChange={(e) => setCoursework(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Email and Password fields for login and registration */}
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
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>

          {message && <p className="text-center text-red-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;