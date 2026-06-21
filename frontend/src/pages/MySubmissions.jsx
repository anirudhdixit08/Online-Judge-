import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import Editor from '@monaco-editor/react';


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

const getStatusColor = (status) => {
  if (status === 'accepted') return 'text-success';
  if (status === 'wrong answer') return 'text-error';
  return 'text-warning'; // for 'error' or 'pending'
};


const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissionList = async () => {
      setListLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get('/submission/get-all-submissions', {
          params: {
            page: currentPage,
            limit: 20 
          }
        });
        setSubmissions(response.data.submissions);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch submission history.');
      } finally {
        setListLoading(false);
      }
    };
    fetchSubmissionList();
  }, [currentPage]);

  const handleViewCode = async (submissionId) => {
    setModalLoading(true);
    setSelectedSubmission(true);
    try {
      const response = await axiosClient.get(`/submission/${submissionId}`);
      setSelectedSubmission(response.data); 
    } catch (err) {
      setError('Failed to fetch submission details.');
      setSelectedSubmission(null); 
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderList = () => {
    if (listLoading) {
      return (
        <tr>
          <td colSpan="5" className="text-center h-48">
            <div className="flex items-center justify-center gap-3 text-base-content/70">
              <span className="loading loading-spinner loading-md"></span>
              <span className="text-sm">Loading submissions...</span>
            </div>
          </td>
        </tr>
      );
    }
    if (error) {
      return <tr><td colSpan="5"><div className="alert alert-error text-sm">{error}</div></td></tr>;
    }
    if (submissions.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center h-48">
            <div className="text-base-content/70">
              <p className="font-semibold text-base-content">You have no submissions yet</p>
              <p className="text-sm mt-1">Open a problem and submit your first solution.</p>
            </div>
          </td>
        </tr>
      );
    }
    return submissions.map((sub) => (
      <tr 
        key={sub._id} 
        className="hover cursor-pointer"
        onClick={() => handleViewCode(sub._id)}
      >
        <td className="font-semibold">
          <Link to={`/problem/${sub.problemId._id}`} className="link link-hover" onClick={(e) => e.stopPropagation()}>
            {sub.problemId.title}
          </Link>
        </td>
        <td className={`font-semibold ${getStatusColor(sub.status)}`}>
          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
        </td>
        <td>{sub.language}</td>
        <td>{sub.testCasesPassed} / {sub.totalTestCases}</td>
        <td>{timeAgo(sub.createdAt)}</td>
      </tr>
    ));
  };

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Submissions</h1>
          <p className="mt-2 text-sm md:text-base text-base-content/70">Review your latest attempts and inspect submitted code.</p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Status</th>
                <th>Language</th>
                <th>Test Cases</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {renderList()}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        <div className="flex justify-center mt-8">
          <div className="join">
            <button 
              className="join-item btn" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || listLoading}
            >
              «
            </button>
            <button className="join-item btn btn-disabled px-5">
              Page {currentPage} of {totalPages}
            </button>
            <button 
              className="join-item btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || listLoading}
            >
              »
            </button>
          </div>
        </div>
      </div>

      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl p-5 md:p-6">
            {modalLoading ? (
              <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-xl">Submission Details</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
                  <div className="stat rounded-md bg-base-200/70 p-3">
                    <div className="stat-title">Status</div>
                    <div className={`stat-value text-lg ${getStatusColor(selectedSubmission.status)}`}>
                      {selectedSubmission.status}
                    </div>
                  </div>
                  <div className="stat rounded-md bg-base-200/70 p-3">
                    <div className="stat-title">Runtime</div>
                    <div className="stat-value text-lg">
                      {(selectedSubmission.runtime * 1000).toFixed(0)} ms
                    </div>
                  </div>
                  <div className="stat rounded-md bg-base-200/70 p-3">
                    <div className="stat-title">Memory</div>
                    <div className="stat-value text-lg">
                      {selectedSubmission.memory.toFixed(1)} KB
                    </div>
                  </div>
                  <div className="stat rounded-md bg-base-200/70 p-3">
                    <div className="stat-title">Test Cases</div>
                    <div className="stat-value text-lg">
                      {selectedSubmission.testCasesPassed} / {selectedSubmission.totalTestCases}
                    </div>
                  </div>
                </div>
                
                <div className="h-96 w-full border border-base-300 rounded-lg overflow-hidden">
                  <Editor
                    height="100%"
                    language={selectedSubmission.language === 'c++' ? 'cpp' : selectedSubmission.language}
                    value={selectedSubmission.code}
                    theme="vs-dark"
                    options={{ readOnly: true, domReadOnly: true, minimap: { enabled: false } }}
                  />
                </div>
                
                <div className="modal-action">
                  <button className="btn" onClick={handleCloseModal}>Close</button>
                </div>
              </>
            )}
          </div>
          <div className="modal-backdrop" onClick={handleCloseModal}></div>
        </div>
      )}
    </>
  );
};

export default MySubmissions;
