import React, { useState } from 'react';
import ProblemManagement from '../components/admin/ProblemManagement';
import AdminManagement from '../components/admin/AdminManagement';
import EditorialManagement from '../components/admin/EditorialManagement'; 

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('problems');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

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
        <button 
          className={`tab tab-lg ${activeTab === 'editorials' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('editorials')}
        >
          Manage Editorials
        </button>
      </div>

      <div>
        {activeTab === 'problems' && <ProblemManagement />}
        {activeTab === 'admins' && <AdminManagement />}
        {activeTab === 'editorials' && <EditorialManagement />}
      </div>
    </div>
  );
};

export default AdminPanel;