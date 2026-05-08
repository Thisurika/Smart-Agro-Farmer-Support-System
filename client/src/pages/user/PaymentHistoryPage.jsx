import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPayments, requestRefund } from '../../redux/slices/paymentSlice';
import { FiBox, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const PaymentHistoryPage = () => {
  const dispatch = useDispatch();
  const { payments, isLoading, error } = useSelector((state) => state.payments);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    dispatch(fetchMyPayments());
  }, [dispatch]);

  const handleRefundClick = (id) => {
    setSelectedOrderId(id);
    setRefundReason('');
    setIsModalOpen(true);
  };

  const handleRefundSubmit = async () => {
    if (!refundReason) {
      toast.error('Please enter a reason for the refund request');
      return;
    }
    
    const result = await dispatch(requestRefund({ id: selectedOrderId, refundReason }));
    if (requestRefund.fulfilled.match(result)) {
      toast.success('Refund request submitted successfully');
      setIsModalOpen(false);
    } else {
      toast.error(result.payload || 'Failed to submit refund request');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <FiCheckCircle className="text-green-500" />;
      case 'Pending': return <FiClock className="text-orange-500" />;
      case 'Rejected': return <FiXCircle className="text-red-500" />;
      case 'Refund_Pending': return <FiClock className="text-blue-500" />;
      case 'Refunded': return <FiCheckCircle className="text-purple-500" />;
      case 'Refund_Rejected': return <FiXCircle className="text-red-700" />;
      default: return <FiCheckCircle className="text-gray-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Pending': return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Rejected': return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'Refund_Pending': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Refunded': return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Refund_Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400';
      default: return 'bg-gray-50 text-gray-700 dark:bg-neutral-800 dark:text-gray-400';
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white mb-8">
        Order History
      </h1>

      {isLoading && payments.length === 0 ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-600)]"></div></div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">{error}</div>
      ) : payments.length === 0 ? (
        <div className="bg-gray-50 dark:bg-neutral-900 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4 text-3xl">
            <FiBox />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Orders Found</h3>
          <p className="text-gray-500 mt-2">You haven't placed any agricultural orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {payments.map((order) => (
            <div key={order._id} className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-400">Order #{order.transactionId}</span>
                    <span className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full ${getStatusClass(order.paymentStatus)}`}>
                      {getStatusIcon(order.paymentStatus)} {order.paymentStatus.replace('_', ' ')}
                    </span>
                  </div>
                  {order.paymentStatus === 'Completed' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRefundClick(order._id)}
                      className="text-xs"
                    >
                      Request Refund
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-xs text-gray-500 uppercase font-bold mb-1">Date</h4>
                    <p className="text-gray-900 dark:text-white font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 uppercase font-bold mb-1">Total Amount</h4>
                    <p className="text-[var(--color-secondary-600)] font-bold">${(order.totalAmount || 0).toFixed(2)}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <h4 className="text-xs text-gray-500 uppercase font-bold mb-1">Shipping</h4>
                    <p className="text-gray-900 dark:text-white text-sm">{order.billingAddress}</p>
                  </div>
                  {order.refundReason && (
                    <div className="sm:col-span-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                      <h4 className="text-xs text-blue-500 uppercase font-bold mb-1">Refund Reason</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 italic">"{order.refundReason}"</p>
                    </div>
                  )}
                  {order.adminNotes && (
                    <div className="sm:col-span-2 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                      <h4 className="text-xs text-gray-500 uppercase font-bold mb-1">Admin Notes</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{order.adminNotes}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/3 bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 custom-scrollbar overflow-y-auto max-h-48">
                <h4 className="text-xs text-gray-500 uppercase font-bold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Items Included</h4>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-900 dark:text-white line-clamp-1 flex-1 pr-4">{item.quantity}x {item.name}</span>
                      <span className="text-gray-500 font-bold">${(item.totalPrice || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Refund Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request Refund"
        footer={(
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleRefundSubmit}>Submit Request</Button>
          </>
        )}
      >
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Please provide a valid reason for your refund request. Our administrators will review it shortly.
          </p>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Refund Reason</label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Explain why you are requesting a refund..."
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] min-h-[120px] transition-all"
            />
          </div>
        </div>
      </Modal>
    </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;
