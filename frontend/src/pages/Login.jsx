
import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthMessages } from '../slices/authSlice'; // Adjust path as needed
import { unwrapResult } from '@reduxjs/toolkit'; // For handling thunk errors


const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Email or Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});


const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    let timerId;
    if (success) {
      timerId = setTimeout(() => {
        navigate('/');
      }, 1000);
    }
    
    return () => {
      clearTimeout(timerId); 
      dispatch(clearAuthMessages());
    };
  }, [success, navigate, dispatch]); 


  const onSubmit = async (data) => {
    const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.identifier);
    
    const payload = {
      password: data.password,
    };
    if (isEmail) {
      payload.emailId = data.identifier;
    } else {
      payload.userName = data.identifier;
    }

    try {
      const actionResult = await dispatch(loginUser(payload));
      unwrapResult(actionResult);
      
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="card-title text-3xl justify-center mb-6">
            Welcome Back!
          </h2>

          {/* Read error and success from Redux */}
          {error && (
            <div className="alert alert-error shadow-lg mb-4">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2.95V19a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h11.05M15 5.5V3a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h5.05M15 11l-3-3m0 0l-3 3m3-3v12" /></svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          {success && (
            <div className="alert alert-success shadow-lg mb-4">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* Identifier field */}
          <div className="form-control">
            <label className="label" htmlFor="identifier">
              <span className="label-text">Email or Username</span>
            </label>
            <input
              type="text" id="identifier"
              placeholder="your_username or your@email.com"
              className={`input input-bordered w-full ${errors.identifier ? 'input-error' : ''}`}
              {...register("identifier")}
            />
            {errors.identifier && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.identifier.message}</span>
              </label>
            )}
          </div>

          {/* Password field with toggle */}
          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                {...register("password")}
              />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-ghost btn-sm absolute end-2 top-1/2 -translate-y-1/2 z-10"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  // --- Slashed Eye Icon ---
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  // --- Eye Icon ---
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.password.message}</span>
              </label>
            )}
          </div>

          {/* Submit button reads 'loading' from Redux */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary ${loading ? 'loading' : ''}`} // Read loading from Redux
              disabled={loading} // Disable based on Redux loading state
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </div>

          {/* Link to Sign Up */}
          <div className="text-center mt-4">
            <span className="text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="link link-primary">
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;