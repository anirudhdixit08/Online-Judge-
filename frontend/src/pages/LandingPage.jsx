
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <section className="border-b border-base-300 bg-base-300">
        <div className="mx-auto grid min-h-[58vh] max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 md:py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center lg:text-left">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">AlgoForge Online Judge</p>
            <h1 className="text-4xl font-bold leading-tight text-base-content sm:text-5xl lg:text-[3.45rem]">
              Sharpen Your Coding Skills.
              <span className="block text-primary-focus">Compete and Conquer.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-base-content/75 md:text-lg lg:mx-0">
              The ultimate platform for competitive programming. Solve challenges, join
              contests, and climb the leaderboard to prove your mettle.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link to="/signup" className="btn btn-primary btn-lg px-7 shadow-none">
                Explore Problems
              </Link>
              <Link to="/signup" className="btn btn-outline btn-lg px-7 hover:bg-base-100/60">
                Join a Contest
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-base-300 bg-base-100/70 p-4 text-left">
            <div className="mb-4 flex items-center justify-between border-b border-base-300 pb-3">
              <div>
                <p className="text-sm font-semibold text-base-content">Today's Practice</p>
                <p className="text-xs text-base-content/60">Focused problems and progress</p>
              </div>
              <span className="badge badge-primary badge-outline">Live</span>
            </div>
            <div className="space-y-3">
              {[
                ['Array Rotation', 'Easy', 'text-success'],
                ['Graph Shortest Path', 'Medium', 'text-warning'],
                ['Dynamic Programming Grid', 'Hard', 'text-error'],
              ].map(([title, level, color]) => (
                <div key={title} className="flex items-center justify-between rounded-md border border-base-300 bg-base-200/60 px-4 py-3">
                  <div>
                    <p className="font-semibold leading-tight">{title}</p>
                    <p className={`mt-1 text-xs font-semibold ${color}`}>{level}</p>
                  </div>
                  <span className="text-xs text-base-content/50">Solve</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-base-300 pt-4 text-xs text-base-content/65">
              <div className="rounded-md bg-base-200/50 px-3 py-2">Pick</div>
              <div className="rounded-md bg-base-200/50 px-3 py-2">Solve</div>
              <div className="rounded-md bg-base-200/50 px-3 py-2">Submit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why CodeArena Section */}
      <section className="border-b border-base-300 bg-base-200 py-12 md:py-14">
        <div className="px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-base-content">
          Why AlgoForge?
        </h2>
        <p className="text-base mb-9 text-base-content/70">
          Everything you need to become a top-tier programmer.
        </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Feature 1: Vast Problem Library */}
          <div className="card bg-base-100 p-5 transition hover:border-primary/40">
            <figure className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </figure>
            <h3 className="card-title justify-center text-base font-semibold mb-2">Vast Problem Library</h3>
            <p className="text-sm leading-6 text-base-content/70">
              Access thousands of problems ranging from beginner to expert,
              covering numerous data structures and algorithms.
            </p>
          </div>

          {/* Feature 2: Live Contests */}
          <div className="card bg-base-100 p-5 transition hover:border-primary/40">
            <figure className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </figure>
            <h3 className="card-title justify-center text-base font-semibold mb-2">Live Contests</h3>
            <p className="text-sm leading-6 text-base-content/70">
              Participate in real-time coding contests. Test your speed and
              accuracy against programmers worldwide.
            </p>
          </div>

          {/* Feature 3: Detailed Analytics */}
          <div className="card bg-base-100 p-5 transition hover:border-primary/40">
            <figure className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </figure>
            <h3 className="card-title justify-center text-base font-semibold mb-2">Detailed Analytics</h3>
            <p className="text-sm leading-6 text-base-content/70">
              Track your progress with insightful statistics, submission history, and
              performance analytics to identify strengths.
            </p>
          </div>

          {/* Feature 4: Multi-Language Support */}
          <div className="card bg-base-100 p-5 transition hover:border-primary/40">
            <figure className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </figure>
            <h3 className="card-title justify-center text-base font-semibold mb-2">Multi-Language Support</h3>
            <p className="text-sm leading-6 text-base-content/70">
              Submit your solutions in a wide variety of popular programming
              languages like C++, C, Javascript, Java, Python, and more.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
