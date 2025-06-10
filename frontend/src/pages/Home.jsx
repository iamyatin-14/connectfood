import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse-gentle"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-6 animate-bounce-gentle">🍽️</div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Connect</span>
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Food
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Bridging the gap between food donors and recipients. Reduce food
              waste, help those in need, and create a sustainable food ecosystem
              with our modern platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/login" className="btn-success text-lg px-10 py-4">
                Get Started
              </Link>
              <Link
                to="/about"
                className="glass-effect text-slate-200 hover:text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              How It Works
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Simple steps to make a difference in your community with our
              innovative platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Donors */}
            <div className="card-modern p-8 text-center group hover:transform hover:scale-105 transition-all duration-500">
              <div className="text-6xl mb-6 group-hover:animate-bounce-gentle">
                🍽️
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                For Food Donors
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Share surplus food with those who need it. Post donations with
                location, quantity, and expiry details in just a few clicks.
              </p>
              <div className="mt-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-900/50 text-blue-300 border border-blue-700 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse-gentle"></span>
                  Easy & Fast
                </div>
              </div>
            </div>

            {/* For Recipients */}
            <div className="card-modern p-8 text-center group hover:transform hover:scale-105 transition-all duration-500">
              <div className="text-6xl mb-6 group-hover:animate-bounce-gentle">
                🏢
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                For Organizations
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Find and collect food donations for your organization. Verified
                license holders with real-time notifications and tracking.
              </p>
              <div className="mt-6">
                <div className="inline-flex items-center px-4 py-2 bg-green-900/50 text-green-300 border border-green-700 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-gentle"></span>
                  Verified & Secure
                </div>
              </div>
            </div>

            {/* Impact */}
            <div className="card-modern p-8 text-center group hover:transform hover:scale-105 transition-all duration-500">
              <div className="text-6xl mb-6 group-hover:animate-bounce-gentle">
                🌍
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Community Impact
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Reduce food waste, help those in need, and build stronger
                communities through food sharing with measurable impact.
              </p>
              <div className="mt-6">
                <div className="inline-flex items-center px-4 py-2 bg-purple-900/50 text-purple-300 border border-purple-700 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse-gentle"></span>
                  Real Impact
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-br from-slate-900 via-red-900/20 to-orange-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-red-300 mb-4">
              The Challenge We Face: World Hunger
            </h2>
            <p className="text-xl text-red-200/90 max-w-3xl mx-auto">
              Millions face hunger every day, yet a third of all food produced
              globally goes to waste. ConnectFood is a step towards changing
              this.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center mt-12">
            <div
              className="card-modern p-8 bg-slate-800/90 backdrop-blur-sm animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-red-300 mb-2">
                828 Million People
              </h3>
              <p className="text-slate-300 text-lg">
                Go hungry worldwide (2021)
              </p>
            </div>
            <div
              className="card-modern p-8 bg-slate-800/90 backdrop-blur-sm animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="text-2xl font-bold text-orange-300 mb-2">
                1.3 Billion Tons
              </h3>
              <p className="text-slate-300 text-lg">Of food wasted annually</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="text-xl text-red-200/90 max-w-3xl mx-auto">
              This stark contrast highlights the urgent need for solutions. By
              facilitating food redistribution, ConnectFood aims to bridge this
              gap.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-slate-900 via-green-900/20 to-blue-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto">
            Join thousands of people already helping their communities and
            creating a sustainable future
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-green-600 px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-large"
            >
              Start Today
            </Link>
            <Link
              to="/about"
              className="glass-effect text-white hover:text-gray-100 px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-medium"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
