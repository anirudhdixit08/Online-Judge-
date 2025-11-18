import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';

// --- Icons ---
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-base-content/60 hover:text-primary">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-base-content/60 hover:text-primary">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract email passed from the previous page
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' | 'error'

  // If user tries to access this page directly without email, redirect back
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
        setStatus({ type: 'error', message: "Passwords do not match!" });
        setLoading(false);
        return;
    }

    try {
      await axiosClient.post('/user/reset-password', {
        emailId: email,
        otp: formData.otp,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      setStatus({ type: 'success', message: "Password reset successfully! Redirecting to login..." });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
          navigate('/login');
      }, 2000);

    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || "Failed to reset password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center justify-center mb-2">
            Reset Password
          </h2>
          
          {/* Info Badge showing where OTP was sent */}
          <div className="text-center mb-4">
             <span className="badge badge-ghost text-xs py-3">Code sent to {email}</span>
          </div>

          {/* Alerts */}
          {status.message && (
            <div role="alert" className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'} text-sm py-2 mb-4`}>
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* OTP Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">OTP Code</span>
              </label>
              <input
                type="text"
                name="otp"
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="input input-bordered w-full text-center tracking-[0.5em] font-mono text-lg focus:input-primary"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            </div>

            {/* New Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="••••••••"
                  className="input input-bordered w-full pr-10 focus:input-primary"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center z-10 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Confirm Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                className="input input-bordered w-full focus:input-primary"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;