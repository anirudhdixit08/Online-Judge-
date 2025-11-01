import React from 'react';
import WelcomeBanner from './WelcomeBanner';
import ProblemOfTheDay from './ProblemOfTheDay';
import StatsOverview from './StatsOverview';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <WelcomeBanner />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ProblemOfTheDay />
          <RecentActivity />
        </div>

        <div className="lg:col-span-1">
          <StatsOverview />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;