import React, { useState, useEffect } from "react";
import { donationService } from "../services/donationService";
import { profileService } from "../services/profileService";
import ProfileStats from "../components/ProfileStats";
import UserProfile from "../components/UserProfile";
import { useNavigate, useLocation } from "react-router-dom";

const RecipientDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    district: "",
    minQuantity: 1,
  });
  const [processingDonation, setProcessingDonation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile?.profileComplete) {
      fetchDonations();
    }
  }, [filters, userProfile]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await donationService.getAvailableDonations(filters);
      setDonations(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await profileService.getUserProfile();
      setUserProfile(profile);

      // Only redirect if profile exists, is not complete, and we're not already on complete-profile page
      if (
        profile &&
        profile.profileComplete === false &&
        location.pathname !== "/complete-profile"
      ) {
        navigate("/complete-profile");
      } else if (profile && profile.profileComplete === true) {
        // Profile is complete, stay on dashboard
      } else if (!profile) {
        navigate("/complete-profile");
      }
    } catch (err) {
      // If there's an error fetching profile, redirect to complete-profile
      navigate("/complete-profile");
    }
  };

  const handleInitiateCollection = async (id) => {
    try {
      setProcessingDonation(id);
      await donationService.initiateCollection(id);
      fetchDonations(); // Refresh the list
    } catch (err) {
      setError(err.response?.data || "Failed to initiate collection");
    } finally {
      setProcessingDonation(null);
    }
  };

  const handleCollectDonation = async (id) => {
    try {
      setProcessingDonation(id);
      await donationService.collectDonation(id);
      fetchDonations(); // Refresh the list
    } catch (err) {
      setError(err.response?.data || "Failed to collect donation");
    } finally {
      setProcessingDonation(null);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getDonationStatus = (donation) => {
    if (donation.collected)
      return {
        text: "Collected",
        color: "bg-green-900/50 text-green-300 border border-green-700",
      };
    if (donation.collectionInitiated)
      return {
        text: "Collection Initiated",
        color: "bg-yellow-900/50 text-yellow-300 border border-yellow-700",
      };
    return {
      text: "Available",
      color: "bg-blue-900/50 text-blue-300 border border-blue-700",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-slate-300">Loading available donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Recipient Dashboard
            </h1>
            <p className="text-slate-300">
              Find and collect food donations from donors
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="btn-secondary"
            >
              {showProfile ? "Hide Profile" : "Show Profile"}
            </button>
            <button
              onClick={() => {
                fetchUserProfile();
              }}
              className="btn-primary"
            >
              Refresh Profile
            </button>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      {showProfile && (
        <div className="mb-8">
          <UserProfile />
        </div>
      )}

      {/* Quick Stats */}
      {userProfile && (
        <div className="mb-8">
          <ProfileStats profile={userProfile} />
        </div>
      )}

      {/* Search Filters */}
      <div className="card-modern p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Search Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              City
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="input-modern w-full"
              placeholder="Filter by city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              District
            </label>
            <input
              type="text"
              value={filters.district}
              onChange={(e) => handleFilterChange("district", e.target.value)}
              className="input-modern w-full"
              placeholder="Filter by district"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Minimum Quantity
            </label>
            <input
              type="number"
              value={filters.minQuantity}
              onChange={(e) =>
                handleFilterChange("minQuantity", parseInt(e.target.value) || 1)
              }
              className="input-modern w-full"
              min="1"
            />
          </div>
        </div>
      </div>

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

      {/* Donations List */}
      <div className="card-modern p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Available Donations
          </h2>
          <div className="text-sm text-slate-300">
            {donations.length} donation{donations.length !== 1 ? "s" : ""}{" "}
            available
          </div>
        </div>

        <div className="space-y-4">
          {donations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                No donations available
              </h3>
              <p className="text-slate-400">
                Check back later or try adjusting your filters
              </p>
            </div>
          ) : (
            donations.map((donation) => (
              <div
                key={donation.id}
                className="border border-slate-600 rounded-lg p-6 hover:shadow-lg transition-shadow bg-slate-800/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-2">
                      {donation.foodItem}
                    </h3>
                    <div className="flex items-center text-sm text-slate-300 mb-2">
                      <svg
                        className="w-4 h-4 mr-2 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>
                        {donation.district}, {donation.city}
                      </span>
                    </div>
                    {donation.description && (
                      <p className="text-sm text-slate-300 mb-2">
                        {donation.description}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-slate-400">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Expires: {formatDate(donation.expiryDate)}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-700 mb-2">
                      {donation.quantity} {donation.unit || "items"}
                    </span>
                    <div className="mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getDonationStatus(donation).color
                        }`}
                      >
                        {getDonationStatus(donation).text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-600">
                  {!donation.collectionInitiated && !donation.collected && (
                    <button
                      onClick={() => handleInitiateCollection(donation.id)}
                      disabled={processingDonation === donation.id}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      {processingDonation === donation.id ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Initiating...
                        </span>
                      ) : (
                        "Initiate Collection"
                      )}
                    </button>
                  )}
                  {donation.collectionInitiated && !donation.collected && (
                    <button
                      onClick={() => handleCollectDonation(donation.id)}
                      disabled={processingDonation === donation.id}
                      className="btn-success text-sm px-4 py-2"
                    >
                      {processingDonation === donation.id ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Collecting...
                        </span>
                      ) : (
                        "Mark as Collected"
                      )}
                    </button>
                  )}
                  {donation.collected && (
                    <span className="inline-flex items-center px-3 py-2 bg-green-900/50 text-green-300 border border-green-700 rounded-lg text-sm">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Collected
                    </span>
                  )}
                </div>

                {/* Donor Info */}
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="flex items-center text-sm text-slate-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Donated by: {donation.donorName || "Anonymous"}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Posted: {formatDate(donation.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientDashboard;
