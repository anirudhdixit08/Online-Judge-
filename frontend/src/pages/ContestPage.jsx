import React from 'react';

const ContestPage = () => {
  return (
    // Use 'hero' to center the content vertically and horizontally
    <div className="hero min-h-[calc(100vh-200px)] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          {/* Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          
          <h1 className="text-5xl font-bold mt-6">Coming Soon!</h1>
          <p className="py-6 text-lg">
            We are working hard to bring you exciting new contests. Please check back later!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContestPage;