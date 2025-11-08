import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const EditorialManagement = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [problemLoading, setProblemLoading] = useState(true);
  
  const [isCheckingEditorial, setIsCheckingEditorial] = useState(false);
  const [existingEditorial, setExistingEditorial] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setProblemLoading(true);
        const response = await axiosClient.get('/problem/all-problems');
        setProblems(response.data);
      } catch (err) {
        toast.error("Failed to fetch problem list");
      } finally {
        setProblemLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const filteredProblems = useMemo(() => {
    if (!searchQuery) return problems;
    return problems.filter(prob =>
      prob.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [problems, searchQuery]);

  const checkEditorialExists = async (problemId) => {
    setIsCheckingEditorial(true);
    setExistingEditorial(null);
    try {
      const response = await axiosClient.get(`/editorial/problem/${problemId}`);
      setExistingEditorial(response.data);
      toast.success("An editorial was found for this problem."); 
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setExistingEditorial(null); 
        toast("No editorial found. You can upload a new one.");
      } else {
        toast.error("Error checking editorial status");
      }
    } finally {
      setIsCheckingEditorial(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    setSearchQuery('');
    if (document.activeElement) document.activeElement.blur();
    checkEditorialExists(problem._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProblem || !selectedFile) {
      toast.error("Please select a problem and a video file.");
      return;
    }
    setLoading(true);

    try {
      const sigResponse = await axiosClient.get(`/editorial/create/${selectedProblem._id}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = sigResponse.data;

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('signature', signature);
      
      const cloudinaryResponse = await axios.post(upload_url, formData);
      const { secure_url, duration, public_id: cloudinaryPublicId } = cloudinaryResponse.data;

      const saveResponse = await axiosClient.post('/editorial/save', {
        problemId: selectedProblem._id,
        cloudinaryPublicId: cloudinaryPublicId,
        secureUrl: secure_url,
        duration: duration
      });

      toast.success(saveResponse.data.message);
      
      e.target.reset();
      setSelectedFile(null);
      checkEditorialExists(selectedProblem._id);
      
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingEditorial) return;
    if (window.confirm("Are you sure you want to delete this editorial? This action cannot be undone.")) {
      setLoading(true);
      try {
        const response = await axiosClient.delete(`/editorial/delete/${existingEditorial._id}`);
        toast.success(response.data.message);
        setExistingEditorial(null); 
      } catch (err) {
        toast.error(err.response?.data?.error || "Delete failed!");
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Upload Editorial Video</h2>

        <div className="form-control">
          <label className="label"><span className="label-text">1. Select Problem</span></label>
          <div className="dropdown w-full">
            <label tabIndex={0} className="btn btn-outline justify-start w-full">
              {problemLoading ? 'Loading problems...' : (selectedProblem ? selectedProblem.title : 'Choose a problem')}
            </label>
            <div tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-full max-h-60 overflow-y-auto flex-nowrap">
              <input
                type="text"
                placeholder="Search problems..."
                className="input input-md sticky top-0" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {filteredProblems.map(prob => (
                <li key={prob._id}>
                  <a onClick={() => handleSelectProblem(prob)}>{prob.title}</a>
                </li>
              ))}
            </div>
          </div>
        </div>

        {isCheckingEditorial && (
          <div className="flex justify-center p-6">
            <span className="loading loading-spinner"></span>
          </div>
        )}

        {!isCheckingEditorial && existingEditorial && (
          <div className="card bg-base-200 p-4">
            <h3 className="font-bold text-lg">Editorial Exists</h3>
            <p className="text-sm my-2">An editorial has already been uploaded for this problem.</p>
            <div className="flex items-center gap-4">
              <img src={existingEditorial.thumbnailUrl} alt="Thumbnail" className="w-32 rounded" />
              <div>
                <p><strong>Author:</strong> {existingEditorial.userId.userName}</p>
                <p><strong>Duration:</strong> {(existingEditorial.duration / 60).toFixed(1)} mins</p>
              </div>
            </div>
            <div className="card-actions justify-end mt-4">
              <button 
                type="button" 
                className={`btn btn-error ${loading ? 'loading' : ''}`}
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Editorial
              </button>
            </div>
          </div>
        )}

        {!isCheckingEditorial && !existingEditorial && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">2. Upload Video</span></label>
              <input 
                type="file" 
                className="file-input file-input-bordered w-full"
                accept="video/*"
                onChange={handleFileChange}
                required
                disabled={!selectedProblem}
              />
            </div>
            <div className="card-actions justify-end pt-4">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`} 
                disabled={loading || problemLoading || !selectedProblem}
              >
                {loading ? 'Uploading...' : 'Upload Editorial'}
              </button>
            </div>
          </form>
        )}
        
      </div>
    </div>
  );
};

export default EditorialManagement;