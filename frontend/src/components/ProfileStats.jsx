import React, { useState, useEffect } from "react";
import { profileService } from "../services/profileService";

const ProfileStats = ({ compact = false }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsData = await profileService.getUserStats();
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError("Failed to load statistics");
      console.error("Stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const getRoleDisplayName = (role) => {
    return role === "DONOR" ? "Donor" : "Recipient";
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Quick Stats</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              stats.role === "DONOR"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {getRoleDisplayName(stats.role)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {stats.totalDonations}
            </div>
            <div className="text-xs text-gray-600">
              {stats.role === "DONOR" ? "Donations" : "Collections"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {stats.totalItems}
            </div>
            <div className="text-xs text-gray-600">Items</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">
              {stats.activeDonations}
            </div>
            <div className="text-xs text-gray-600">Active</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Activity Statistics
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            stats.role === "DONOR"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {getRoleDisplayName(stats.role)}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalDonations}
          </div>
          <div className="text-sm text-blue-600">
            {stats.role === "DONOR" ? "Total Donations" : "Total Collections"}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.totalItems}
          </div>
          <div className="text-sm text-green-600">Total Items</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.activeDonations}
          </div>
          <div className="text-sm text-yellow-600">Active Donations</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
