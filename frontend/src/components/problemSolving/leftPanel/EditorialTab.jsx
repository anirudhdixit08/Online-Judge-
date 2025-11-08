
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
    return <span className="loading loading-spinner"></span>;
  }

  return (
    <div className="prose max-w-none">
      <h2 className="text-xl font-bold">Editorial</h2>
      
      {error && (
        <p className="text-base-content/70">{error}</p>
      )}

      {editorial && (
        <div className="mt-4">
          <p className="text-sm">
            Video solution provided by: s<strong>{editorial.userId.userName}</strong>
          </p>
          
          <video 
            src={editorial.secureUrl}
            controls
            preload="metadata"
            className="w-full rounded-lg shadow-lg"
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