import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import your custom axios client
import axiosClient from '../utils/axiosClient'; 

// Icons
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 hover:text-primary transition-colors">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 hover:text-primary transition-colors">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const [toast, setToast] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast({ message: '', type: '' });
        setLoading(true);

        if (formData.newPassword !== formData.confirmPassword) {
            setToast({ message: "New passwords do not match!", type: 'error' });
            setLoading(false);
            return;
        }
        if (formData.newPassword.length < 6) {
            setToast({ message: "Password must be at least 6 characters.", type: 'error' });
            setLoading(false);
            return;
        }

        try {
            // REPLACED: Standard axios with axiosClient
            // 1. No http://localhost:3000 (Handled by baseURL)
            // 2. No manual headers (Handled by withCredentials/interceptor)
            const res = await axiosClient.post('/user/change-password', {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });

            setToast({ message: res.data.message, type: 'success' });
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setToast({ 
                message: error.response?.data?.message || "Failed to update password.", 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
            <div className="card w-full max-w-md shadow-2xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold text-center justify-center mb-4">
                        Change Password
                    </h2>

                    {toast.message && (
                        <div role="alert" className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
                            <span>{toast.message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Old Password */}
                        <div className="form-control">
                            <label className="label font-semibold">Current Password</label>
                            <div className="relative w-full">
                                <input 
                                    type={showPassword.old ? "text" : "password"} 
                                    name="oldPassword"
                                    placeholder="••••••••" 
                                    className="input input-bordered w-full pr-12"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button 
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 z-10 cursor-pointer"
                                    onClick={() => toggleVisibility('old')}
                                    onMouseDown={(e) => e.preventDefault()} 
                                >
                                    {showPassword.old ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="form-control">
                            <label className="label font-semibold">New Password</label>
                            <div className="relative w-full">
                                <input 
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="••••••••" 
                                    className="input input-bordered w-full pr-12"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button 
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 z-10 cursor-pointer"
                                    onClick={() => toggleVisibility('new')}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    {showPassword.new ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="form-control">
                            <label className="label font-semibold">Confirm New Password</label>
                            <div className="relative w-full">
                                <input 
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="••••••••" 
                                    className="input input-bordered w-full pr-12"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button 
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 z-10 cursor-pointer"
                                    onClick={() => toggleVisibility('confirm')}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    {showPassword.confirm ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <div className="form-control mt-6">
                            <button 
                                type="submit" 
                                className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner loading-sm"></span> : "Update Password"}
                            </button>
                        </div>
                        
                        <div className="text-center mt-2">
                             <button type="button" onClick={() => navigate(-1)} className="link link-hover text-sm text-gray-500">
                                Cancel
                             </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;