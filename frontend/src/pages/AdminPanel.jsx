// import React, { useState, useEffect } from 'react';
// import axiosClient from '../utils/axiosClient';
// import ProblemList from '../components/admin/ProblemList';
// import ProblemForm from '../components/admin/ProblemForm';

// // This is the prompt component from your screenshot
// const SelectProblemPrompt = () => (
//   <div className="flex h-full items-center justify-center rounded-lg bg-base-100 shadow-xl">
//     <div className="text-center">
//       <h2 className="text-2xl font-bold">Select a Problem</h2>
//       <p className="mt-2 text-base-content/70">
//         Choose a problem from the list to edit, or create a new one.
//       </p>
//     </div>
//   </div>
// );

// const AdminPanel = () => {
//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const [currentView, setCurrentView] = useState({ mode: 'prompt', problemId: null });

//   // Function to fetch all problems for the list
//   const fetchProblems = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosClient.get('/problem/all-problems');
//       setProblems(response.data);
//     } catch (err) {
//       setError('Failed to fetch problem list.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProblems();
//   }, []);

//   // (Your handlers: handleCreateNew, handleSelectProblem, handleCancel, handleSuccess...)
//   const handleCreateNew = () => {
//     setCurrentView({ mode: 'create', problemId: null });
//   };
//   const handleSelectProblem = (id) => {
//     setCurrentView({ mode: 'edit', problemId: id });
//   };
//   const handleCancel = () => {
//     setCurrentView({ mode: 'prompt', problemId: null });
//   };
//   const handleSuccess = () => {
//     fetchProblems();
//     setCurrentView({ mode: 'prompt', problemId: null });
//   };


//   const renderRightPanel = () => {
//     switch (currentView.mode) {
//       case 'create':
//         return (
//           <ProblemForm 
//             mode="create" 
//             onSuccess={handleSuccess} 
//             onCancel={handleCancel} 
//           />
//         );
//       case 'edit':
//         return (
//           <ProblemForm 
//             mode="edit" 
//             problemId={currentView.problemId} 
//             onSuccess={handleSuccess} 
//             onCancel={handleCancel}
//             onDelete={handleSuccess}
//           />
//         );
//       default:
//         return <SelectProblemPrompt />;
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8">
//       <h1 className="text-3xl font-bold mb-6">All your created problems — manage, edit, or delete them here</h1>
      
//       {/* --- THIS IS THE FIX --- */}
//       {/* Removed h-[80vh] to allow the grid to grow naturally */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Left Column: Problem List */}
//         {/* Set a min-height for aesthetics, but allow it to grow */}
//         <div className="lg:col-span-1 h-full min-h-[600px]">
//           <ProblemList
//             problems={problems}
//             isLoading={loading}
//             error={error}
//             selectedProblemId={currentView.problemId}
//             onCreateNew={handleCreateNew}
//             onSelectProblem={handleSelectProblem}
//           />
//         </div>

//         {/* Right Column: Form or Prompt */}
//         <div className="lg:col-span-2 h-full min-h-[600px]">
//           {renderRightPanel()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;

import React, { useState } from 'react';
import ProblemManagement from '../components/admin/ProblemManagement';
import AdminManagement from '../components/admin/AdminManagement';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' or 'admins'

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* --- Tab Navigation --- */}
      <div className="tabs tabs-boxed mb-6">
        <button 
          className={`tab tab-lg ${activeTab === 'problems' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('problems')}
        >
          Manage Problems
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'admins' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          Manage Admins
        </button>
      </div>

      {/* --- Tab Content --- */}
      <div>
        {activeTab === 'problems' && <ProblemManagement />}
        {activeTab === 'admins' && <AdminManagement />}
      </div>
    </div>
  );
};

export default AdminPanel;