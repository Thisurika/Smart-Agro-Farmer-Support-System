import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../redux/slices/authSlice';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiPhone, FiMapPin } from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { signupSchema } from '../../utils/schemas';
import AuthBackground from '../../components/common/AuthBackground';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', password: '', confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/user/dashboard');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setServerError('');
    
    try {
      await signupSchema.validate(formData, { abortEarly: false });
      dispatch(registerUser(formData));
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach(item => {
          errors[item.path] = item.message;
        });
        setFormErrors(errors);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Photo Slideshow */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <AuthBackground />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl">
                <TbLeaf className="text-4xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-white font-heading mb-3 drop-shadow-lg">Smart Agro</h1>
            <p className="text-white/80 text-lg max-w-sm mx-auto drop-shadow">
              Join thousands of farmers revolutionizing agriculture with smart technology.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white dark:bg-neutral-950 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center p-3 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <TbLeaf className="text-4xl text-[var(--color-primary-600)]" />
            </div>
            <h2 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">Create an Account</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Join Smart Agro and revolutionize your farming.</p>
          </div>

          {(error || serverError || Object.keys(formErrors).length > 0) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 flex items-start gap-3"
            >
              <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" />
              <span className="text-sm text-red-700 dark:text-red-400 font-medium">
                {error || serverError || 'Please correct the errors below.'}
              </span>
            </motion.div>
          )}

          <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiUser className="text-gray-400" /></div>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'} rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none text-gray-900 dark:text-white`} placeholder="John" />
              </div>
              {formErrors.firstName && <p className="text-xs text-red-500 mt-1">{formErrors.firstName}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiUser className="text-gray-400" /></div>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'} rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none text-gray-900 dark:text-white`} placeholder="Doe" />
              </div>
              {formErrors.lastName && <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>}
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiMail className="text-gray-400" /></div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border ${formErrors.email ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'} rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none text-gray-900 dark:text-white`} placeholder="john@example.com" />
              </div>
              {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiPhone className="text-gray-400" /></div>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border ${formErrors.phone ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'} rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none text-gray-900 dark:text-white`} placeholder="+123456789" />
              </div>
              {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiMapPin className="text-gray-400" /></div>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border ${formErrors.address ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'} rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none text-gray-900 dark:text-white`} placeholder="Farm Location" />
              </div>
              {formErrors.address && <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiLock className="text-gray-400" /></div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border ${formErrors.password ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'} rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none text-gray-900 dark:text-white`} placeholder="••••••••" />
              </div>
              {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiLock className="text-gray-400" /></div>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'} rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none text-gray-900 dark:text-white`} placeholder="••••••••" />
              </div>
              {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{formErrors.confirmPassword}</p>}
            </div>

            <div className="md:col-span-2 pt-4">
               <Button type="submit" variant="primary" className="w-full py-4 text-lg" isLoading={isLoading}>
                  Complete Registration
               </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[var(--color-primary-600)] hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
