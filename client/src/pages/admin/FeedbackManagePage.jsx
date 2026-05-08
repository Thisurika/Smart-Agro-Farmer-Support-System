import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks } from '../../redux/slices/feedbackSlice';
import { FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const FeedbackManagePage = () => {
  const dispatch = useDispatch();
  const { feedbacks, isLoading, error } = useSelector((state) => state.feedbacks);
  const { userInfo } = useSelector((state) => state.auth);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const deleteHandler = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.delete(`${API_URL}/feedbacks/${deleteTarget}`, config);
      dispatch(fetchFeedbacks());
      toast.success('Feedback deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">Manage Feedback</h1>
        <p className="text-gray-500 mt-1">Review community suggestions and complaints.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-600)]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">{error}</div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">User</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Rating</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 w-1/2">Message</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {feedbacks.map((fb) => (
                  <tr key={fb._id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {fb.isAnonymous ? (
                          <span className="text-gray-400 italic flex items-center gap-1 text-sm bg-gray-50 dark:bg-neutral-800 px-2 py-1 rounded-lg w-fit border border-gray-100 dark:border-gray-700">
                            Anonymous Submission
                          </span>
                        ) : fb.name}
                      </div>
                      {!fb.isAnonymous && <div className="text-xs text-gray-500">{fb.email}</div>}
                    </td>
                    <td className="p-4 font-bold text-[var(--color-secondary-500)]">{fb.rating} / 5</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{fb.message}</td>
                    <td className="p-4 text-sm text-gray-500">{new Date(fb.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setDeleteTarget(fb._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {feedbacks.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No feedback entries found.
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteHandler}
        title="Delete Feedback"
        message="This feedback entry will be permanently removed. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FeedbackManagePage;
