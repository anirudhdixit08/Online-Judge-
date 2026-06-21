import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../../../utils/axiosClient';
import { toast } from 'react-hot-toast';

import DescriptionTab from './DescriptionTab';
import EditorialTab from './EditorialTab';
import SolutionsTab from './SolutionsTab';
import SubmissionsTab from './SubmissionsTab';
import AiTutorTab from './AiTutorTab';

const LeftPanel = () => {
  const { id: problemId } = useParams();
  const { isAuthenticated } = useSelector(state => state.auth);

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/${problemId}`);
        setProblem(response.data);
      } catch (error) {
        toast.error("Failed to fetch problem.");
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'description':
        return <DescriptionTab problem={problem} />;
      case 'editorial':
        return <EditorialTab />;
      case 'solutions':
        return <SolutionsTab solutions={problem.referenceCode} />;
      case 'submissions':
        return <SubmissionsTab problemId={problem._id} />;
      case 'ai': // 2. Add the case for the AI tab
        return <AiTutorTab problem={problem} />;
      default:
        return <DescriptionTab problem={problem} />;
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full lg:w-1/2 flex justify-center items-center bg-base-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!problem) {
    return <div className="h-full w-full lg:w-1/2 p-8 bg-base-100">Problem not found.</div>;
  }

  const tabClass = (tab) =>
    `h-11 border-b-2 px-3 text-sm font-semibold transition-colors ${
      activeTab === tab
        ? 'border-primary text-primary'
        : 'border-transparent text-base-content/65 hover:text-base-content'
    }`;

  return (
    <div className="h-full min-h-0 w-full lg:w-1/2 flex flex-col bg-base-100">
      <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-base-300 bg-base-200/70 px-3">
        <button 
          className={tabClass('description')}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        
        <button 
          className={tabClass('ai')}
          onClick={() => setActiveTab('ai')}
        >
          Smith AI
        </button>

        <button 
          className={tabClass('editorial')}
          onClick={() => setActiveTab('editorial')}
        >
          Editorial
        </button>
        <button 
          className={tabClass('solutions')}
          onClick={() => setActiveTab('solutions')}
        >
          Solutions
        </button>
        {isAuthenticated && (
          <button 
            className={tabClass('submissions')}
            onClick={() => setActiveTab('submissions')}
          >
            My Submissions
          </button>
        )}
      </div>
      
      <div className="min-h-0 flex-1 overflow-y-auto bg-base-100 px-4 py-5 md:px-6">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default LeftPanel;
