import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPayment, resetPaymentStatus } from '../../redux/slices/paymentSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import Button from '../../components/common/Button';
import { FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { paymentStatus, isLoading, error } = useSelector((state) => state.payments);

  const [billingAddress, setBillingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  useEffect(() => {
    // If cart is empty and not in success mode, go back to cart
    if (cartItems.length === 0 && paymentStatus !== 'success' && !isLoading) {
      navigate('/user/cart');
    }

    // Success flow
    if (paymentStatus === 'success') {
      const timer = setTimeout(() => {
        dispatch(clearCart());
        dispatch(resetPaymentStatus());
        navigate('/user/payments');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cartItems, navigate, paymentStatus, dispatch, isLoading]);

  useEffect(() => {
    return () => {
      // Clear payment status when leaving page to avoid issues if returning
      if (paymentStatus === 'failed') {
        dispatch(resetPaymentStatus());
      }
    };
  }, [dispatch, paymentStatus]);

  const placeOrderHandler = (e) => {
    e.preventDefault();
    dispatch(createPayment({
      items: cartItems,
      billingAddress,
      paymentMethod
    }));
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 p-4">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg shadow-green-500/20">
          <FiCheckCircle />
        </div>
        <h1 className="text-4xl font-extrabold font-heading text-gray-900 dark:text-white mb-4">Payment Successful!</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">Your order has been placed and is now processing. Redirecting you to your order history...</p>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-1.5 w-48 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white mb-8">Checkout</h1>
      
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form */}
        <form onSubmit={placeOrderHandler} className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Shipping Address</h2>
            <textarea 
              required
              rows="3"
              placeholder="Enter your full farm/shipping address"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border-none outline-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
            />
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Payment Method</h2>
            <div className="space-y-3">
              {['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash'].map((method) => (
                <label key={method} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border ${paymentMethod === method ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-neutral-800'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[var(--color-primary-600)]"
                  />
                  <FiCreditCard className="text-gray-400 text-xl" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 text-lg mt-8" isLoading={isLoading}>
            Pay ${totalAmount.toFixed(2)} Securely
          </Button>
        </form>

        {/* Summary */}
        <div className="bg-gray-50 dark:bg-neutral-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 h-max">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar pr-2">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                {/* Image removed */}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="font-bold text-gray-900 dark:text-white">${item.totalPrice.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center text-xl font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span className="text-[var(--color-primary-600)]">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
