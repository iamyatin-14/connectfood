import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { donationService } from "../services/donationService";
import { profileService } from "../services/profileService";
import UserProfile from "../components/UserProfile";
import ProfileStats from "../components/ProfileStats";

function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile?.profileComplete) {
      fetchDonations();
    }
  }, [userProfile]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await donationService.getUserDonations();
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError("Failed to load donations");
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await profileService.getUserProfile();
      setUserProfile(profile);
      if (
        profile &&
        profile.profileComplete === false &&
        location.pathname !== "/complete-profile"
      ) {
        navigate("/complete-profile");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const getDonationStatus = (donation) => {
    if (donation.collected)
      return { text: "Collected", color: "bg-green-100 text-green-800" };
    if (donation.collectionInitiated)
      return {
        text: "Collection Initiated",
        color: "bg-yellow-100 text-yellow-800",
      };
    return { text: "Available", color: "bg-blue-100 text-blue-800" };
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
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="mt-2 text-gray-600">Loading your dashboard...</p>
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
              Donor Dashboard
            </h1>
            <p className="text-slate-300">
              Manage your food donations and help reduce waste
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="btn-secondary"
            >
              {showProfile ? "Hide Profile" : "Show Profile"}
            </button>
            <button onClick={() => navigate("/donate")} className="btn-success">
              Donate Food
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

      {/* Donations List */}
      <div className="card-modern p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Your Donations</h2>
          <div className="text-sm text-slate-300">
            {donations.length} donation{donations.length !== 1 ? "s" : ""} total
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {donations.length === 0 ? (
            <div className="text-center py-8">
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
              <p className="text-slate-300">No donations yet</p>
              <p className="text-sm text-slate-400 mb-4">
                Create your first donation to get started
              </p>
              <button
                onClick={() => navigate("/donate")}
                className="btn-success"
              >
                Donate Food
              </button>
            </div>
          ) : (
            donations.map((d) => (
              <div
                key={d.id}
                className="border border-slate-600 rounded-lg p-6 hover:shadow-lg transition-shadow bg-slate-800/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-2">
                      {d.foodItem || d.city}
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
                      <span>{d.district}</span>
                    </div>
                    <p className="text-sm text-slate-400">{d.address}</p>
                    {d.description && (
                      <p className="text-sm text-slate-300 mt-2 line-clamp-2">
                        {d.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-700 mb-2">
                      {d.quantity} {d.unit || "items"}
                    </span>
                    <div className="mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getDonationStatus(d).color
                        }`}
                      >
                        {getDonationStatus(d).text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Collection Status Info */}
                {d.collectionInitiated && (
                  <div className="mb-3 p-3 bg-yellow-900/50 rounded-lg border border-yellow-700">
                    <div className="flex items-center text-sm text-yellow-300">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium">Collection Initiated</span>
                    </div>
                    <p className="text-xs text-yellow-400 mt-1">
                      by {d.initiatedBy} on {formatDate(d.initiatedAt)}
                    </p>
                  </div>
                )}

                {d.collected && d.collectedBy && (
                  <div className="mb-3 p-3 bg-green-900/50 rounded-lg border border-green-700">
                    <div className="flex items-center text-sm text-green-300">
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
                      <span className="font-medium">Collected</span>
                    </div>
                    <p className="text-xs text-green-400 mt-1">
                      by {d.collectedBy} on {formatDate(d.collectedAt)}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-600">
                  <span>Created: {formatDate(d.createdAt)}</span>
                  {d.expiryDate && (
                    <span>Expires: {formatDate(d.expiryDate)}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
