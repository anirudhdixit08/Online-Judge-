// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import axiosClient from '../../../utils/axiosClient';
// import { toast } from 'react-hot-toast';

// import DescriptionTab from './DescriptionTab';
// import EditorialTab from './EditorialTab';
// import SolutionsTab from './SolutionsTab';
// import SubmissionsTab from './SubmissionsTab';

// const LeftPanel = () => {
//   const { id: problemId } = useParams();
//   const { isAuthenticated } = useSelector(state => state.auth);

//   const [problem, setProblem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('description');

//   useEffect(() => {
//     const fetchProblem = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosClient.get(`/problem/${problemId}`);
//         setProblem(response.data);
//       } catch (error) {
//         toast.error("Failed to fetch problem.");
//         console.error('Error fetching problem:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblem();
//   }, [problemId]);

//   const renderActiveTab = () => {
//     switch (activeTab) {
//       case 'description':
//         return <DescriptionTab problem={problem} />;
//       case 'editorial':
//         return <EditorialTab />;
//       case 'solutions':
//         return <SolutionsTab solutions={problem.referenceCode} />;
//       case 'submissions':
//         return <SubmissionsTab problemId={problem._id} />;
//       default:
//         return <DescriptionTab problem={problem} />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="w-full lg:w-1/2 h-full flex justify-center items-center">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   if (!problem) {
//     return <div className="w-full lg:w-1/2 h-full p-8">Problem not found.</div>;
//   }

//   return (
//     <div className="w-full lg:w-1/2 h-full flex flex-col">
//       {/* --- Tab Navigation --- */}
//       <div className="tabs tabs-bordered bg-base-200 px-4">
//         <button 
//           className={`tab ${activeTab === 'description' ? 'tab-active' : ''}`}
//           onClick={() => setActiveTab('description')}
//         >
//           Description
//         </button>
//         <button 
//           className={`tab ${activeTab === 'editorial' ? 'tab-active' : ''}`}
//           onClick={() => setActiveTab('editorial')}
//         >
//           Editorial
//         </button>
//         <button 
//           className={`tab ${activeTab === 'solutions' ? 'tab-active' : ''}`}
//           onClick={() => setActiveTab('solutions')}
//         >
//           Solutions
//         </button>
//         {isAuthenticated && (
//           <button 
//             className={`tab ${activeTab === 'submissions' ? 'tab-active' : ''}`}
//             onClick={() => setActiveTab('submissions')}
//           >
//             My Submissions
//           </button>
//         )}
//       </div>
      
//       {/* --- Tab Content --- */}
//       <div className="flex-1 overflow-y-auto p-6 bg-base-100">
//         {renderActiveTab()}
//       </div>
//     </div>
//   );
// };

// export default LeftPanel;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../../../utils/axiosClient';
import { toast } from 'react-hot-toast';

// Import the tab content components
import DescriptionTab from './DescriptionTab';
import EditorialTab from './EditorialTab';
import SolutionsTab from './SolutionsTab';
import SubmissionsTab from './SubmissionsTab';
import AiTutorTab from './AiTutorTab'; // 1. Import your new AI tab

const LeftPanel = () => {
  const { id: problemId } = useParams();
  const { isAuthenticated } = useSelector(state => state.auth);

  // --- State for this component ---
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  // --- Data Fetching ---
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

  // --- Render Logic ---
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
      <div className="w-full lg:w-1/2 h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!problem) {
    return <div className="w-full lg:w-1/2 h-full p-8">Problem not found.</div>;
  }

  return (
    <div className="w-full lg:w-1/2 h-full flex flex-col">
      {/* --- Tab Navigation --- */}
      <div className="tabs tabs-bordered bg-base-200 px-4">
        <button 
          className={`tab ${activeTab === 'description' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        
        {/* 3. Add the AI tab button */}
        <button 
          className={`tab ${activeTab === 'ai' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          AI ✨
        </button>

        <button 
          className={`tab ${activeTab === 'editorial' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('editorial')}
        >
          Editorial
        </button>
        <button 
          className={`tab ${activeTab === 'solutions' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('solutions')}
        >
          Solutions
        </button>
        {isAuthenticated && (
          <button 
            className={`tab ${activeTab === 'submissions' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            My Submissions
          </button>
        )}
      </div>
      
      {/* --- Tab Content --- */}
      <div className="flex-1 overflow-y-auto p-6 bg-base-100">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default LeftPanel;