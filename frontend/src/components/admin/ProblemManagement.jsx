import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import ProblemList from './ProblemList';
import ProblemForm from './ProblemForm';

// This is the prompt component
const SelectProblemPrompt = () => (
  <div className="flex h-full items-center justify-center rounded-lg bg-base-100 shadow-xl">
    <div className="text-center">
      <h2 className="text-2xl font-bold">Select a Problem</h2>
      <p className="mt-2 text-base-content/70">
        Choose a problem from the list to edit, or create a new one.
      </p>
    </div>
  </div>
);

const ProblemManagement = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState({ mode: 'prompt', problemId: null });

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/problem/all-problems');
      setProblems(response.data);
    } catch (err) {
      setError('Failed to fetch problem list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleCreateNew = () => {
    setCurrentView({ mode: 'create', problemId: null });
  };

  const handleSelectProblem = (id) => {
    setCurrentView({ mode: 'edit', problemId: id });
  };
  
  const handleCancel = () => {
    setCurrentView({ mode: 'prompt', problemId: null });
  };
  
  const handleSuccess = () => {
    fetchProblems();
    setCurrentView({ mode: 'prompt', problemId: null });
  };

  const renderRightPanel = () => {
    switch (currentView.mode) {
      case 'create':
        return (
          <ProblemForm 
            mode="create" 
            onSuccess={handleSuccess} 
            onCancel={handleCancel} 
          />
        );
      case 'edit':
        return (
          <ProblemForm 
            mode="edit" 
            problemId={currentView.problemId} 
            onSuccess={handleSuccess} 
            onCancel={handleCancel}
            onDelete={handleSuccess}
          />
        );
      default:
        return <SelectProblemPrompt />;
    }
  };

  return (
    // Removed fixed height to let the page flow
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 h-full min-h-[600px]">
        <ProblemList
          problems={problems}
          isLoading={loading}
          error={error}
          selectedProblemId={currentView.problemId}
          onCreateNew={handleCreateNew}
          onSelectProblem={handleSelectProblem}
        />
      </div>
      <div className="lg:col-span-2 h-full min-h-[600px]">
        {renderRightPanel()}
      </div>
    </div>
  );
};

export default ProblemManagement;