import React, { useState, useEffect } from 'react';
import axiosClient from '../../../utils/axiosClient';
import Editor from '@monaco-editor/react';

// Helper to format "time ago"
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

const SubmissionsTab = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/problem/submissions/${problemId}`);
        setSubmissions(response.data);
      } catch (err) {
        setError('Failed to fetch submission history.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    if (status === 'accepted') return 'text-success';
    if (status === 'wrong answer') return 'text-error';
    return 'text-warning'; // for 'error' or 'pending'
  };

  const handleViewCode = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
  };

  if (loading) {
    return <span className="loading loading-spinner"></span>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (submissions.length === 0) {
    return <div>You have not made any submissions for this problem yet.</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* --- 1. UPDATED TABLE HEAD --- */}
          <thead>
            <tr>
              <th>Status</th>
              <th>Language</th>
              <th>Runtime</th>
              <th>Memory</th>
              <th>Test Cases</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr 
                key={sub._id} 
                className="hover cursor-pointer"
                onClick={() => handleViewCode(sub)}
              >
                {/* --- 2. UPDATED TABLE BODY --- */}
                <td className={`font-semibold ${getStatusColor(sub.status)}`}>
                  {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                </td>
                <td>{sub.language}</td>
                {/* Convert runtime (seconds) to ms */}
                <td>{(sub.runtime * 1000).toFixed(0)} ms</td>
                <td>{sub.memory.toFixed(1)} KB</td>
                <td>{sub.testCasesPassed} / {sub.totalTestCases}</td>
                <td>{timeAgo(sub.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- 3. UPDATED MODAL --- */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl">
            <h3 className="font-bold text-lg">
              Submission Details
            </h3>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
              <div className="stat p-0">
                <div className="stat-title">Status</div>
                <div className={`stat-value text-lg ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </div>
              </div>
              <div className="stat p-0">
                <div className="stat-title">Runtime</div>
                <div className="stat-value text-lg">
                  {(selectedSubmission.runtime * 1000).toFixed(0)} ms
                </div>
              </div>
              <div className="stat p-0">
                <div className="stat-title">Memory</div>
                <div className="stat-value text-lg">
                  {selectedSubmission.memory.toFixed(1)} KB
                </div>
              </div>
              <div className="stat p-0">
                <div className="stat-title">Test Cases</div>
                <div className="stat-value text-lg">
                  {selectedSubmission.testCasesPassed} / {selectedSubmission.totalTestCases}
                </div>
              </div>
            </div>
            
            {/* Read-only Code Editor */}
            <div className="h-96 w-full border border-base-300 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language={selectedSubmission.language === 'c++' ? 'cpp' : selectedSubmission.language}
                value={selectedSubmission.code}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  domReadOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
            </div>
            
            <div className="modal-action">
              <button className="btn" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={handleCloseModal}></div>
        </div>
      )}
    </>
  );
};

export default SubmissionsTab;