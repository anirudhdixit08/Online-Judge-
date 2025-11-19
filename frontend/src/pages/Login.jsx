import React, { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthMessages } from '../slices/authSlice'; 
import { unwrapResult } from '@reduxjs/toolkit'; 

const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Email or Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

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
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="card-title text-3xl justify-center mb-6">
            Welcome Back!
          </h2>

          {error && (
            <div role="alert" className="alert alert-error shadow-lg mb-4 text-sm py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2.95V19a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h11.05M15 5.5V3a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h5.05M15 11l-3-3m0 0l-3 3m3-3v12" /></svg>
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div role="alert" className="alert alert-success shadow-lg mb-4 text-sm py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{success}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label" htmlFor="identifier">
              <span className="label-text font-semibold">Email or Username</span>
            </label>
            <input
              type="text" id="identifier"
              placeholder="your_username or your@email.com"
              className={`input input-bordered w-full focus:input-primary ${errors.identifier ? 'input-error' : ''}`}
              {...register("identifier")}
            />
            {errors.identifier && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.identifier.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text font-semibold">Password</span>
            </label>
            
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                className={`input input-bordered w-full pr-12 focus:input-primary ${errors.password ? 'input-error' : ''}`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer z-10"
                onMouseDown={(e) => e.preventDefault()} 
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            
            <label className="label">
                <span className="label-text-alt text-error">
                    {errors.password?.message}
                </span>
                
                <Link 
                    to="/forgot-password" 
                    className="label-text-alt link link-hover text-primary font-semibold"
                >
                    Forgot password?
                </Link>
            </label>
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </div>

          <div className="text-center mt-4">
            <span className="text-sm text-base-content/70">
              Don't have an account?{' '}
              <Link to="/signup" className="link link-primary link-hover font-semibold">
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