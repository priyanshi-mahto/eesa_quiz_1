import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 border-b border-border backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a
            href="/"
            className="flex items-center space-x-2 group"
          >
            <h4 className="text-xl sm:text-2xl font-bold text-gradient hover:scale-105 transition-transform duration-200">
              SignalCipher: The Hidden Wish
            </h4>
          </a>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={() => loginWithRedirect()}
                className="btn-primary text-sm sm:text-base shadow-lg hover:shadow-xl"
              >
                Log In
              </button>
            ) : (
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="btn-secondary text-sm sm:text-base"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
