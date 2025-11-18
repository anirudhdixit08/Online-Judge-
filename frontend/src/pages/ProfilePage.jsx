import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getProfile, updateUserProfile, clearAuthMessages } from '../slices/authSlice';

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DefaultAvatar = () => (
  <div className="bg-neutral text-neutral-content rounded-full w-full h-full flex items-center justify-center">
    <span className="text-3xl font-bold">USER</span>
  </div>
);

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, success } = useSelector((state) => state.auth);

  // Local State
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    profilePhoto: null,
  });

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // 1. Initial Fetch
  useEffect(() => {
    dispatch(clearAuthMessages());
    dispatch(getProfile());
  }, [dispatch]);

  // 2. Sync Redux State to Form
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        profilePhoto: user.profilePhoto || null,
      });
    }
  }, [user]);

  // 3. Handle File Preview
  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);

    // Cleanup memory
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // 4. Notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthMessages());
    }
    if (success) {
      toast.success("Profile updated successfully!");
      dispatch(clearAuthMessages());
      // Clear file input after success
      setFile(null); 
    }
  }, [error, success, dispatch]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append('userName', formData.userName);
    updateData.append('firstName', formData.firstName);
    updateData.append('lastName', formData.lastName);
    if (file) {
      updateData.append('profilePhoto', file);
    }
    await dispatch(updateUserProfile(updateData));
  };

  // Determine display image
  const displayImage = filePreview || formData.profilePhoto;

  // Loading State (Full Page)
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-base-content">Account Settings</h1>
          <p className="text-base-content/70 mt-1">Manage your profile details and preferences.</p>
        </div>

        <div className="card bg-base-100 shadow-xl rounded-2xl overflow-hidden">
          <div className="card-body p-0">
            
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
              
              {/* LEFT COLUMN: Avatar & Upload */}
              <div className="md:w-1/3 bg-base-50/50 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-base-200">
                <div className="relative group">
                  <div 
                    className={`avatar ${displayImage ? 'cursor-pointer' : ''}`}
                    onClick={() => displayImage && setIsImageModalOpen(true)}
                  >
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-all duration-300 group-hover:ring-primary-focus">
                      {displayImage ? (
                        <img src={displayImage} alt="Profile" className="object-cover" />
                      ) : (
                        <DefaultAvatar />
                      )}
                    </div>
                  </div>
                  
                  {/* Hover Hint for Zoom */}
                  {displayImage && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="badge badge-neutral bg-opacity-75 text-xs">View</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 w-full text-center">
                  <label 
                    htmlFor="photo-upload" 
                    className="btn btn-outline btn-primary btn-sm gap-2 w-full max-w-48"
                  >
                    <CameraIcon />
                    Upload Photo
                  </label>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <p className="text-xs text-base-content/50 mt-3">
                    Allowed: JPG, PNG. Max 5MB.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Form Fields */}
              <div className="md:w-2/3 p-8 space-y-6">
                
                {/* Grid for Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">First Name</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input input-bordered w-full focus:input-primary"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Last Name</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input input-bordered w-full focus:input-primary"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Username</span>
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full focus:input-primary"
                    required
                  />
                </div>

                {/* Email (Read Only) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email Address</span>
                    <span className="label-text-alt text-warning">Cannot be changed</span>
                  </label>
                  <input
                    type="email"
                    value={user?.emailId || ''}
                    disabled
                    className="input input-bordered w-full bg-base-200 text-base-content/60 cursor-not-allowed"
                  />
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-end border-t border-base-200 mt-6">
                  <button 
                    type="button" 
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary min-w-[120px] ${loading ? 'btn-disabled' : ''}`}
                  >
                    {loading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>

      {/* --- Full Screen Image Modal --- */}
      {isImageModalOpen && displayImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl w-full h-full p-4 flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 btn btn-circle btn-ghost text-white hover:bg-white/20"
              onClick={() => setIsImageModalOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={displayImage} 
              alt="Profile Full" 
              className="max-h-[90vh] max-w-full rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;