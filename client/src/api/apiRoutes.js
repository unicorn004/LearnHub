import axios from "axios";

// Base URL for the backend server
const API_BASE_URL = "http://localhost:5000/api";

// Set up the token for authentication
export const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return { "x-auth-token": token };
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

  // Profile APIs
  getProfile: async () => {
    return axios.get(`${API_BASE_URL}/profile`, {
      headers: getAuthHeader(),
    });
  },

  updateProfile: async (profileData) => {
    return axios.put(`${API_BASE_URL}/profile`, profileData, {
      headers: getAuthHeader(),
    });
  },

  // Group APIs
  createGroup: async (groupData) => {
    return axios.post(`${API_BASE_URL}/groups/create`, groupData, {
      headers: getAuthHeader(),
    });
  },

  joinGroup: async (groupId) => {
    return axios.post(`${API_BASE_URL}/groups/join`, { groupId }, {
      headers: getAuthHeader(),
    });
  },

  // Resource APIs
  uploadResource: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`${API_BASE_URL}/resources/upload`, formData, {
      headers: {
        ...getAuthHeader(),
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
      headers: getAuthHeader(),
    });
  },

  addComment: async (commentData) => {
    return axios.post(`${API_BASE_URL}/forum/comment`, commentData, {
      headers: getAuthHeader(),
    });
  },

  voteComment: async (voteData) => {
    return axios.post(`${API_BASE_URL}/forum/vote`, voteData, {
      headers: getAuthHeader(),
    });
  },
};

export default apiRoutes;
