import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const RecentActivity = () => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/user/recent-activity');
        setActivity(response.data);
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'accepted') return 'text-success';
    if (status === 'wrong answer') return 'text-error';
    return 'text-warning';
  };

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      
      {loading && <span className="loading loading-spinner loading-md"></span>}
      
      {!loading && activity.length === 0 && (
        <p className="text-base-content/70">No recent submissions found.</p>
      )}

      {!loading && activity.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table">
            <tbody>
              {activity.map((sub) => (
                <tr key={sub._id} className="hover">
                  <td className="p-4">
                    <Link to={`/problem/${sub.problemId._id}`} className="font-semibold link link-hover">
                      {sub.problemId.title}
                    </Link>
                  </td>
                  <td className={`p-4 font-semibold ${getStatusColor(sub.status)}`}>
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </td>
                  <td className="p-4 text-right text-base-content/70 text-sm">
                    {timeAgo(sub.createdAt)}
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

export default RecentActivity;