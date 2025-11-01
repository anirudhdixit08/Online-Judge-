import React from 'react';
import { useSelector } from 'react-redux';

const WelcomeBanner = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="card bg-base-100 shadow-xl p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold">
        Welcome back, {user?.firstName || user?.userName}!
      </h1>
      <p className="mt-2 text-base-content/70">
        Ready to tackle a new challenge? Every problem you solve makes you a better programmer.
      </p>
    </div>
  );
};

export default WelcomeBanner;