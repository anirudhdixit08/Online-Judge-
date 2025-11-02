

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