import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { donationService } from "../services/donationService";
import { profileService } from "../services/profileService";

const Donate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);

  const [formData, setFormData] = useState({
    foodItem: "",
    description: "",
    quantity: "",
    unit: "people",
    city: "",
    district: "",
    address: "",
    expiryDate: "",
    specialInstructions: "",
  });

  // Check if user is logged in, is a donor, and has complete profile
  useEffect(() => {
    const checkUserAndProfile = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        navigate("/login");
        return;
      }

      if (role !== "donor") {
        navigate("/");
        return;
      }

      // Check if profile is complete
      try {
        const profile = await profileService.getUserProfile();
        if (!profile.profileComplete) {
          setProfileComplete(false);
          setError("Please complete your profile before donating");
        }
      } catch (err) {
        console.error("Profile check error:", err);
        setError("Failed to verify profile completion");
      }
    };

    checkUserAndProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.foodItem.trim()) {
        throw new Error("Food item is required");
      }
      if (!formData.quantity || formData.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }
      if (!formData.city.trim()) {
        throw new Error("City is required");
      }
      if (!formData.district.trim()) {
        throw new Error("District is required");
      }
      if (!formData.expiryDate) {
        throw new Error("Expiry date is required");
      }

      // Set minimum expiry date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const selectedDate = new Date(formData.expiryDate);

      if (selectedDate <= new Date()) {
        throw new Error("Expiry date must be in the future");
      }

      await donationService.createDonation(formData);
      setSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/donor-dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create donation");
    } finally {
      setLoading(false);
    }
  };

  const foodCategories = [
    "Rice & Grains",
    "Vegetables",
    "Fruits",
    "Dairy Products",
    "Bread & Bakery",
    "Canned Foods",
    "Frozen Foods",
    "Ready-to-Eat Meals",
    "Beverages",
    "Snacks",
    "Other",
  ];

  const unitOptions = [
    { value: "people", label: "People served" },
    { value: "kg", label: "Kilograms (kg)" },
    { value: "pieces", label: "Pieces" },
    { value: "packets", label: "Packets" },
    { value: "boxes", label: "Boxes" },
    { value: "liters", label: "Liters (L)" },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="card-modern p-8 text-center max-w-md relative z-10 animate-fade-in">
          <div className="text-6xl mb-6 animate-bounce-gentle">✅</div>
          <h2 className="text-3xl font-bold text-green-300 mb-4">
            Donation Created!
          </h2>
          <p className="text-slate-300 mb-6 text-lg">
            Your food donation has been successfully posted. Organizations in
            your area will be able to see and collect it.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-900/50 text-green-300 border border-green-700 rounded-full">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  // Show profile completion warning
  if (!profileComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="card-modern p-8 text-center max-w-md relative z-10 animate-fade-in">
          <div className="text-6xl mb-6 animate-bounce-gentle">⚠️</div>
          <h2 className="text-3xl font-bold text-yellow-300 mb-4">
            Profile Incomplete
          </h2>
          <p className="text-slate-300 mb-6 text-lg">
            Please complete your profile before creating donations. This helps
            ensure smooth coordination with recipients.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/complete-profile")}
              className="btn-primary w-full py-3 text-lg font-semibold"
            >
              Complete Profile
            </button>
            <button
              onClick={() => navigate("/donor-dashboard")}
              className="btn-secondary w-full py-3 text-lg font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse-gentle"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-6 animate-bounce-gentle">🍽️</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Donate</span>
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              Food
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Share your surplus food with organizations that can distribute it to
            those in need. Every donation makes a difference.
          </p>
        </div>

        <div className="card-modern p-8 animate-slide-up">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl animate-fade-in">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Food Item */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Food Item *
                </label>
                <input
                  type="text"
                  name="foodItem"
                  value={formData.foodItem}
                  onChange={handleInputChange}
                  className="input-modern w-full"
                  placeholder="e.g., Rice, Vegetables, Bread, etc."
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-modern w-full"
                  placeholder="Describe the food item, cooking instructions, or any special notes..."
                />
              </div>

              {/* Quantity and Unit */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className="input-modern w-full"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="input-modern w-full"
                >
                  {unitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input-modern w-full"
                  placeholder="Enter city"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="input-modern w-full"
                  placeholder="Enter district"
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-modern w-full"
                  placeholder="Enter detailed address for pickup"
                />
              </div>

              {/* Expiry Date */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="input-modern w-full"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">
                  Please select a future date
                </p>
              </div>

              {/* Special Instructions */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-modern w-full"
                  placeholder="Any special handling instructions, pickup preferences, or additional notes..."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-success flex-1 py-3 text-lg font-semibold"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Donation...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create Donation
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/donor-dashboard")}
                className="btn-secondary px-8 py-3 text-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;
