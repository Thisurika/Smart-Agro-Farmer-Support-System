import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChemicalDetails, clearChemicalDetails } from '../../redux/slices/chemicalSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import Button from '../../components/common/Button';
import { FiArrowLeft, FiShoppingCart, FiShield, FiDroplet } from 'react-icons/fi';

const ChemicalDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const { chemical, isLoading, error } = useSelector((state) => state.chemicals);

  useEffect(() => {
    dispatch(fetchChemicalDetails(id));
    return () => dispatch(clearChemicalDetails());
  }, [dispatch, id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-b-2 border-[var(--color-primary-600)] rounded-full"></div></div>;
  if (error) return <div className="pt-24 pb-12 px-4 text-center text-red-600">{error}</div>;
  if (!chemical) return null;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen">
      <Link to="/user/chemicals" className="inline-flex items-center text-gray-500 hover:text-[var(--color-primary-600)] transition-colors font-medium mb-8">
        <FiArrowLeft className="mr-2" /> Back to Chemicals
      </Link>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm grid grid-cols-1 lg:grid-cols-2">
        <div className="h-[400px] lg:h-auto bg-gray-50 p-8 flex items-center justify-center">
          {/* Image removed */}
        </div>

        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex gap-2 mb-4">
            <span className="bg-[var(--color-secondary-100)] text-[var(--color-secondary-700)] text-xs font-bold px-3 py-1.5 rounded-full">
              {chemical.category}
            </span>
            <span className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full">
              {chemical.type}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 dark:text-white mb-2">
            {chemical.name}
          </h1>
          <p className="text-lg text-gray-500 mb-6 font-medium">Brand: {chemical.brand || 'Generic'}</p>

          <div className="text-4xl font-bold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] mb-6">
            ${chemical.price.toFixed(2)}<span className="text-xl text-gray-400 font-normal">/{chemical.unit}</span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {chemical.description}
          </p>

          {(chemical.safetyInstructions || chemical.applicationMethod) && (
            <div className="flex flex-col gap-4 mb-8 bg-gray-50 dark:bg-neutral-800 p-5 rounded-2xl">
              {chemical.applicationMethod && (
                <div className="flex items-start gap-3">
                  <FiDroplet className="text-blue-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Application Method</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{chemical.applicationMethod}</p>
                  </div>
                </div>
              )}
              {chemical.safetyInstructions && (
                <div className="flex items-start gap-3">
                  <FiShield className="text-orange-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Safety Instructions</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{chemical.safetyInstructions}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Availability</span>
              {chemical.quantity > 0 ? (
                <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> In Stock ({chemical.quantity} {chemical.unit})
                </span>
              ) : (
                <span className="text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full text-sm">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Quantity</span>
              <select 
                value={qty} 
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-24 px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none cursor-pointer"
                disabled={chemical.quantity === 0}
              >
                {[...Array(chemical.quantity > 0 ? (chemical.quantity > 10 ? 10 : chemical.quantity) : 0).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>

            <Button 
              variant="primary" 
              className="w-full py-4 text-lg flex items-center justify-center gap-3 shadow-lg shadow-[var(--color-primary-500)]/30"
              disabled={chemical.quantity === 0}
              onClick={() => {
                dispatch(addToCart({
                  item: chemical._id,
                  name: chemical.name,
                  image: chemical.image,
                  unitPrice: chemical.price,
                  quantity: qty,
                  totalPrice: chemical.price * qty,
                  itemType: 'Chemical'
                }));
                navigate('/user/cart');
              }}
            >
              <FiShoppingCart className="text-xl" /> 
              {chemical.quantity > 0 ? 'Add to Cart' : 'Currently Unavailable'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemicalDetailPage;
