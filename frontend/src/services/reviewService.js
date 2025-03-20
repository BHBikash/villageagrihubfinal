import axios from "axios";

const API_URL = "https://villageagrihub.onrender.com/api/reviews";

// Leave a product review
export const leaveReview = async (productId, rating, comment, token) => {
  try {
    const response = await axios.post(
      API_URL,
      { productId, rating, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};
