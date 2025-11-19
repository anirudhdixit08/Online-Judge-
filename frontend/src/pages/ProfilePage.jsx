
import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient"; 

export default function UpdateProfilePage() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      setFetching(true);
      setError(null);
      try {
        const resp = await axiosClient.get("/user/profile");
        if (!mounted) return;
        const data = resp.data; 
        setUser(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setUserName(data.userName || "");
        setPreviewUrl(data.profilePhoto || null);
      } catch (err) {
        const serverData = err?.response?.data;
        const msg =
          typeof serverData === "string"
            ? serverData
            : serverData?.message ?? err.message ?? "Failed to fetch profile";
        setError(msg);
      } finally {
        if (mounted) setFetching(false);
      }
    }

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // basic validation
    if (!firstName.trim() || !userName.trim()) {
      setError("First name and username are required.");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName.trim());
    formData.append("lastName", lastName.trim());
    formData.append("userName", userName.trim());
    if (file) formData.append("profilePhoto", file); 

    try {
      setLoading(true);
      const resp = await axiosClient.patch("/user/update", formData);
      const respData = resp.data;
      setSuccess(respData?.message || "Profile updated successfully");
      setUser(respData?.user ?? respData);
      if (respData?.user?.profilePhoto) {
        setPreviewUrl(respData.user.profilePhoto);
      }
      setFile(null);
    } catch (err) {
      const serverData = err?.response?.data;
      const msg =
        typeof serverData === "string"
          ? serverData
          : serverData?.message ?? err.message ?? "Failed to update profile";
      setError(msg);
    } finally {
      setLoading(false);
      if (success) {
        setTimeout(() => setSuccess(null), 4000);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6">
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Update Profile</h2>

          {fetching ? (
            <div className="py-8 text-center">Loading profile...</div>
          ) : error ? (
            <div className="alert alert-error shadow-lg mb-4">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M12 20h.01" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          ) : null}

          {success && (
            <div className="alert alert-success shadow-lg mb-4">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{success}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="avatar">
                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                  {previewUrl ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img src={previewUrl} alt="Profile preview" className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                      No Photo
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <label className="label">
                  <span className="label-text">Profile Photo</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full max-w-xs"
                />
                <p className="text-sm text-gray-500 mt-2">Allowed: JPG, PNG, GIF. Max recommended size: 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Allowed characters: letters, numbers, underscore. 3–30 chars.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Save changes"}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  // reset local edits to server values
                  setFirstName(user?.firstName || "");
                  setLastName(user?.lastName || "");
                  setUserName(user?.userName || "");
                  setFile(null);
                  setPreviewUrl(user?.profilePhoto || null);
                  setError(null);
                  setSuccess(null);
                }}
              >
                Reset
              </button>
            </div>
          </form>

          <div className="mt-4 text-sm text-gray-500">
            <p>Note: Changes may require re-login in parts of the app that cache user info.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
