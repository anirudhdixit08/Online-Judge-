import React from 'react';
import { useSelector } from 'react-redux'; 
import Dashboard from '../components/dashboard/Dashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const Homepage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-4 md:p-8 bg-base-200 min-h-screen">
      {user?.role === 'admin' ? <AdminDashboard /> : <Dashboard />}

    </div>
  );
};

export default Homepage;