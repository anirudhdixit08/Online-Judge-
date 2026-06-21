
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../../utils/axiosClient';

const EditorialTab = () => {
  const { id: problemId } = useParams();

  const [editorial, setEditorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!problemId) return;

    const fetchEditorial = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/editorial/problem/${problemId}`);
        setEditorial(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("No editorial found for this problem.");
        } else {
          setError("Failed to fetch editorial.");
        }
        console.error("Error fetching editorial:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEditorial();
  }, [problemId]);

  if (loading) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  return (
    <div className="max-w-none">
      <h2 className="text-lg font-bold">Editorial</h2>
      
      {error && (
        <p className="mt-4 rounded-md border border-base-300 bg-base-200/40 p-4 text-sm text-base-content/70">{error}</p>
      )}

      {editorial && (
        <div className="mt-4">
          <p className="mb-3 text-sm text-base-content/70">
            Video solution provided by: <strong className="text-base-content">{editorial.userId.userName}</strong>
          </p>
          
          <video 
            src={editorial.secureUrl}
            controls
            preload="metadata"
            className="w-full rounded-md border border-base-300"
            controlsList="nodownload" 
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default EditorialTab;
