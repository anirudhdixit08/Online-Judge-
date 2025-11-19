import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  const effectiveDate = "November 19, 2025";
  const platformName = "AlgoForge";
  
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            Terms of Use
          </h1>
          <p className="text-lg text-base-content/70">
            Last Updated: {effectiveDate}
          </p>
        </header>

        <div className="card bg-base-100 shadow-2xl p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using the {platformName} platform, you agree to be bound by these **Terms of Use** and all policies referenced herein. If you do not agree to all of these terms, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-3">2. User Accounts</h2>
            <p>
              You must be at least 13 years old to use the Service. You are responsible for maintaining the confidentiality of your account password and are fully responsible for all activities that occur under your account. You agree to notify {platformName} immediately of any unauthorized use of your password or account.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-3">3. Prohibited Conduct</h2>
            <p>
              You agree not to engage in any prohibited activities, including, but not limited to:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
              <li>**Cheating:** Submitting solutions that were not written primarily by you during a contest, or sharing solutions publicly during an active contest.</li>
              <li>**Plagiarism:** Submitting another user's code as your own without proper attribution outside of contests, or submitting copyrighted material.</li>
              <li>**Misuse of the Judge:** Attempting to exploit vulnerabilities in the Online Judge or submitting malicious code designed to harm the system.</li>
              <li>**Harassment:** Engaging in any form of harassment, hate speech, or abuse against other users or staff.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-3">4. Intellectual Property</h2>
            <p>
              **AlgoForge Content:** All content on {platformName}, including problem statements, editorials, and the site design, is the property of {platformName} or its licensors.
            </p>
            <p className="mt-2">
              **User Submissions:** You retain all ownership rights to the code you submit. However, by submitting code, you grant {platformName} a worldwide, non-exclusive, royalty-free, perpetual license to use, reproduce, modify, adapt, publish, and distribute your code solely for the purposes of operating, developing, and improving the {platformName} platform (e.g., testing, anti-cheating measures, and displaying public submissions).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-3">5. Disclaimer and Limitation of Liability</h2>
            <p>
              The {platformName} service is provided on an **"as is"** basis. We make no warranties regarding the accuracy or reliability of the Online Judge results, and we are not liable for any damages arising from your use of the platform.
            </p>
            <p className="mt-2">
              **Termination:** {platformName} may terminate or suspend your access immediately, without prior notice, for any violation of these Terms, particularly cheating or misuse of the platform.
            </p>
          </section>
          
          <div className="border-t border-base-200 pt-6 mt-6">
            <p className="text-sm text-center">
              Questions about these Terms should be sent to us via our{' '}
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

export default TermsOfUse;