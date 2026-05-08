import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../redux/slices/cartSlice';
import Button from '../../components/common/Button';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/user/checkout');
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white mb-8 flex items-center gap-3">
        <FiShoppingBag className="text-[var(--color-primary-500)]" /> Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center text-4xl mb-6 text-gray-300">🛒</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-8">Looks like you haven't added any agriculture supplies yet.</p>
          <div className="flex gap-4">
            <Link to="/user/crops"><Button variant="primary">Browse Crops</Button></Link>
            <Link to="/user/chemicals"><Button variant="outline">Browse Chemicals</Button></Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.item} className="bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Image removed */}
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.itemType}</div>
                  <Link to={`/user/${item.itemType.toLowerCase()}s/${item.item}`} className="text-lg font-bold text-gray-900 dark:text-white hover:text-[var(--color-primary-600)] transition-colors">
                    {item.name}
                  </Link>
                  <div className="text-gray-500 mt-1">
                    Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex items-center bg-gray-50 dark:bg-neutral-800 rounded-xl p-1 border border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={() => {
                        if (item.quantity > 1) {
                          dispatch(addToCart({ ...item, quantity: item.quantity - 1, totalPrice: item.unitPrice * (item.quantity - 1) }));
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-neutral-700 transition-colors text-gray-500"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                    <button 
                      onClick={() => {
                        dispatch(addToCart({ ...item, quantity: item.quantity + 1, totalPrice: item.unitPrice * (item.quantity + 1) }));
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-neutral-700 transition-colors text-gray-500"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-xl font-bold text-[var(--color-secondary-600)] min-w-[80px] text-right">
                    ${item.totalPrice.toFixed(2)}
                  </div>
                  <button onClick={() => removeFromCartHandler(item.item)} className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-neutral-900 to-black p-8 rounded-3xl shadow-xl text-white h-max sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Items ({cartItems.length})</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6 mb-8 flex justify-between items-center text-xl font-bold">
              <span>Subtotal</span>
              <span className="text-[var(--color-primary-400)]">${totalAmount.toFixed(2)}</span>
            </div>
            <Button variant="primary" onClick={checkoutHandler} className="w-full py-4 text-lg flex items-center justify-center gap-2">
              Proceed to Checkout <FiArrowRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
