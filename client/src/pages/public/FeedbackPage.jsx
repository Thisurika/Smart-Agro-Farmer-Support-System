import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks, createFeedback, clearFeedbackState } from '../../redux/slices/feedbackSlice';
import Button from '../../components/common/Button';
import { FiMessageSquare, FiUser, FiStar, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { feedbackSchema } from '../../utils/schemas';

const StarRating = ({ rating, onRate, size = 28, readonly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={readonly}
        onClick={() => onRate && onRate(star)}
        className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= rating ? '#f59e0b' : 'none'}
          stroke={star <= rating ? '#f59e0b' : '#d1d5db'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    ))}
  </div>
);

const FeedbackPage = () => {
  const dispatch = useDispatch();
  
  const { feedbacks, isLoading, error, submitSuccess } = useSelector((state) => state.feedbacks);
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: userInfo ? userInfo.firstName + ' ' + userInfo.lastName : '',
    email: userInfo ? userInfo.email : '',
    role: userInfo ? userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1) : 'Farmer',
    message: '',
    rating: 0,
    isAnonymous: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        name: userInfo.firstName + ' ' + userInfo.lastName,
        email: userInfo.email,
        role: userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)
      }));
    }
  }, [userInfo]);

  useEffect(() => {
    dispatch(fetchFeedbacks());
    return () => dispatch(clearFeedbackState());
  }, [dispatch]);

  useEffect(() => {
    if (submitSuccess) {
      setFormData(prev => ({ ...prev, message: '', rating: 0, isAnonymous: false }));
      setSuccessMsg('Thank you for your feedback!');
      dispatch(clearFeedbackState());
    }
  }, [submitSuccess, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setFormErrors({});

    try {
      await feedbackSchema.validate(formData, { abortEarly: false });
      dispatch(createFeedback(formData));
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach(item => {
          errors[item.path] = item.message;
        });
        setFormErrors(errors);
        setErrorMsg('Please fix the errors below.');
      }
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      {/* Left: Feedback Form */}
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white mb-4">
          Community Feedback
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          We value your experience! Share your thoughts on Smart Agro or suggest new features you'd like to see.
        </p>

        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <FiAlertCircle className="text-red-500 mt-0.5 shrink-0 text-lg" />
            <span className="text-sm text-red-700 dark:text-red-400 font-medium">{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-start gap-3">
            <FiCheckCircle className="text-green-500 mt-0.5 shrink-0 text-lg" />
            <span className="text-sm text-green-700 dark:text-green-400 font-medium">{successMsg}</span>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <FiAlertCircle className="text-red-500 mt-0.5 shrink-0 text-lg" />
            <span className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</span>
          </motion.div>
        )}

        {userInfo ? (
          <form onSubmit={submitHandler} className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" name="name" disabled value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 dark:text-gray-400 border dark:border-gray-700 outline-none rounded-lg cursor-not-allowed" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" name="email" disabled value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 dark:text-gray-400 border dark:border-gray-700 outline-none rounded-lg cursor-not-allowed" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-neutral-800 dark:text-white border dark:border-gray-700 outline-none rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)]">
                <option value="Farmer">Farmer</option>
                <option value="Buyer">Buyer</option>
                <option value="Guest">Guest</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Rating</label>
              <StarRating rating={formData.rating} onRate={(r) => { setFormData({ ...formData, rating: r }); if(formErrors.rating) setFormErrors({...formErrors, rating: ''}); }} />
              {formErrors.rating && <p className="text-xs text-red-500 mt-1">{formErrors.rating}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea name="message" rows="4" value={formData.message} onChange={handleChange} className={`w-full px-4 py-3 bg-white dark:bg-neutral-800 dark:text-white border ${formErrors.message ? 'border-red-500' : 'dark:border-gray-700'} outline-none rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none`} placeholder="Tell us about your experience..."></textarea>
              {formErrors.message && <p className="text-xs text-red-500 mt-1">{formErrors.message}</p>}
            </div>

            <label className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none bg-gray-200 dark:bg-neutral-700">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${formData.isAnonymous ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Send Anonymously</span>
                <span className="text-xs text-gray-500">Your details will be hidden from the community and admins.</span>
              </div>
            </label>

            <Button type="submit" variant="primary" className="w-full py-4 text-lg" isLoading={isLoading}>
              Submit Feedback
            </Button>
          </form>
        ) : (
          <div className="bg-white dark:bg-neutral-900 p-12 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-gray-400 mb-6">
              <FiUser size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Login Required</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs">
              Please log in to your account to share your feedback with the Smart Agro community.
            </p>
            <Button variant="primary" className="px-8 py-3 rounded-xl" onClick={() => window.location.href = '/login'}>
              Login to Continue
            </Button>
          </div>
        )}
      </div>

      {/* Right: Community Wall */}
      <div className="bg-gray-50 dark:bg-neutral-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 h-max max-h-[800px] flex flex-col">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <FiMessageSquare className="text-2xl text-[var(--color-primary-500)]" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Community Wall</h2>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {isLoading && feedbacks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Loading feedback...</div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-10 text-gray-500 italic">No feedback yet. Be the first!</div>
          ) : (
            feedbacks.map((fb, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={fb._id} 
                className="bg-white dark:bg-neutral-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary-100)] dark:bg-neutral-700 flex items-center justify-center text-[var(--color-primary-600)] dark:text-white">
                      <FiUser />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{fb.isAnonymous ? 'Anonymous User' : fb.name}</h4>
                      <p className="text-xs text-gray-500">{fb.isAnonymous ? 'Community Member' : fb.role}</p>
                    </div>
                  </div>
                  <StarRating rating={fb.rating} readonly size={16} />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">"{fb.message}"</p>
                <p className="text-xs text-gray-400 mt-4 text-right">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default FeedbackPage;
