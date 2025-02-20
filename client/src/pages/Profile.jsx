import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRoutes from "../api/apiRoutes";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiRoutes.getProfile();
        console.log("Profile data fetched:", response.data);
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile Header - Enhanced with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profile.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {profile.role === "admin" ? "Admin" : "Student"}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
            <p className="text-gray-600 flex items-center mt-1">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {profile.email}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Using cards for each section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bio Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Bio</h2>
          <p className="text-gray-700 leading-relaxed">{profile.bio || "No bio provided."}</p>
        </div>

        {/* Topics of Interest */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Topics of Interest</h2>
          {profile.topicsOfInterest && profile.topicsOfInterest.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.topicsOfInterest.map((topic, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">No topics added yet.</p>
          )}
        </div>

        {/* Syllabus */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Syllabus</h2>
          {profile.syllabus && profile.syllabus.length > 0 ? (
            <ul className="space-y-2">
              {profile.syllabus.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No syllabus items added.</p>
          )}
        </div>

        {/* Coursework */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Coursework</h2>
          {profile.coursework && profile.coursework.length > 0 ? (
            <ul className="space-y-2">
              {profile.coursework.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No coursework items added.</p>
          )}
        </div>
      </div>

      {/* Return to Dashboard Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/home")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out transform hover:-translate-y-1"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;