import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const effectiveDate = "November 19, 2025";
  const platformName = "AlgoForge";
  
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            Privacy Policy
          </h1>
          <p className="text-lg text-base-content/70">
            Effective Date: {effectiveDate}
          </p>
        </header>

        <div className="card bg-base-100 shadow-2xl p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-3">1. Introduction and Data Controller</h2>
            <p>
              This Privacy Policy explains how **{platformName}** collects, uses, discloses, and protects your information when you use our online competitive programming platform. By using the Service, you consent to the data practices described in this policy.
            </p>
            <p className="mt-2">
              **Data Controller:** AlgoForge Team
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-3">2. Information We Collect</h2>
            <p>We collect information primarily to provide, maintain, and improve our services.</p>
            
            <h3 className="text-xl font-bold mt-4 mb-2">A. Personal Information (Account Data)</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-base-content/90">
              <li>**Registration Data:** Username, Email Address, First and Last Name.</li>
              <li>**Authentication Data:** Hashed passwords and session tokens (cookies).</li>
              <li>**Profile Data:** Optional profile photos and user biographies.</li>
            </ul>

            <h3 className="text-xl font-bold mt-4 mb-2">B. Usage Data (Platform Activity)</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-base-content/90">
              <li>**Submission Data:** Your code submissions, language used, compilation status, execution time, and memory usage.</li>
              <li>**Performance Metrics:** Contest scores, problem solved counts, and ranking data.</li>
              <li>**Chat Data:** Interactions with our **Smith AI Tutor** (used to improve AI performance and quality of assistance).</li>
              <li>**Technical Data:** IP address, browser type, operating system, and access times.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-3">3. How We Use Your Information</h2>
            <p>Your data is essential for:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2 text-base-content/90">
              <li>**Service Provision:** Running your code on the Online Judge and displaying contest rankings.</li>
              <li>**Security and Integrity:** Analyzing submissions to prevent cheating and maintaining the security of the platform.</li>
              <li>**Personalization:** Providing tailored problem recommendations and tracking your learning progress.</li>
              <li>**Communication:** Sending essential service announcements and password reset links.</li>
              <li>**AI Improvement:** Your conversations with **Smith AI** are analyzed (anonymously where possible) to train and improve its ability to provide helpful coding assistance.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-3">4. Data Storage and Sharing</h2>
            <p>
              **Storage:** We store your data on secure cloud servers. We take reasonable steps to protect your personal information from unauthorized access, alteration, or disclosure.
            </p>
            <p className="mt-2">
              **Sharing:** We **do not** sell your personal data. We may share information with trusted third-party service providers (e.g., cloud hosting, email delivery) only as necessary to operate the platform and subject to strict confidentiality agreements.
            </p>
            <p className="mt-2 text-warning font-semibold">
              Note: Your **Username, Profile Photo, and Submission Status (AC/WA/etc.)** are displayed publicly on leaderboards and profile pages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-3">5. Your Data Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2 text-base-content/90">
              <li>**Access:** Request a copy of the personal data we hold about you.</li>
              <li>**Correction:** Request correction of any inaccurate or incomplete data.</li>
              <li>**Deletion:** Request deletion of your account and associated data (subject to legal retention requirements).</li>
            </ul>
          </section>

          <div className="border-t border-base-200 pt-6 mt-6">
            <p className="text-sm text-center">
              If you have questions or wish to exercise your data rights, please contact us via our{' '}
              <Link to="/contact" className="link link-hover text-primary font-semibold">
                Contact Page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;