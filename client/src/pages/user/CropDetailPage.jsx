import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCropDetails, clearCurrentCrop } from '../../redux/slices/cropSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { FiArrowLeft, FiShoppingCart, FiMapPin, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';

const CropDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);

  const { currentCrop: crop, isLoading, error } = useSelector((state) => state.crops);

  useEffect(() => {
    dispatch(fetchCropDetails(id));
    return () => {
      dispatch(clearCurrentCrop());
    };
  }, [dispatch, id]);

  if (isLoading || !crop) {
    return (
      <div className="pt-24 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-600)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 px-4 min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-4xl mx-auto border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  const isOutOfStock = crop.status === 'Out of Stock' || crop.quantity === 0;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <button 
        onClick={() => navigate('/user/crops')}
        className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary-600)] transition-colors mb-8 font-medium group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </button>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden glass-panel border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row shadow-sm">
        
        {/* Left: Image Placeholder */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-auto relative bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
          <div className="text-gray-300 dark:text-neutral-700">
            <TbLeaf className="text-9xl" />
          </div>
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className={`px-4 py-1.5 text-sm font-bold rounded-full shadow-lg backdrop-blur-md inline-block w-max ${
              isOutOfStock 
                ? 'bg-red-500/90 text-white border border-red-400' 
                : 'bg-[var(--color-primary-500)]/90 text-white border border-[var(--color-primary-400)]'
            }`}>
              {crop.status}
            </span>
          </div>
        </div>

        {/* Right: Details & Actions */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-neutral-900 dark:text-white">
                {crop.name}
              </h1>
              <span className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                {crop.category}
              </span>
            </div>
            
            <div className="text-4xl font-bold text-[var(--color-primary-600)] mb-6">
              ${crop.price.toFixed(2)} <span className="text-lg text-gray-400 font-medium">/ {crop.unit || 'kg'}</span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-8 whitespace-pre-wrap leading-relaxed text-lg">
              {crop.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                {isOutOfStock ? (
                  <FiXCircle className="text-2xl text-red-500 shrink-0" />
                ) : (
                  <FiCheckCircle className="text-2xl text-[var(--color-primary-500)] shrink-0" />
                )}
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Availability</p>
                  <p className={`font-bold ${isOutOfStock ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                    {crop.quantity} {crop.unit || 'kg'} in stock
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <FiMapPin className="text-2xl text-[var(--color-secondary-500)] shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Origin</p>
                  <p className="font-bold text-gray-900 dark:text-white truncate">
                    Verified Farm
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
              {!isOutOfStock && (
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">Quantity Selection</span>
                    <span className="text-xs text-gray-400">Total: ${(crop.price * qty).toFixed(2)}</span>
                  </div>
                  <select 
                    value={qty} 
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-32 px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] cursor-pointer font-bold"
                  >
                    {[...Array(crop.quantity > 0 ? (crop.quantity > 20 ? 20 : crop.quantity) : 0).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1} {crop.unit || 'kg'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Button 
                variant="primary" 
                size="lg" 
                className="w-full text-lg py-4 shadow-xl shadow-[var(--color-primary-500)]/20 flex gap-2 justify-center"
                disabled={isOutOfStock}
                onClick={() => {
                  dispatch(addToCart({
                    item: crop._id,
                    name: crop.name,
                    image: crop.imageUrl || 'https://images.unsplash.com/photo-1574316073164-8890fd6549b7?q=80&w=1000',
                    unitPrice: crop.price,
                    quantity: qty,
                    totalPrice: crop.price * qty,
                    itemType: 'Crop'
                  }));
                  navigate('/user/cart');
                }}
              >
                <FiShoppingCart className="text-xl" />
                {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}
              </Button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default CropDetailPage;
