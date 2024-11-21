import axios from "axios";

// Base URL for the backend server
const API_BASE_URL = "http://localhost:5000/api"; // Replace with your actual backend URL

// Set up the token for authentication
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return { Authorization: `Bearer ${token}` };
};

// API routes
const apiRoutes = {
  // Authentication APIs
  registerUser: async (userData) => {
    return axios.post(`${API_BASE_URL}/auth/register`, userData);
  },

  loginUser: async (credentials) => {
    return axios.post(`${API_BASE_URL}/auth/login`, credentials);
  },

  // Group APIs
  createGroup: async (groupData) => {
    return axios.post(`${API_BASE_URL}/groups/create`, groupData, {
      headers: getAuthHeaders(),
    });
  },

  joinGroup: async (groupId) => {
    return axios.post(`${API_BASE_URL}/groups/join`, { groupId }, {
      headers: getAuthHeaders(),
    });
  },

  // Resource APIs
  uploadResource: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`${API_BASE_URL}/resources/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Recommendation APIs
  getRecommendations: async (data) => {
    return axios.post(`${API_BASE_URL}/recommend`, data);
  },

  // Forum APIs
  createForumPost: async (postData) => {
    return axios.post(`${API_BASE_URL}/forum/create`, postData, {
      headers: getAuthHeaders(),
    });
  },

  addComment: async (commentData) => {
    return axios.post(`${API_BASE_URL}/forum/comment`, commentData, {
      headers: getAuthHeaders(),
    });
  },

  voteComment: async (voteData) => {
    return axios.post(`${API_BASE_URL}/forum/vote`, voteData, {
      headers: getAuthHeaders(),
    });
  },
};

export default apiRoutes;