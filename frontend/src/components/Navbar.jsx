import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { profileService } from "../services/profileService";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [isAuthenticated, location]);

  const fetchUserProfile = async () => {
    try {
      const profile = await profileService.getUserProfile();
      setUserProfile(profile);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="text-3xl group-hover:animate-bounce-gentle transition-all duration-300">
                🍽️
              </div>
              <span className="text-xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                ConnectFood
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActivePage("/")
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActivePage("/about")
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              About
            </Link>

            {isAuthenticated && (
              <>
                {role === "donor" && (
                  <Link
                    to="/donor-dashboard"
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActivePage("/donor-dashboard")
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                {role === "recipient" && (
                  <Link
                    to="/recipient-dashboard"
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActivePage("/recipient-dashboard")
                        ? "bg-green-600 text-white shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                {role === "donor" && (
                  <Link
                    to="/donate"
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActivePage("/donate")
                        ? "bg-green-600 text-white shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    Donate
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 text-slate-300 hover:text-white focus:outline-none p-2 rounded-xl hover:bg-slate-800 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={userProfile?.profilePicture || "/default-avatar.svg"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-600 group-hover:border-blue-500 transition-all duration-300 shadow-lg"
                      onError={(e) => {
                        e.target.src = "/default-avatar.svg";
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse-gentle"></div>
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {userProfile?.name || "User"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-72 bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-xl py-3 z-50 border border-slate-700 animate-slide-up">
                    <div className="px-6 py-4 border-b border-slate-700">
                      <p className="text-sm font-bold text-white">
                        {userProfile?.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {userProfile?.email}
                      </p>
                      <span
                        className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                          role === "donor"
                            ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                            : "bg-green-900/50 text-green-300 border border-green-700"
                        }`}
                      >
                        {role === "donor" ? "Food Donor" : "Food Recipient"}
                      </span>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (role === "donor") {
                            navigate("/donate");
                          } else {
                            navigate("/recipient-dashboard");
                          }
                        }}
                        className="block w-full text-left px-6 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-all duration-300"
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-3"
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
                          {role === "donor"
                            ? "Create New Donation"
                            : "Browse Donations"}
                        </div>
                      </button>

                      <div className="border-t border-slate-700 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-6 py-3 text-sm text-red-400 hover:bg-red-900/30 transition-all duration-300"
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-6 py-2">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        {isAuthenticated && (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-700">
            {role === "donor" && (
              <Link
                to="/donor-dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActivePage("/donor-dashboard")
                    ? "text-blue-400 bg-blue-900/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                Dashboard
              </Link>
            )}
            {role === "recipient" && (
              <Link
                to="/recipient-dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActivePage("/recipient-dashboard")
                    ? "text-green-400 bg-green-900/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                Dashboard
              </Link>
            )}
            {role === "donor" && (
              <Link
                to="/donate"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActivePage("/donate")
                    ? "text-green-400 bg-green-900/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                Donate
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
