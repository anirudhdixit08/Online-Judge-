import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// --- Zod Schema for the new admin form ---
const passwordValidation = z.string().min(8, { message: "Must be 8+ characters" });
const adminSchema = z.object({
  firstName: z.string().min(3, { message: "First name is required" }),
  lastName: z.string().min(3, { message: "Last name is required" }),
  userName: z.string().min(3, { message: "Username is required" }),
  emailId: z.string().email({ message: "A valid email is required" }),
  password: passwordValidation,
});
// --- End Schema ---

// --- List Component ---
const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/user/all-admins');
        setAdmins(response.data);
      } catch (err) {
        toast.error("Could not load admin list.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  if (loading) return <span className="loading loading-spinner m-auto"></span>;

  return (
    <ul className="space-y-4">
      {admins.map(admin => (
        <li key={admin._id} className="flex items-center space-x-4">
          <div className="avatar placeholder">
            <div className="mask mask-squircle w-12 h-12 bg-neutral-focus text-neutral-content">
              <span className="text-lg font-bold">{admin.userName.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <div>
            <div className="font-bold">{admin.userName}</div>
            <div className="text-sm opacity-50">{admin.emailId}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

// --- Add Admin Form Component ---
const AddAdminForm = ({ onAdminAdded }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(adminSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/user/admin/register', data);
      toast.success(response.data);
      reset(); // Clear the form
      onAdminAdded(); // Tell the parent to refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control">
        <label className="label"><span className="label-text">First Name</span></label>
        <input type="text" {...register("firstName")} className={`input input-bordered ${errors.firstName ? 'input-error' : ''}`} />
        {errors.firstName && <span className="text-error text-xs mt-1">{errors.firstName.message}</span>}
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Last Name</span></label>
        <input type="text" {...register("lastName")} className={`input input-bordered ${errors.lastName ? 'input-error' : ''}`} />
        {errors.lastName && <span className="text-error text-xs mt-1">{errors.lastName.message}</span>}
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Username</span></label>
        <input type="text" {...register("userName")} className={`input input-bordered ${errors.userName ? 'input-error' : ''}`} />
        {errors.userName && <span className="text-error text-xs mt-1">{errors.userName.message}</span>}
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Email</span></label>
        <input type="email" {...register("emailId")} className={`input input-bordered ${errors.emailId ? 'input-error' : ''}`} />
        {errors.emailId && <span className="text-error text-xs mt-1">{errors.emailId.message}</span>}
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Password</span></label>
        <input type="password" {...register("password")} className={`input input-bordered ${errors.password ? 'input-error' : ''}`} />
        {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
      </div>
      <div className="card-actions justify-end mt-4">
        <button type="submit" className={`btn btn-success ${loading ? 'loading' : ''}`} disabled={loading}>
          {loading ? 'Creating...' : 'Create Admin'}
        </button>
      </div>
    </form>
  );
};

// --- Main Page Component ---
const AdminManagement = () => {
  // This key is a simple trick to force the AdminList to re-fetch
  const [listKey, setListKey] = useState(0); 
  const refreshAdminList = () => setListKey(prevKey => prevKey + 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Column 1: List Admins */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Current Admins</h2>
          <div className="h-96 overflow-y-auto">
            <AdminList key={listKey} />
          </div>
        </div>
      </div>
      
      {/* Column 2: Add New Admin */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Add New Admin</h2>
          <AddAdminForm onAdminAdded={refreshAdminList} />
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;