import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "../services/profileService";

const CompleteProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  // Check if profile is already complete and redirect
  useEffect(() => {
    if (profile && profile.profileComplete) {
      redirectToDashboard(profile.role);
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getUserProfile();
      setProfile(data);
      setForm({
        name: data.name || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        organizationName: data.organizationName || "",
        licenseNumber: data.licenseNumber || "",
      });
      if (data.profileComplete) {
        // Already complete, redirect
        redirectToDashboard(data.role);
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const redirectToDashboard = (role) => {
    if (role === "DONOR" || role === "donor") {
      navigate("/donor-dashboard");
    } else if (role === "RECIPIENT" || role === "recipient") {
      navigate("/recipient-dashboard");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // Minimal validation
      if (!form.name.trim()) throw new Error("Name is required");
      if (profile.role === "RECIPIENT") {
        if (!form.organizationName.trim() || !form.licenseNumber.trim()) {
          throw new Error("Organization name and license number are required");
        }
      }

      // Update profile
      const response = await profileService.updateProfile(form);

      // Check if profile is now complete
      if (response && response.profileComplete) {
        // Profile is complete, redirect to dashboard with a small delay
        setTimeout(() => {
          redirectToDashboard(profile.role);
        }, 100);
      } else {
        // Profile not complete yet, refetch profile to get updated data
        const updated = await profileService.getUserProfile();
        setProfile(updated);
        setError(
          "Profile updated but some required fields may still be missing."
        );
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-green-500 to-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200 to-blue-300 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-10 animate-pulse-gentle"></div>
      </div>

      <div className="relative max-w-md mx-auto">
        <div className="card-modern p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
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
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Complete Your Profile
            </h2>
            <p className="text-slate-300">
              Please provide the required information to continue.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 mb-6 animate-fade-in">
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

          {/* Success Message and Manual Redirect */}
          {profile && profile.profileComplete && (
            <div className="bg-green-900/50 border border-green-700 rounded-xl p-4 mb-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-400 mr-2"
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
                  <p className="text-green-300 text-sm font-medium">
                    Profile completed successfully!
                  </p>
                </div>
                <button
                  onClick={() => redirectToDashboard(profile.role)}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-modern w-full"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {profile.role === "RECIPIENT" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={form.organizationName}
                      onChange={handleChange}
                      className="input-modern w-full"
                      placeholder="Enter organization name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      FSSAI License Number *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={form.licenseNumber}
                      onChange={handleChange}
                      className="input-modern w-full"
                      placeholder="Enter FSSAI license number"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Phone Number {profile.role === "DONOR" && "*"}
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="input-modern w-full"
                  placeholder="Enter phone number"
                  required={profile.role === "DONOR"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Address {profile.role === "DONOR" && "*"}
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="input-modern w-full"
                  placeholder="Enter address"
                  required={profile.role === "DONOR"}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 text-lg font-semibold mt-6"
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save & Continue
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
