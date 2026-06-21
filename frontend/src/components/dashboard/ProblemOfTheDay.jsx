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
      return (
        <div className="flex h-20 items-center justify-center rounded-md border border-base-300 bg-base-200/50">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      );
    }

    if (error) {
      return <div className="alert alert-error text-sm">{error}</div>;
    }

    if (potd) {
      return (
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center rounded-md border border-base-300 bg-base-200/40 p-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-snug">{potd.title}</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="badge badge-accent">{potd.difficulty}</span>
              <span className="badge badge-outline max-w-full truncate">{potd.tags.join(', ')}</span>
            </div>
          </div>
          <div className="sm:shrink-0">
            <Link to={`/problem/${potd._id}`} className="btn btn-primary w-full sm:w-auto">
              View Problem
            </Link>
          </div>
        </div>
      );
    }

    return <p className="rounded-md bg-base-200/70 p-4 text-sm text-base-content/70">Problem of the Day not set yet.</p>;
  };

  return (
    <div className="card bg-base-100 p-5">
      <h2 className="text-lg font-bold mb-1">Problem of the Day</h2>
      <p className="text-sm text-base-content/65 mb-4 leading-6">
        A fresh challenge for you every day!
      </p>
      {renderContent()}
    </div>
  );
};

export default ProblemOfTheDay;
