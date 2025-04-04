import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 text-black p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide transition-all hover:text-purple-400"
        >
          HTTP Dog Codes
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          {user ? (
            <>
              <Link
                to="/search"
                className="text-lg transition-all hover:text-purple-400 flex items-center"
              >
                Search
              </Link>
              <Link
                to="/lists"
                className="text-lg transition-all hover:text-purple-400 flex items-center"
              >
                My Lists
              </Link>
              <button
                onClick={onLogout}
                className="px-5 py-2 bg-black text-white rounded-md hover:bg-black-600 transition-all shadow-md hover:shadow-black-500/50 hover:scale-105 active:scale-95"
              > 
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="relative text-lg transition-all hover:text-purple-400 flex items-center"
            >
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-2xl focus:outline-none hover:text-purple-400 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-white/10 backdrop-blur-md border-t border-white/20 p-4 shadow-md transition-all duration-500 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
      >
        <div className="flex flex-col items-center space-y-3">
          {user ? (
            <>
              <Link
                to="/search"
                className="text-lg transition-all hover:text-purple-400"
                onClick={() => setMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                to="/lists"
                className="text-lg transition-all hover:text-purple-400"
                onClick={() => setMenuOpen(false)}
              >
                My Lists
              </Link>
              <button
                onClick={onLogout}
                className="px-5 py-2 bg-purple-500 rounded-md hover:bg-purple-600 transition-all shadow-md hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="text-lg transition-all hover:text-purple-400"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
