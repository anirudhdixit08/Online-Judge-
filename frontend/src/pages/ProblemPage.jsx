import React from 'react';
import LeftPanel from '../components/problemSolving/leftPanel/LeftPanel';
import RightPanel from '../components/problemSolving/rightPanel/RightPanel';

const ProblemPage = () => {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]"> {/* 80px = approx navbar height */}
      
      <LeftPanel />
      
      <RightPanel />

    </div>
  );
};

export default ProblemPage;