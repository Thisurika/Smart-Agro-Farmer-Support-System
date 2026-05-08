import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChemicals } from '../../redux/slices/chemicalSlice';
import ChemicalCard from '../../components/common/ChemicalCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

const ChemicalBrowsePage = () => {
  const dispatch = useDispatch();
  const { chemicals, isLoading, error } = useSelector((state) => state.chemicals);
  
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const categories = ["Fertilizer", "Pesticide", "Herbicide", "Fungicide", "Insecticide", "Growth Regulator", "Other"];

  useEffect(() => {
    dispatch(fetchChemicals({ keyword, category }));
  }, [dispatch, keyword, category]);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold font-heading text-neutral-900 dark:text-white mb-3">
            Agro-Chemicals & Fertilizers
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg">
            High-quality agrochemicals and organic fertilizers to protect and enhance your farm's yield.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input 
            type="text" 
            placeholder="Search chemicals by name..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <div className="relative min-w-[200px]">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10" />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] appearance-none cursor-pointer shadow-sm relative"
          >
            <option value="">All Types</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-600)]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center font-medium">{error}</div>
      ) : chemicals.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center text-4xl mb-4">🧪</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No chemicals found</h3>
          <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {chemicals.map((chemical) => (
            <ChemicalCard key={chemical._id} chemical={chemical} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChemicalBrowsePage;
