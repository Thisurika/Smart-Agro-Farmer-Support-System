import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TbLeaf } from 'react-icons/tb';
import { FiShoppingCart } from 'react-icons/fi';

const CropCard = ({ item, type = 'crop' }) => {
  const isOutOfStock = item.status === 'Out of Stock' || item.quantity === 0;
  const [imgError, setImgError] = useState(false);

  // Determine if we have a valid image
  const hasImage = item.image && item.image !== 'crop-placeholder.webp' && item.image !== 'chemical-placeholder.webp' && !imgError;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="glass-panel overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col h-full bg-white dark:bg-neutral-900 group"
    >
      {/* Image Header */}
      <div className="relative h-52 w-full overflow-hidden">
        {hasImage ? (
          <img 
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          /* Premium gradient placeholder with icon */
          <div className={`w-full h-full flex items-center justify-center ${
            type === 'chemical' 
              ? 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900'
              : 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900'
          }`}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <TbLeaf className={`text-6xl ${
                type === 'chemical' 
                  ? 'text-blue-300 dark:text-blue-700' 
                  : 'text-emerald-300 dark:text-emerald-700'
              }`} />
            </motion.div>
          </div>
        )}
        
        {/* Hover overlay with quick action */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-md backdrop-blur-md ${
            isOutOfStock 
              ? 'bg-red-500/90 text-white border border-red-400/50' 
              : 'bg-[var(--color-primary-500)]/90 text-white border border-[var(--color-primary-400)]/50'
          }`}>
            {item.status}
          </span>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4 text-xs font-medium text-white bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
          {item.category}
        </div>

        {/* Quick Add Button (visible on hover) */}
        {!isOutOfStock && (
          <Link
            to={`/user/${type}s/${item._id}`}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[var(--color-primary-600)] shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 hover:bg-[var(--color-primary-600)] hover:text-white"
          >
            <FiShoppingCart className="text-lg" />
          </Link>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[var(--color-primary-600)] transition-colors">{item.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
          {item.description}
        </p>
        
        {/* Details Data */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-2 text-center border border-gray-100 dark:border-gray-700">
            <span className="block text-xs text-gray-400">Price</span>
            <span className="font-bold text-[var(--color-primary-600)]">${item.price.toFixed(2)}</span>
          </div>
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-2 text-center border border-gray-100 dark:border-gray-700">
            <span className="block text-xs text-gray-400">Available</span>
            <span className="font-bold">{item.quantity} {item.unit || 'kg'}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/user/${type}s/${item._id}`}
          className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            isOutOfStock 
              ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed pointer-events-none'
              : 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-600)] hover:text-white hover:shadow-lg hover:shadow-primary-600/20 dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-100)] dark:hover:bg-[var(--color-primary-600)] dark:hover:text-white'
          }`}
        >
          {isOutOfStock ? 'Sold Out' : 'View Details →'}
        </Link>
      </div>
    </motion.div>
  );
};

export default CropCard;
