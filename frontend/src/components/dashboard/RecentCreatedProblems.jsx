import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const getDifficultyColor = (diff) => {
  if (diff === 'Easy') return 'text-success';
  if (diff === 'Medium') return 'text-warning';
  if (diff === 'Hard') return 'text-error';
  return 'text-base-content';
};

const RecentCreatedProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/user/recent-created-problems');
        setProblems(response.data);
      } catch (err) {
        console.error("Failed to fetch recent problems:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h2 className="text-xl font-bold mb-4">Recent Created Problems</h2>
      
      {loading && <span className="loading loading-spinner loading-md"></span>}
      
      {!loading && problems.length === 0 && (
        <p className="text-base-content/70">No problems have been created yet.</p>
      )}

      {!loading && problems.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table">
            <tbody>
              {problems.map((prob) => (
                <tr key={prob._id} className="hover">
                  {/* Problem Title & Difficulty */}
                  <td className="p-4">
                    <Link to={`/problem/${prob._id}`} className="font-semibold link link-hover">
                      {prob.title}
                    </Link>
                    <div className={`text-sm ${getDifficultyColor(prob.difficulty)}`}>
                      {prob.difficulty}
                    </div>
                  </td>
                  {/* Time */}
                  <td className="p-4 text-right text-base-content/70 text-sm">
                    {timeAgo(prob.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentCreatedProblems;