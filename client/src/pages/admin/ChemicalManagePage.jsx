import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchChemicals } from '../../redux/slices/chemicalSlice';
import Button from '../../components/common/Button';
import { FiPlus, FiEdit2, FiTrash2, FiDroplet } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const ChemicalManagePage = () => {
  const dispatch = useDispatch();
  const { chemicals, isLoading, error } = useSelector((state) => state.chemicals);
  const { userInfo } = useSelector((state) => state.auth);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchChemicals());
  }, [dispatch]);

  const deleteHandler = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.delete(`${API_URL}/chemicals/${deleteTarget}`, config);
      dispatch(fetchChemicals());
      toast.success('Chemical deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };


  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white flex items-center gap-3">
            <FiDroplet className="text-[var(--color-primary-500)]" /> Chemical Inventory
          </h1>
          <p className="text-gray-500 mt-1">Manage fertilizers, pesticides, and other agricultural chemicals.</p>
        </div>
        <Link to="/admin/chemicals/new">
          <Button variant="primary" className="flex items-center gap-2">
            <FiPlus /> New Chemical
          </Button>
        </Link>
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
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">ID</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Price</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Stock</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {chemicals.map((chemical) => (
                  <tr key={chemical._id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="p-4 text-xs font-mono text-gray-500">{chemical._id.substring(0, 8)}...</td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{chemical.name}</td>
                    <td className="p-4 font-bold text-[var(--color-secondary-600)]">${chemical.price.toFixed(2)}</td>
                    <td className="p-4 text-sm text-gray-500">{chemical.category}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${chemical.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {chemical.quantity} {chemical.unit}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <Link to={`/admin/chemicals/${chemical._id}/edit`}>
                        <button className="p-2 text-gray-400 hover:text-blue-500 bg-white dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                          <FiEdit2 size={16} />
                        </button>
                      </Link>
                      <button 
                        onClick={() => setDeleteTarget(chemical._id)}
                        className="p-2 text-gray-400 hover:text-red-500 bg-white dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteHandler}
        title="Delete Chemical"
        message="This chemical will be permanently removed from the inventory. This action cannot be undone."
        confirmText="Delete"
        cancelText="Keep it"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ChemicalManagePage;
