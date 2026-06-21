import React from 'react';

// This is the navbar for the right panel
const RightPanelTabs = ({ activeTab, onTabChange, runResult, submitResult }) => {
  const tabClass = (tab) =>
    `h-11 border-b-2 px-3 text-sm font-semibold transition-colors ${
      activeTab === tab
        ? 'border-primary text-primary'
        : 'border-transparent text-base-content/65 hover:text-base-content'
    }`;

  return (
    <div className="flex shrink-0 items-center gap-1 border-b border-base-300 bg-base-200/70 px-3">
      <button 
        className={tabClass('code')}
        onClick={() => onTabChange('code')}
      >
        Code
      </button>
      <button 
        className={tabClass('testcase')}
        onClick={() => onTabChange('testcase')}
      >
        Testcase
      </button>
      {(runResult || submitResult) && (
        <button 
          className={tabClass('result')}
          onClick={() => onTabChange('result')}
        >
          Result
        </button>
      )}
    </div>
  );
};

export default RightPanelTabs;
