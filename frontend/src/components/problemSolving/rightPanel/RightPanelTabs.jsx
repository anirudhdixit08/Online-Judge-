import React from 'react';

// This is the navbar for the right panel
const RightPanelTabs = ({ activeTab, onTabChange, runResult, submitResult }) => {
  return (
    <div className="tabs tabs-bordered bg-base-200 px-4">
      <button 
        className={`tab ${activeTab === 'code' ? 'tab-active' : ''}`}
        onClick={() => onTabChange('code')}
      >
        Code
      </button>
      <button 
        className={`tab ${activeTab === 'testcase' ? 'tab-active' : ''}`}
        onClick={() => onTabChange('testcase')}
      >
        Testcase
      </button>
      {(runResult || submitResult) && (
        <button 
          className={`tab ${activeTab === 'result' ? 'tab-active' : ''}`}
          onClick={() => onTabChange('result')}
        >
          Result
        </button>
      )}
    </div>
  );
};

export default RightPanelTabs;