import React from 'react';
import { Link } from 'react-router-dom';




const NotFound = () => {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center text-center px-4">
            <div className="max-w-xl w-full p-10 bg-base-100 rounded-2xl shadow-2xl space-y-6">
                
                <h1 className="text-8xl font-extrabold text-primary mb-3">
                    404
                </h1>

                <h2 className="text-3xl font-bold text-base-content">
                    Page Not Found
                </h2>

                <p className="text-lg text-base-content/80">
                    Oops! The page you were looking for doesn't exist. It might have been moved, deleted, or you might have typed the URL incorrectly.
                </p>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                    
                    <Link to="/" className="btn btn-primary btn-lg font-bold">
                        Go Home
                    </Link>
                    
                    <Link to="/problems" className="btn btn-outline btn-lg font-bold">
                        Find a Problem
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;