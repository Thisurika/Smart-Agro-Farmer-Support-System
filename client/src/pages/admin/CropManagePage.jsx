import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCrops, deleteCrop } from '../../redux/slices/cropSlice';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const CropManagePage = () => {
  const dispatch = useDispatch();
  const { crops, isLoading, error } = useSelector((state) => state.crops);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchCrops());
  }, [dispatch]);

  const deleteHandler = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    const resultAction = await dispatch(deleteCrop(deleteTarget));
    setIsDeleting(false);

    if (deleteCrop.fulfilled.match(resultAction)) {
      toast.success('Crop deleted successfully');
    } else {
      toast.error(resultAction.payload || 'Failed to delete crop');
    }
    
    setDeleteTarget(null);
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">Manage Crops</h1>
          <p className="text-gray-500 mt-1">Add, update, or remove inventory records.</p>
        </div>
        <Link to="/admin/crops/new">
          <Button variant="primary" className="flex items-center gap-2">
            <FiPlus /> Add New Crop
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
{/* Image column removed */}
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Price</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Stock</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {crops.map((crop) => (
                  <tr key={crop._id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                    {/* Image removed */}
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{crop.name}</td>
                    <td className="p-4 text-sm text-gray-500">{crop.category}</td>
                    <td className="p-4 font-medium text-[var(--color-primary-600)]">${crop.price.toFixed(2)} / {crop.unit}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        crop.quantity > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {crop.quantity} {crop.unit}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link to={`/admin/crops/${crop._id}/edit`}>
                          <button className="text-gray-400 hover:text-blue-500 transition-colors">
                            <FiEdit2 size={18} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteTarget(crop._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {crops.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No crops found in inventory.
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteHandler}
        title="Delete Crop"
        message="This crop will be permanently removed from the inventory. This action cannot be undone."
        confirmText="Delete"
        cancelText="Keep it"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CropManagePage;
