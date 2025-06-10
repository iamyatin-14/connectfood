import api from "./api";

export const profileService = {
  // Get user profile information
  async getUserProfile() {
    try {
      const response = await api.get("/profile");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  },

  // Get user statistics
  async getUserStats() {
    try {
      const response = await api.get("/profile/stats");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user stats"
      );
    }
  },

  // Update user profile
  async updateProfile(updates) {
    try {
      const response = await api.put("/profile", updates);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },
};
