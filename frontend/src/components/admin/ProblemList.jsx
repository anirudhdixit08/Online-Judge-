
import React from 'react';

const ProblemList = ({ 
  problems, 
  isLoading, 
  error, 
  selectedProblemId, 
  onCreateNew, 
  onSelectProblem 
}) => {
  
  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'text-success';
    if (diff === 'Medium') return 'text-warning';
    if (diff === 'Hard') return 'text-error';
    return 'text-base-content';
  };

  return (
    <div className="card bg-base-100 shadow-xl h-full flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-base-300">
        <h2 className="card-title">Manage Problems</h2>
        <button className="btn btn-sm btn-primary" onClick={onCreateNew}>
          + New
        </button>
      </div>

      <div className="card-body p-0 overflow-y-auto">
        {isLoading && <span className="loading loading-spinner m-auto"></span>}
        {error && <div className="alert alert-error m-4">{error}</div>}
        
        {!isLoading && !error && (
          <ul className="menu p-0">
            {problems.map((prob) => (
              <li key={prob._id}>
                <button 
                  className={`flex justify-between items-center w-full p-4 rounded-none ${prob._id === selectedProblemId ? 'active' : ''}`}
                  onClick={() => onSelectProblem(prob._id)}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold">{prob.title}</span>
                    <span className={`text-sm ${getDifficultyColor(prob.difficulty)}`}>
                      {prob.difficulty}
                    </span>
                  </div>
                  {prob._id === selectedProblemId && (
                    <span className="text-base-content/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProblemList;