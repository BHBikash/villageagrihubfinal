import axios from "axios";

const API_URL = "https://villageagrihub.onrender.com/api/auth"; // Change this if needed

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data; // Expecting { user, token }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Login User
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);

    console.log("Backend response:", response.data); // Debugging

    if (!response.data || !response.data.user) {
      throw new Error("Invalid user data received.");
    }

    return response.data.user; // ✅ Ensuring only user object is returned
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
