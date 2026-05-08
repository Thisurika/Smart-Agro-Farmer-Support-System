import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { loginSchema } from '../../utils/schemas';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import AuthBackground from '../../components/common/AuthBackground';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') navigate('/admin/dashboard');
      else navigate('/user/dashboard');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
      dispatch(loginUser({ email, password }));
    } catch (err) {
      setFormError(err.message || 'Please check your inputs.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Photo Slideshow */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <AuthBackground />
        {/* Branding overlay on slideshow */}
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
              Empowering Sri Lankan farmers with intelligent agricultural solutions.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white dark:bg-neutral-950">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:mb-10">
            <div className="inline-flex justify-center items-center p-3 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <TbLeaf className="text-4xl text-[var(--color-primary-600)]" />
            </div>
            <h2 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">Welcome Back!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Log in to your Smart Agro account.</p>
          </div>

          {(error || formError) && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-start gap-3"
            >
              <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" />
              <span className="text-sm text-red-700 dark:text-red-400 font-medium">{formError || error}</span>
            </motion.div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFormError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border ${formError && !email ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent transition-all outline-none text-gray-900 dark:text-white`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <Link to="/forgot-password" className="text-sm font-medium text-[var(--color-primary-600)] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border ${formError && !password ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'} rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent transition-all outline-none text-gray-900 dark:text-white`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3 text-lg" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            First time here?{' '}
            <Link to="/signup" className="font-bold text-[var(--color-primary-600)] hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
