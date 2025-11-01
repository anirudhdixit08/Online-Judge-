import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, clearAuthMessages } from '../slices/authSlice'; // Adjust path
import { unwrapResult } from '@reduxjs/toolkit';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Read Authentication State from Redux
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 2. Theme Management State
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light'
  );

  // 3. Effect to Apply Theme
  // This runs when 'theme' state changes
  useEffect(() => {
    // Set the data-theme attribute on the <html> tag
    document.documentElement.setAttribute('data-theme', theme);
    // Save the theme to local storage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 4. Handle Theme Toggle Click
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // 5. Handle Logout Click
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearAuthMessages());
      navigate('/login'); // Redirect to login after logout
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      {/* === Website Name (Left) === */}
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          AlgoPractise
        </Link>
      </div>

      {/* === Icons (Right) === */}
      <div className="navbar-end">
        {/* --- Theme Toggle (Always Visible) --- */}
        <button 
          onClick={handleThemeToggle} 
          className="btn btn-ghost btn-circle"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            // Moon Icon (for dark mode)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          ) : (
            // Sun Icon (for light mode)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>

        {/* --- Profile Dropdown (Logged-In Only) --- */}
        {isAuthenticated && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {/* Generic User Avatar Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link to="/profile">
                  User Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;