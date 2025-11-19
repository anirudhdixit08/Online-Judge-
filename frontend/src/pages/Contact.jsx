import React, { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const userInfo = {
      access_key: "a47f08b6-0170-40ca-94f8-50bc3246abd2", 
      name: data.username,
      email: data.email,
      message: data.message,
    };
    
    try {
      await axios.post("https://api.web3forms.com/submit", userInfo);
      toast.success("Thank you! Your message has been sent successfully.");
      reset(); 
    } catch (error) {
      toast.error("Oops! An error occurred while sending your message.");
      console.error("Form Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full card bg-base-100 shadow-2xl rounded-xl p-6 md:p-10">
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-primary">
            Get In Touch
          </h2>
          <p className="text-lg text-base-content/70 mt-2">
            We're here to help you on your algorithmic journey.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between lg:space-x-10">
          
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <h3 className="text-xl font-bold text-secondary mb-4">
              Send Us a Direct Message
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="form-control">
                <input
                  type="text"
                  name="username"
                  placeholder="Your Name"
                  className={`input input-bordered w-full focus:input-primary ${errors.username ? 'input-error' : ''}`}
                  {...register("username", { required: "Name is required" })}
                />
                {errors.username && (
                  <span className="label-text-alt text-error mt-1">{errors.username.message}</span>
                )}
              </div>
              
              <div className="form-control">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className={`input input-bordered w-full focus:input-primary ${errors.email ? 'input-error' : ''}`}
                  {...register("email", { 
                    required: "Email is required", 
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                  })}
                />
                {errors.email && (
                  <span className="label-text-alt text-error mt-1">{errors.email.message}</span>
                )}
              </div>
              
              <div className="form-control">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  className={`textarea textarea-bordered h-32 w-full focus:textarea-primary ${errors.message ? 'textarea-error' : ''}`}
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && (
                  <span className="label-text-alt text-error mt-1">{errors.message.message}</span>
                )}
              </div>
              
              <div className="form-control pt-2">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="w-full lg:w-1/2 lg:pl-4 border-t lg:border-t-0 lg:border-l border-base-200 pt-8 lg:pt-0 lg:pl-8">
            <h3 className="text-xl font-bold text-secondary mb-4">
              Direct Contact Info
            </h3>
            <ul className="space-y-6 text-lg">
              
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary/70 text-xl" />
                <a href="tel:+918707220773" className="link link-hover text-base-content">+91 8707220773</a>
              </li>
              
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary/70 text-xl" />
                <a href="tel:+917355374902" className="link link-hover text-base-content">+91 7355374902</a>
              </li>
              
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-secondary/70 text-xl" />
                <a href="mailto:anirudhdixit0808@gmail.com" className="link link-hover text-base-content">anirudhdixit0808@gmail.com</a>
              </li>
              
              <li className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-info/70 text-xl" />
                <span className="text-base-content">MNNIT Allahabad, Prayagraj, India</span>
              </li>
              
              <li className="pt-4 border-t border-base-200">
                <p className="font-semibold text-base-content/80">Support Hours:</p>
                <p className="text-sm text-base-content/70">Mon - Fri, 9:00 AM to 5:00 PM IST</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

