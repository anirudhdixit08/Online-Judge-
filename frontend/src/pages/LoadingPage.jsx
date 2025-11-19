import React from 'react';
import { useLocation } from 'react-router-dom';

const AlgoForgeLogo = ({ className }) => (
    <img 
        src="/logo.svg" 
        alt="AlgoForge Logo" 
        className={className} 
    />
);


const LoadingPage = ({ message = "Loading AlgoForge..." }) => {
    const location = useLocation();
    
    const contextMessage = location.pathname.includes('/login') 
        ? "Authenticating and preparing dashboard..." 
        : message;

    return (
        <div className="fixed inset-0 z-9999 bg-base-100 flex flex-col items-center justify-center p-6">
            
            <div className="mb-6 animate-bounce">
                <AlgoForgeLogo className="w-16 h-16 text-primary" />
            </div>

            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>

            <p className="text-xl font-semibold text-base-content/80 mb-2">
                {contextMessage}
            </p>

            <p className="text-sm text-base-content/60">
                Please wait a moment while we load resources.
            </p>
        </div>
    );
};

export default LoadingPage;