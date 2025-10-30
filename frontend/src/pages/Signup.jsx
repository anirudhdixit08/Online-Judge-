
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod'; 
import { zodResolver } from '@hookform/resolvers/zod'; 

// zod schema
const passwordValidation = z.string()
  .min(8, { message: "Must be 8+ characters" })
  .regex(/[a-z]/, { message: "Must contain a lowercase letter" })
  .regex(/[A-Z]/, { message: "Must contain an uppercase letter" })
  .regex(/[0-9]/, { message: "Must contain a number" })
  .regex(/[\W_]/, { message: "Must contain a special character" });

const signUpSchema = z.object({
  firstName: z.string()
    .min(3, { message: "Must be at least 3 characters" })
    .max(30, { message: "Cannot exceed 30 characters" }),
  lastName: z.string()
    .min(3, { message: "Must be at least 3 characters" })
    .max(30, { message: "Cannot exceed 30 characters" })
    .optional().or(z.literal('')),
  userName: z.string()
    .min(3, { message: "Must be at least 3 characters" })
    .max(20, { message: "Cannot exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Can only contain letters, numbers, and underscores" }),
  emailId: z.string().email({ message: "Please enter a valid email" }),
  password: passwordValidation,
  otp: z.string().optional(), // OTP is optional for the first step
});



const SignUp = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const navigate = useNavigate();

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

  const handleSendOtp = async () => {
    setLoading(true);
    setApiError(null);
    setApiSuccess(null);

    const output = await trigger(['emailId', 'password', 'userName']); 
    if (!output) {
      setApiError("Please fill in Email, Username, and Password correctly.");
      setLoading(false);
      return;
    }

    const { emailId,userName } = getValues();
    try {
      const response = await axios.post('http://localhost:3000/user/sendotp', { emailId,userName });
      setApiSuccess(response.data.message);
      setIsOtpSent(true);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data) => {
    // Manual check for OTP since it's conditionally required
    if (!data.otp || data.otp.length < 1) {
        setApiError("OTP is required.");
        return; 
    }

    setLoading(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const response = await axios.post('http://localhost:3000/user/register', data);
      setApiSuccess(response.data + ' Redirecting to home page...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setApiError(err.response?.data?.message || err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onRegister)}>
          <h2 className="card-title text-3xl justify-center mb-6">
            Create Your Account
          </h2>

          {apiError && (
            <div className="alert alert-error shadow-lg mb-4">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2.95V19a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h11.05M15 5.95V3a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h5.05M15 11l-3-3m0 0l-3 3m3-3v12" /></svg>
                <span>{apiError}</span>
              </div>
            </div>
          )}
          {apiSuccess && (
            <div className="alert alert-success shadow-lg mb-4">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{apiSuccess}</span>
              </div>
            </div>
          )}

          {!isOtpSent && (
            <>
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

              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password" id="password"
                  className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                  {...register("password")}
                />
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

          <div className="form-control mt-6">
            {isOtpSent ? (
              <button
                type="submit" // Triggers handleSubmit(onRegister)
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Create Account'}
              </button>
            ) : (
              <button
                type="button" 
                onClick={handleSendOtp} 
                className={`btn btn-secondary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;