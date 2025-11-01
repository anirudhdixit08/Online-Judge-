// src/pages/LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-base-300">
        <div className="hero-content text-center">
          <div className="max-w-4xl py-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-neutral-content leading-tight">
              Sharpen Your Coding Skills <br />
              <span className="text-primary-focus">Compete and Conquer</span>
            </h1>
            <p className="mb-10 text-lg md:text-xl text-neutral-content">
              The ultimate platform for competitive programming. Solve challenges, join
              contests, and climb the leaderboard to prove your mettle.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              {/* These buttons now correctly link to your signup form */}
              <Link to="/signup" className="btn btn-primary btn-lg px-8">
                Explore Problems
              </Link>
              <Link to="/signup" className="btn btn-outline btn-lg px-8">
                Join a Contest
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why CodeArena Section */}
      <div className="py-20 text-center bg-base-200">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-neutral-content">
          Why CodeArena?
        </h2>
        <p className="text-lg mb-16 text-neutral-content">
          Everything you need to become a top-tier programmer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {/* Feature 1: Vast Problem Library */}
          <div className="card bg-base-100 shadow-xl p-6 transform transition-transform hover:scale-105 duration-300">
            <figure className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </figure>
            <h3 className="card-title text-xl font-semibold mb-3">Vast Problem Library</h3>
            <p className="text-sm text-neutral-content">
              Access thousands of problems ranging from beginner to expert,
              covering numerous data structures and algorithms.
            </p>
          </div>

          {/* Feature 2: Live Contests */}
          <div className="card bg-base-100 shadow-xl p-6 transform transition-transform hover:scale-105 duration-300">
            <figure className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </figure>
            <h3 className="card-title text-xl font-semibold mb-3">Live Contests</h3>
            <p className="text-sm text-neutral-content">
              Participate in real-time coding contests. Test your speed and
              accuracy against programmers worldwide.
            </p>
          </div>

          {/* Feature 3: Detailed Analytics */}
          <div className="card bg-base-100 shadow-xl p-6 transform transition-transform hover:scale-105 duration-300">
            <figure className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </figure>
            <h3 className="card-title text-xl font-semibold mb-3">Detailed Analytics</h3>
            <p className="text-sm text-neutral-content">
              Track your progress with insightful statistics, submission history, and
              performance analytics to identify strengths.
            </p> {/* <-- FIX 1: Was </E> */}
          </div>

          {/* Feature 4: Multi-Language Support */}
          <div className="card bg-base-100 shadow-xl p-6 transform transition-transform hover:scale-105 duration-300">
            <figure className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </figure>
            <h3 className="card-title text-xl font-semibold mb-3">Multi-Language Support</h3>
            <p className="text-sm text-neutral-content">
              Submit your solutions in a wide variety of popular programming
              languages like C++, Java, Python, and more.
            </p> {/* <-- FIX 2: Was </E> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;