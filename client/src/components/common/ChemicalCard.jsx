import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiInfo } from 'react-icons/fi';
import { TbFlask } from 'react-icons/tb';
import Button from './Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ChemicalCard = ({ chemical }) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = chemical.image && chemical.image !== 'chemical-placeholder.webp' && !imgError;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-[var(--color-primary-500)]/10 transition-all group flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        {hasImage ? (
          <img
            src={chemical.image}
            alt={chemical.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <TbFlask className="text-6xl text-indigo-300 dark:text-indigo-700" />
            </motion.div>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-[var(--color-secondary-600)] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {chemical.category}
          </span>
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm w-max">
            {chemical.type}
          </span>
        </div>
        {chemical.quantity === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full uppercase tracking-wider text-sm shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white line-clamp-1 group-hover:text-[var(--color-primary-600)] transition-colors">
            {chemical.name}
          </h3>
          <span className="font-bold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] whitespace-nowrap ml-2">
            ${chemical.price.toFixed(2)}<span className="text-gray-400 text-sm font-normal">/{chemical.unit}</span>
          </span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
          {chemical.description}
        </p>
        
        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          <Link to={`/user/chemicals/${chemical._id}`} className="flex-grow">
            <Button variant="outline" className="w-full py-2.5 flex items-center justify-center gap-2">
              <FiInfo /> Details
            </Button>
          </Link>
          <Button 
            variant="primary" 
            className="w-12 h-[42px] flex items-center justify-center shrink-0 px-0"
            disabled={chemical.quantity === 0}
            onClick={() => toast.success(`Added ${chemical.name} to cart!`)}
          >
            <FiShoppingCart />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChemicalCard;
