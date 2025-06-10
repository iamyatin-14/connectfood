import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const { login } = useAuth();

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    const loadGoogleSignIn = async () => {
      try {
        // Check if Google API is already loaded
        if (window.google && window.google.accounts) {
          initializeGoogleSignIn();
          setGoogleApiLoaded(true);
          return;
        }

        // Load Google API
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        // Wait a bit for the API to be fully available
        setTimeout(() => {
          initializeGoogleSignIn();
        }, 100);
      } catch (err) {
        console.error("Failed to load Google Sign-In:", err);
        setError("Failed to load Google Sign-In");
      }
    };

    const initializeGoogleSignIn = () => {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
          setError("Google Client ID not configured");
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        // Render the button
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
          }
        );
        setGoogleApiLoaded(true);
      } else {
        console.error("Google API not available");
        setError("Google Sign-In not available");
        setGoogleApiLoaded(false);
      }
    };

    loadGoogleSignIn();
  }, []);

  // Load Google API script once
  useEffect(() => {
    if (window.google && window.google.accounts) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Render Google button when role is selected and ref is set
  useEffect(() => {
    if (!role || !googleButtonRef.current) return;
    if (!(window.google && window.google.accounts && window.google.accounts.id))
      return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("Google Client ID not configured");
      return;
    }

    // Clear previous button if any
    googleButtonRef.current.innerHTML = "";
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      width: "100%",
      text: "continue_with",
    });
  }, [role, googleButtonRef.current]);

  const handleCredentialResponse = async (response) => {
    if (!role) {
      setError("Please select a role");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await loginWithGoogle({
        idToken: response.credential,
        role,
      });
      if (result.data.jwtToken) {
        login(result.data.jwtToken, result.data.role);
        // Redirect to appropriate dashboard
        if (result.data.role === "donor") {
          navigate("/donor-dashboard");
        } else {
          navigate("/recipient-dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleManualGoogleSignIn = () => {
    if (!role) {
      setError("Please select a role");
      return;
    }
    // Try to trigger Google Sign-In manually
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    } else {
      setError("Google Sign-In not available. Please refresh the page.");
    }
  };

  // Prevent form submission on Enter for recipient fields
  const preventEnterSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse-gentle"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-6 animate-bounce-gentle">🍽️</div>
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Welcome to</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              ConnectFood
            </span>
          </h2>
          <p className="text-slate-300 text-lg">
            Sign in to start making a difference in your community
          </p>
        </div>

        <div className="card-modern p-8 animate-slide-up">
          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-slate-200 mb-4">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setRole("donor");
                  setError("");
                }}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  role === "donor"
                    ? "border-blue-500 bg-blue-900/30 text-blue-300"
                    : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-blue-400 hover:bg-blue-900/20"
                }`}
              >
                <div className="text-3xl mb-2">🍽️</div>
                <div className="font-semibold">Donate Food</div>
                <div className="text-sm opacity-75">Share surplus food</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("recipient");
                  setError("");
                }}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  role === "recipient"
                    ? "border-green-500 bg-green-900/30 text-green-300"
                    : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-green-400 hover:bg-green-900/20"
                }`}
              >
                <div className="text-3xl mb-2">🏢</div>
                <div className="font-semibold">Receive Food</div>
                <div className="text-sm opacity-75">For organizations</div>
              </button>
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

          {/* Google Sign-In */}
          {role && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-slate-300 text-sm mb-4">
                  Continue with Google to get started
                </p>
              </div>

              {/* Google Sign-In Button Container */}
              <div
                id="google-signin-button"
                ref={googleButtonRef}
                className="flex justify-center"
              ></div>

              {/* Manual Google Sign-In Button (fallback) */}

              {/* Loading State */}
              {!googleApiLoaded && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <p className="text-slate-400 text-sm mt-2">
                    Loading Google Sign-In...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {!role && (
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-300">Please select your role above</p>
              <p className="text-sm text-slate-400 mt-1">
                Choose whether you want to donate or receive food
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
