import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Button from '../../components/common/Button';
import { chemicalSchema } from '../../utils/schemas';
import { FiArrowLeft, FiSave, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ChemicalAddEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: '',
    type: 'Fertilizer',
    quantity: 0,
    unit: 'kg',
    description: '',
    applicationMethod: '',
    safetyInstructions: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

  useEffect(() => {
    const fetchChemical = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${API_URL}/chemicals/${id}`);
        setFormData({
          name: data.name || '',
          price: data.price || 0,
          image: data.image || '',
          brand: data.brand || '',
          category: data.category || '',
          type: data.type || 'Fertilizer',
          quantity: data.quantity || 0,
          unit: data.unit || 'kg',
          description: data.description || '',
          applicationMethod: data.applicationMethod || '',
          safetyInstructions: data.safetyInstructions || ''
        });
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching chemical');
        setIsLoading(false);
      }
    };
    if (id) fetchChemical();
  }, [id, API_URL]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : value;
    setFormData({ ...formData, [name]: val });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    setUploading(true);

    try {
      const configUpload = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/upload`, formDataUpload, configUpload);

      setFormData({ ...formData, image: data.url });
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      setError('Image upload failed');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setError('');
    
    try {
      await chemicalSchema.validate(formData, { abortEarly: false });
      setIsLoading(true);
      if (id) {
        await axios.put(`${API_URL}/chemicals/${id}`, formData, config);
        navigate('/admin/chemicals');
      } else {
        await axios.post(`${API_URL}/chemicals`, formData, config);
        navigate('/admin/chemicals');
      }
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach(item => {
          errors[item.path] = item.message;
        });
        setFormErrors(errors);
        setError('Please fix the errors below.');
      } else {
        setError(err.response?.data?.message || 'Failed to save chemical');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <Link to="/admin/chemicals" className="inline-flex items-center text-gray-500 hover:text-[var(--color-primary-600)] transition-colors font-medium mb-8">
        <FiArrowLeft className="mr-2" /> Back to Chemicals
      </Link>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
          Edit Chemical Record
        </h1>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">{error}</div>}

        {isLoading ? (
           <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-b-2 border-[var(--color-primary-600)] rounded-full"></div></div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border ${formErrors.name ? 'border-red-500' : 'border-none'} outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)]`} />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border-none outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
                <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border ${formErrors.price ? 'border-red-500' : 'border-none'} outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)]`} />
                {formErrors.price && <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border ${formErrors.quantity ? 'border-red-500' : 'border-none'} outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)]`} />
                {formErrors.quantity && <p className="text-xs text-red-500 mt-1">{formErrors.quantity}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border-none outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)] cursor-pointer">
                  <option value="kg">kg</option>
                  <option value="litre">litre</option>
                  <option value="ml">ml</option>
                  <option value="g">g</option>
                  <option value="unit">unit</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border ${formErrors.category ? 'border-red-500' : 'border-none'} outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)]`} />
                {formErrors.category && <p className="text-xs text-red-500 mt-1">{formErrors.category}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border-none outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)] cursor-pointer">
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Pesticide">Pesticide</option>
                  <option value="Herbicide">Herbicide</option>
                  <option value="Fungicide">Fungicide</option>
                  <option value="Insecticide">Insecticide</option>
                  <option value="Growth Regulator">Growth Regulator</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chemical Image</label>
              <div className="flex items-center gap-4">
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                )}
                <div className="flex-grow relative">
                  <input 
                    type="file" 
                    onChange={uploadFileHandler}
                    accept="image/*"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border-none outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)] text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary-50)] file:text-[var(--color-primary-700)] hover:file:bg-[var(--color-primary-100)]"
                  />
                  {uploading && <div className="absolute inset-y-0 right-4 flex items-center"><div className="animate-spin h-5 w-5 border-b-2 border-[var(--color-primary-600)] rounded-full"></div></div>}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border ${formErrors.description ? 'border-red-500' : 'border-none'} outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none`}></textarea>
              {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Application Method (Optional)</label>
              <textarea name="applicationMethod" rows="2" value={formData.applicationMethod} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border-none outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none"></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Safety Instructions (Optional)</label>
              <textarea name="safetyInstructions" rows="2" value={formData.safetyInstructions} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border-none outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none"></textarea>
            </div>

            <Button type="submit" variant="primary" className="py-4 px-8 flex items-center gap-2 mt-4 ml-auto" isLoading={isLoading}>
              <FiSave /> Save Changes
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChemicalAddEditPage;
