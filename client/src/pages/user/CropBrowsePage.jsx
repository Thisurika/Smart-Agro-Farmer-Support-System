import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCrops } from '../../redux/slices/cropSlice';
import CropCard from '../../components/common/CropCard';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CropBrowsePage = () => {
  const dispatch = useDispatch();
  const { crops, isLoading, error } = useSelector((state) => state.crops);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); // All, In Stock, Out of Stock

  useEffect(() => {
    dispatch(fetchCrops());
  }, [dispatch]);

  // Derived state filtering
  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          crop.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'In Stock') return matchesSearch && crop.status === 'In Stock';
    if (filter === 'Out of Stock') return matchesSearch && crop.status === 'Out of Stock';
    return matchesSearch;
  });

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-neutral-900 dark:text-white mb-2 decoration-[var(--color-primary-500)] underline decoration-4 underline-offset-4">
            Crop Market
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Discover and purchase premium quality crops directly from our network.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none transition-shadow shadow-sm"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-40">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 appearance-none bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none transition-shadow shadow-sm cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-600)]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-200">
          {error}
        </div>
      ) : filteredCrops.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-5xl mb-4 opacity-50">🌾</div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No crops found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredCrops.map((crop, index) => (
            <motion.div 
              key={crop._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <CropCard item={crop} type="crop" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CropBrowsePage;
