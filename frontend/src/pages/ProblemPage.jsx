import React from 'react';
import LeftPanel from '../components/problemSolving/leftPanel/LeftPanel';
import RightPanel from '../components/problemSolving/rightPanel/RightPanel';

const ProblemPage = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-0 flex-col overflow-hidden bg-base-200 lg:flex-row">
      
      <LeftPanel />
      
      <RightPanel />

    </div>
  );
};

export default ProblemPage;
