import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCropDetails, clearCurrentCrop, createCrop, updateCrop } from '../../redux/slices/cropSlice';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { cropSchema } from '../../utils/schemas';
import toast from 'react-hot-toast';

const CropAddEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Grains',
    price: 0,
    unit: 'kg',
    quantity: 0,
    imageUrl: '',
    status: 'In Stock'
  });
  const [formErrors, setFormErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentCrop, isLoading } = useSelector((state) => state.crops);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchCropDetails(id));
    } else {
      dispatch(clearCurrentCrop());
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentCrop) {
      setFormData({
        name: currentCrop.name || '',
        description: currentCrop.description || '',
        category: currentCrop.category || 'Grains',
        price: currentCrop.price || 0,
        unit: currentCrop.unit || 'kg',
        quantity: currentCrop.quantity || 0,
        imageUrl: currentCrop.imageUrl || '',
        status: currentCrop.status || 'In Stock'
      });
    }
  }, [currentCrop, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : value;
    setFormData({ ...formData, [name]: val });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFormErrors({});

    try {
      await cropSchema.validate(formData, { abortEarly: false });
      
      setIsSubmitting(true);
      let resultAction;
      
      if (isEditMode) {
        resultAction = await dispatch(updateCrop({ id, cropData: formData }));
      } else {
        resultAction = await dispatch(createCrop(formData));
      }
      
      setIsSubmitting(false);

      if (createCrop.fulfilled.match(resultAction) || updateCrop.fulfilled.match(resultAction)) {
        toast.success(`Crop ${isEditMode ? 'updated' : 'created'} successfully!`);
        setTimeout(() => navigate('/admin/crops'), 1500);
      } else {
        setErrorMsg(resultAction.payload || `Failed to ${isEditMode ? 'update' : 'create'} crop`);
      }
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach(item => {
          errors[item.path] = item.message;
        });
        setFormErrors(errors);
        setErrorMsg('Please fix the errors below.');
      } else {
        setErrorMsg(err.message || 'Validation failed');
      }
    }
  };

  if (isLoading && isEditMode) return <div className="p-24 text-center">Loading...</div>;

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">
          {isEditMode ? 'Edit Crop' : 'Add New Crop'}
        </h1>
        <p className="text-gray-500 mt-1">Fill in the details for the inventory record.</p>
      </div>

      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 flex items-start gap-3">
          <FiAlertCircle className="text-red-500 mt-0.5 shrink-0 text-lg" />
          <span className="text-sm text-red-700 dark:text-red-400 font-medium">{errorMsg}</span>
        </motion.div>
      )}

      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
              <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}></textarea>
              {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
              <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border dark:border-gray-700 bg-white dark:bg-neutral-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none">
                <option value="Grains">Grains</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Pulses">Pulses</option>
                <option value="Oilseeds">Oilseeds</option>
                <option value="Spices">Spices</option>
                <option value="Cash Crops">Cash Crops</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price ($) *</label>
              <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none ${formErrors.price ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.price && <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unit *</label>
              <select name="unit" required value={formData.unit} onChange={handleChange} className="w-full px-4 py-2 border dark:border-gray-700 bg-white dark:bg-neutral-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none">
                <option value="kg">kg</option>
                <option value="ton">ton</option>
                <option value="lb">lb</option>
                <option value="unit">unit</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity *</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.quantity && <p className="text-xs text-red-500 mt-1">{formErrors.quantity}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Manual Status Override</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border dark:border-gray-700 bg-white dark:bg-neutral-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none">
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/crops')}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>{isEditMode ? 'Update Crop' : 'Create Crop'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CropAddEditPage;
