import api from "./api";

export const donationService = {
  // Get user's donations (for donors)
  async getUserDonations() {
    try {
      const response = await api.get("/donations/my");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch donations"
      );
    }
  },

  // Get available donations (for recipients)
  async getAvailableDonations(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append("city", filters.city);
      if (filters.district) params.append("district", filters.district);
      if (filters.minQuantity)
        params.append("minQuantity", filters.minQuantity);

      const response = await api.get(`/donations/live?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch available donations"
      );
    }
  },

  // Create new donation
  async createDonation(donationData) {
    try {
      const response = await api.post("/donations", donationData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create donation"
      );
    }
  },

  // Update donation
  async updateDonation(id, updates) {
    try {
      const response = await api.put(`/donations/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update donation"
      );
    }
  },

  // Delete donation
  async deleteDonation(id) {
    try {
      const response = await api.delete(`/donations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete donation"
      );
    }
  },

  // Initiate collection (for recipients)
  async initiateCollection(id) {
    try {
      const response = await api.put(`/donations/${id}/initiate`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to initiate collection"
      );
    }
  },

  // Collect donation (for recipients)
  async collectDonation(id) {
    try {
      const response = await api.put(`/donations/${id}/collect`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to collect donation"
      );
    }
  },

  // Get donation by ID
  async getDonation(id) {
    try {
      const response = await api.get(`/donations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch donation"
      );
    }
  },
};
