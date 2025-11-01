
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { useDispatch, useSelector } from 'react-redux';
import { 
  registerUser, 
  sendOTP, 
  clearAuthMessages, 
  clearOtpMessages, 
  resetSignupFlow 
} from '../slices/authSlice'; 
import { unwrapResult } from '@reduxjs/toolkit';

const passwordValidation = z.string()
  .min(8, { message: "Must be 8+ characters" })
  .regex(/[a-z]/, { message: "Must contain a lowercase letter" })
  .regex(/[A-Z]/, { message: "Must contain an uppercase letter" })
  .regex(/[0-9]/, { message: "Must contain a number" })
  .regex(/[\W_]/, { message: "Must contain a special character" });

const signUpSchema = z.object({
  firstName: z.string().min(3, { message: "Must be at least 3 characters" }),
  lastName: z.string().min(3, { message: "Must be at least 3 characters" }).optional().or(z.literal('')),
  userName: z.string().min(3, { message: "Must be at least 3 characters" }),
  emailId: z.string().email({ message: "Please enter a valid email" }),
  password: passwordValidation,
  otp: z.string().optional(),
});


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const dispatch = useDispatch();
  
  const { 
    loading: authLoading, 
    error: authError, 
    success: authSuccess,
    isOtpSent,
    otpLoading,
    otpError,
    otpSuccess
  } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    let timerId;
    if (authSuccess) {
      timerId = setTimeout(() => {
        setShouldNavigate(true);
      }, 2000); 
    }
    
    return () => {
      clearTimeout(timerId);
      dispatch(clearAuthMessages());
      dispatch(resetSignupFlow());
    };
  }, [authSuccess, dispatch]);

  const handleSendOtp = async () => {
    dispatch(clearAuthMessages());
    dispatch(clearOtpMessages());

    const output = await trigger(['emailId', 'password', 'userName']); 
    if (!output) {
      return;
    }

    const { emailId, userName } = getValues();
    try {
      await dispatch(sendOTP({ emailId, userName })).unwrap();
    } catch (err) {
      console.error('Failed to send OTP:', err);
    }
  };

  const onRegister = async (data) => {
    dispatch(clearOtpMessages());

    if (!data.otp || data.otp.length < 1) {
      console.error("OTP is required.");
      return; 
    }
    
    try {
      const actionResult = await dispatch(registerUser(data));
      unwrapResult(actionResult);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  if (shouldNavigate) {
    return <Navigate to="/" replace />;
  }

  const isLoading = otpLoading || authLoading;
  const displayError = otpError || authError;
  const displaySuccess = otpSuccess || authSuccess;

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onRegister)}>
          <h2 className="card-title text-3xl justify-center mb-6">
            Create Your Account
          </h2>

          {/* Display combined error/success messages */}
          {displayError && (
            <div className="alert alert-error shadow-lg mb-4">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2.95V19a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h11.05M15 5.95V3a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h5.05M15 11l-3-3m0 0l-3 3m3-3v12" /></svg>
                <span>{displayError}</span>
              </div>
            </div>
          )}
          {displaySuccess && (
            <div className="alert alert-success shadow-lg mb-4">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{displaySuccess}</span>
              </div>
            </div>
          )}

          {/* `isOtpSent` is now read from Redux */}
          {!isOtpSent && (
            <>
              {/* --- First Name --- */}
              <div className="form-control">
                <label className="label" htmlFor="firstName">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text" id="firstName"
                  className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.firstName.message}</span>
                  </label>
                )}
              </div>

              {/* --- Last Name --- */}
              <div className="form-control">
                <label className="label" htmlFor="lastName">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text" id="lastName"
                  className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.lastName.message}</span>
                  </label>
                )}
              </div>

              {/* --- Username --- */}
              <div className="form-control">
                <label className="label" htmlFor="userName">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text" id="userName"
                  className={`input input-bordered w-full ${errors.userName ? 'input-error' : ''}`}
                  {...register("userName")}
                />
                {errors.userName && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.userName.message}</span>
                  </label>
                )}
              </div>

              {/* --- Email --- */}
              <div className="form-control">
                <label className="label" htmlFor="emailId">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email" id="emailId"
                  className={`input input-bordered w-full ${errors.emailId ? 'input-error' : ''}`}
                  {...register("emailId")}
                />
                {errors.emailId && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.emailId.message}</span>
                  </label>
                )}
              </div>

              {/* --- Password with Toggle --- */}
              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password.message}</span>
                  </label>
                ) : (
                  <label className="label">
                    <span className="label-text-alt text-xs">
                      Must be 8+ chars with uppercase, lowercase, number, and symbol.
                    </span>
                  </label>
                )}
              </div>
            </>
          )}

          {/* `isOtpSent` is read from Redux */}
          {isOtpSent && (
            <div className="form-control">
              <label className="label" htmlFor="otp">
                <span className="label-text">OTP</span>
              </label>
              <input
                type="text" id="otp"
                placeholder="Check your email for the OTP"
                className={`input input-bordered w-full ${errors.otp ? 'input-error' : ''}`}
                {...register("otp")}
              />
              {errors.otp && (
                 <label className="label">
                 <span className="label-text-alt text-error">{errors.otp.message}</span>
               </label>
              )}
            </div>
          )}

          {/* Buttons read from global auth and local otp loading states */}
          <div className="form-control mt-6">
            {isOtpSent ? (
              <button
                type="submit" 
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {authLoading ? 'Registering...' : 'Create Account'}
              </button>
            ) : (
              <button
                type="button" 
                onClick={handleSendOtp} 
                className={`btn btn-secondary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {otpLoading ? 'Sending...' : 'Send OTP'}
              </button>
            )}
          </div>

          {/* --- Link to Login --- */}
          <div className="text-center mt-4">
            <span className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary">
                Log In
              </Link>
            </span>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SignUp;