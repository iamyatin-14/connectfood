import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-6 animate-bounce-gentle">🌱</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">About</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                ConnectFood
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              We're on a mission to reduce food waste and hunger by connecting
              food donors with organizations that can distribute it to those in
              need through our innovative platform.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                Our Mission
              </h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                ConnectFood was born from a simple observation: while millions
                of people go hungry every day, tons of perfectly good food goes
                to waste. We believe technology can bridge this gap.
              </p>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Our platform connects restaurants, caterers, and food businesses
                with verified organizations like shelters, food banks, and NGOs
                that can distribute surplus food to those who need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="btn-success text-lg px-8 py-3">
                  Join Our Mission
                </Link>
                <Link
                  to="/contact"
                  className="glass-effect text-slate-200 hover:text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-medium"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="card-modern p-8 animate-slide-up">
              <div className="text-6xl mb-6 animate-bounce-gentle">🌱</div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Sustainable Impact
              </h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-900/50 text-green-300 border border-green-700 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                    ✓
                  </span>
                  <span className="text-lg">Reduce food waste by 40%</span>
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-900/50 text-green-300 border border-green-700 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                    ✓
                  </span>
                  <span className="text-lg">Help 10,000+ people daily</span>
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-900/50 text-green-300 border border-green-700 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                    ✓
                  </span>
                  <span className="text-lg">
                    Partner with 500+ organizations
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-900/50 text-green-300 border border-green-700 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                    ✓
                  </span>
                  <span className="text-lg">Cover 50+ cities nationwide</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Our Values
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-modern p-8 text-center group hover:transform hover:scale-105 transition-all duration-500">
              <div className="text-6xl mb-6 group-hover:animate-bounce-gentle">
                🤝
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Community First
              </h3>
              <p className="text-slate-300 leading-relaxed">
                We believe in the power of community. Every donation, every
                collection, every connection strengthens our communities.
              </p>
            </div>

            <div className="card-modern p-8 text-center group hover:transform hover:scale-105 transition-all duration-500">
              <div className="text-6xl mb-6 group-hover:animate-bounce-gentle">
                🌍
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Environmental Responsibility
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Reducing food waste is crucial for our planet. We're committed
                to environmental sustainability in everything we do.
              </p>
            </div>

            <div className="card-modern p-8 text-center group hover:transform hover:scale-105 transition-all duration-500">
              <div className="text-6xl mb-6 group-hover:animate-bounce-gentle">
                🔒
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Trust & Safety
              </h3>
              <p className="text-slate-300 leading-relaxed">
                We maintain the highest standards of food safety and verify all
                organizations to ensure donations reach those who need them.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              How ConnectFood Works
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Simple, secure, and effective food sharing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="card-modern p-6 text-center group hover:transform hover:scale-105 transition-all duration-500">
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:animate-bounce-gentle">
                <span className="text-3xl font-bold text-blue-300">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sign Up</h3>
              <p className="text-slate-300 leading-relaxed">
                Create an account as a donor or recipient organization
              </p>
            </div>

            <div className="card-modern p-6 text-center group hover:transform hover:scale-105 transition-all duration-500">
              <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 border border-green-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:animate-bounce-gentle">
                <span className="text-3xl font-bold text-green-300">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Post or Browse
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Donors post available food, recipients browse and filter
              </p>
            </div>

            <div className="card-modern p-6 text-center group hover:transform hover:scale-105 transition-all duration-500">
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:animate-bounce-gentle">
                <span className="text-3xl font-bold text-purple-300">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Connect</h3>
              <p className="text-slate-300 leading-relaxed">
                Recipients claim donations and coordinate pickup
              </p>
            </div>

            <div className="card-modern p-6 text-center group hover:transform hover:scale-105 transition-all duration-500">
              <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border border-orange-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:animate-bounce-gentle">
                <span className="text-3xl font-bold text-orange-300">4</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Impact</h3>
              <p className="text-slate-300 leading-relaxed">
                Food reaches those in need, reducing waste and hunger
              </p>
            </div>
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
              to="/"
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

export default About;
