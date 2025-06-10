import React, { useState, useEffect } from "react";
import { profileService } from "../services/profileService";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      setImageError(false);
      const profileData = await profileService.getUserProfile();
      setProfile(profileData);
    } catch (err) {
      setError("Failed to load profile");
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    if (!imageError && e.target.src.indexOf("default-avatar") === -1) {
      setImageError(true);
      e.target.src = "/default-avatar.svg";
    }
  };

  const getProfileImage = () => {
    if (imageError || !profile?.profilePicture) {
      return "/default-avatar.svg";
    }
    return profile.profilePicture;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchProfile}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-600">No profile data available</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleDisplayName = (role) => {
    return role === "DONOR" ? "Food Donor" : "Food Recipient";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img
            src={getProfileImage()}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            onError={handleImageError}
            loading="lazy"
          />
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              profile.profileComplete ? "bg-green-500" : "bg-yellow-500"
            }`}
          ></div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-gray-600">{profile.email}</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              profile.role === "DONOR"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {getRoleDisplayName(profile.role)}
          </span>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Contact Information
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">Phone:</span>
              <span className="ml-2 text-gray-900">
                {profile.phoneNumber || "Not provided"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Address:</span>
              <span className="ml-2 text-gray-900">
                {profile.address || "Not provided"}
              </span>
            </div>
            {profile.role === "RECIPIENT" && (
              <div>
                <span className="text-gray-600">License Number:</span>
                <span className="ml-2 text-gray-900">
                  {profile.licenseNumber || "Not provided"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Account Information
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">Member since:</span>
              <span className="ml-2 text-gray-900">
                {formatDate(profile.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Last login:</span>
              <span className="ml-2 text-gray-900">
                {formatDate(profile.lastLoginAt)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Profile status:</span>
              <span
                className={`ml-2 ${
                  profile.profileComplete ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {profile.profileComplete ? "Complete" : "Incomplete"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Activity Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {profile.totalDonations}
            </div>
            <div className="text-sm text-blue-600">
              {profile.role === "DONOR"
                ? "Total Donations"
                : "Total Collections"}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {profile.totalItems}
            </div>
            <div className="text-sm text-green-600">Total Items</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {profile.activeDonations}
            </div>
            <div className="text-sm text-yellow-600">Active Donations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
