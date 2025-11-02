import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
);
const PercentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7zM10.5 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-7.5-6l6 6" /></svg>
);
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);

const AdminStatsOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/user/dashboard-stats');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl p-6 h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h2 className="text-xl font-bold mb-6">Your Stats</h2>
      <div className="space-y-6">
        
        <div className="flex items-center">
          <div className="p-3 bg-success/20 text-success rounded-full">
            <CheckIcon />
          </div>
          <div className="ml-4">
            <div className="text-base-content/70 text-sm">Problems Solved</div>
            <div className="text-2xl font-bold">{stats?.problemsSolved || 0}</div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="p-3 bg-info/20 text-info rounded-full">
            <ListIcon />
          </div>
          <div className="ml-4">
            <div className="text-base-content/70 text-sm">Total Submissions</div>
            <div className="text-2xl font-bold">#{stats?.totalSubmissions || 0}</div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="p-3 bg-warning/20 text-warning rounded-full">
            <PercentIcon />
          </div>
          <div className="ml-4">
            <div className="text-base-content/70 text-sm">Total Acceptance Rate</div>
            <div className="text-2xl font-bold">{stats?.acceptanceRate || 0}%</div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="p-3 bg-accent/20 text-accent rounded-full">
            <UploadIcon />
          </div>
          <div className="ml-4">
            <div className="text-base-content/70 text-sm">Problems Created</div>
            <div className="text-2xl font-bold">{stats?.problemsCreated || 0}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminStatsOverview;