import React, { useEffect, useState } from "react";
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
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <img
          src={profile.profilePicture || "https://via.placeholder.com/150"} // Default if no profile picture
          alt="Profile"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-gray-600">{profile.email}</p>
          <p className="mt-2">{profile.role === "admin" ? "Administrator" : "Student"}</p>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Bio</h2>
        <p className="text-gray-700">{profile.bio || "No bio provided."}</p>
      </div>

      {/* Topics of Interest */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Topics of Interest</h2>
        {profile.topicsOfInterest && profile.topicsOfInterest.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {profile.topicsOfInterest.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No topics added yet.</p>
        )}
      </div>

      {/* Syllabus */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Syllabus</h2>
        {profile.syllabus && profile.syllabus.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {profile.syllabus.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No syllabus items added.</p>
        )}
      </div>

      {/* Coursework */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Coursework</h2>
        {profile.coursework && profile.coursework.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {profile.coursework.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No coursework items added.</p>
        )}
      </div>

      {/* Return to Dashboard Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/home")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;