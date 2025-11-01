import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient'; // Import your axios instance

const ProblemOfTheDay = () => {
  const [potd, setPotd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPotdData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get('/problem/potd');
        setPotd(response.data.problem);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch problem');
      } finally {
        setLoading(false);
      }
    };

    fetchPotdData();
  }, []); 

  const renderContent = () => {
    if (loading) {
      return <span className="loading loading-spinner loading-md"></span>;
    }

    if (error) {
      return <div className="text-error">{error}</div>;
    }

    if (potd) {
      return (
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">{potd.title}</h3>
            <div className="flex gap-2 mt-2">
              <span className="badge badge-accent">{potd.difficulty}</span>
              <span className="badge badge-outline">{potd.tags.join(', ')}</span>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to={`/problem/${potd._id}`} className="btn btn-primary">
              View Problem
            </Link>
          </div>
        </div>
      );
    }

    return <p>Problem of the Day not set yet.</p>;
  };

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h2 className="text-xl font-bold mb-4">Problem of the Day</h2>
      <p className="text-sm text-base-content/70 mb-4">
        A fresh challenge for you every day!
      </p>
      {renderContent()}
    </div>
  );
};

export default ProblemOfTheDay;