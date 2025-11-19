import React from 'react';
import { Link } from 'react-router-dom';

const SmithAILogoDisplay = ({ size, textStyle }) => (
    <div className="flex flex-col items-center justify-center">
        <div className={`rounded-lg bg-blue-700 p-1 ${size}`}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21L12 12M12 12L16 8M12 12L8 8" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="6" r="3" fill="#FBBF24"/>
                <rect x="5" y="17" width="14" height="4" rx="1" fill="#E5E7EB"/>
            </svg>
        </div>
        <p className={`mt-0.5 font-bold text-base-content ${textStyle}`}>
            Smith AI
        </p>
    </div>
);

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-primary mb-3">
            About AlgoForge
          </h1>
          <p className="text-xl text-base-content/80">
            Forging the next generation of algorithmic thinkers.
          </p>
        </header>

        {/* Core Mission Section */}
        <section className="card bg-base-100 shadow-xl mb-12">
          <div className="card-body">
            <h2 className="card-title text-3xl text-secondary">Our Core Mission</h2>
            <p className="text-lg">
              AlgoForge is dedicated to providing a world-class platform for competitive programmers and developers to **practice, learn, and compete**. We believe that mastery of algorithms is built through consistent challenges and high-quality feedback. Our online judge is designed to be fast, fair, and reliable, helping you track your progress from beginner to expert.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-6">
                <div className="stat place-items-center">
                    <div className="stat-title">Practice</div>
                    <div className="stat-value text-primary">100+</div>
                    <div className="stat-desc">Unique problems</div>
                </div>
                <div className="stat place-items-center">
                    <div className="stat-title">Learn</div>
                    <div className="stat-value text-primary">Detailed</div>
                    <div className="stat-desc">Editorials and solutions</div>
                </div>
                <div className="stat place-items-center">
                    <div className="stat-title">Compete</div>
                    <div className="stat-value text-primary">Weekly</div>
                    <div className="stat-desc">Contests and Rankings</div>
                </div>
            </div>
          </div>
        </section>

        <section className="card bg-base-100 shadow-xl mb-12">
            <div className="card-body">
                <h2 className="card-title text-3xl text-secondary mb-4">Powered by Intelligent Technology</h2>
                
                <div className="flex flex-col md:flex-row items-start md:space-x-8">
                    <div className="md:w-1/2 mb-4 md:mb-0">
                        <h3 className="text-xl font-bold mb-2">The Online Judge</h3>
                        <p className="text-lg">
                            Our proprietary **Online Judge** system runs submissions in isolated sandboxes for maximum security and speed. We support all major programming languages and ensure accurate time and memory limiting to mimic real competitive environments.
                        </p>
                    </div>
                    
                    <div className="md:w-1/2">
                        <div className="flex items-center space-x-3 mb-2">
                            <SmithAILogoDisplay size="w-8 h-8" textStyle="text-xs" />
                            <h3 className="text-xl font-bold">Smith AI Tutor</h3>
                        </div>
                        <p className="text-lg">
                            **Smith AI** is your personal algorithmic tutor. Integrated directly into the problem-solving environment, Smith AI provides hints, explains error messages, and offers conceptual clarity without giving away the full solution. It's designed to guide your learning, not replace your effort.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        
        <section className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl text-secondary">Our Vision & Team</h2>
            <p className="text-lg mb-4">
              Our vision is to make complex algorithm practice accessible and engaging. AlgoForge was founded by a team of competitive programming veterans and software engineers who understand the journey from novice to master.
            </p>
            
            <h3 className="text-xl font-bold mb-2">Join the Forge</h3>
            <p className="mb-6">
                Ready to hone your skills? Start solving problems or check out our latest contests!
            </p>

            <div className="card-actions justify-end">
                <Link to="/problems" className="btn btn-primary btn-lg">Start Practicing</Link>
                <Link to="/contests" className="btn btn-outline btn-lg">View Contests</Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;