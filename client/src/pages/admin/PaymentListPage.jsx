import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPayments, updatePaymentStatus, processRefund } from '../../redux/slices/paymentSlice';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { FiCheck, FiX, FiRefreshCcw, FiInfo } from 'react-icons/fi';

const PaymentListPage = () => {
  const dispatch = useDispatch();
  const { payments, isLoading, error } = useSelector((state) => state.payments);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(''); // 'payment' or 'refund'
  const [modalAction, setModalAction] = useState(''); // 'Approve' or 'Reject'
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    dispatch(fetchAllPayments());
  }, [dispatch]);

  const openModal = (id, mode, action) => {
    setSelectedOrderId(id);
    setModalMode(mode);
    setModalAction(action);
    setAdminNotes('');
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    const status = modalMode === 'payment' 
      ? (modalAction === 'Approve' ? 'Completed' : 'Rejected')
      : (modalAction === 'Approve' ? 'Refunded' : 'Refund_Rejected');

    const actionThunk = modalMode === 'payment' ? updatePaymentStatus : processRefund;
    
    const result = await dispatch(actionThunk({ id: selectedOrderId, status, adminNotes }));
    
    if (actionThunk.fulfilled.match(result)) {
      toast.success(`${modalMode === 'payment' ? 'Payment' : 'Refund'} ${modalAction.toLowerCase()}d successfully`);
      setIsModalOpen(false);
    } else {
      toast.error(result.payload || `Failed to ${modalAction.toLowerCase()} ${modalMode}`);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-orange-100 text-orange-700',
      Completed: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
      Refund_Pending: 'bg-blue-100 text-blue-700',
      Refunded: 'bg-purple-100 text-purple-700',
      Refund_Rejected: 'bg-red-200 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">All Transactions</h1>
        <p className="text-gray-500 mt-1">Review all marketplace financial records.</p>
      </div>

      {isLoading && payments.length === 0 ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-600)]"></div></div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">{error}</div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Transaction</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">User</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase text-center">Items</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Total</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                  <th className="p-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="p-4">
                      <div className="text-sm font-mono text-gray-500">{p.transactionId}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{new Date(p.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{p.user?.firstName} {p.user?.lastName}</div>
                      <div className="text-xs text-gray-500">{p.user?.email}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                      {p.items.length}
                    </td>
                    <td className="p-4 font-bold text-[var(--color-secondary-600)] text-sm">${(p.totalAmount || 0).toFixed(2)}</td>
                    <td className="p-4">
                      {getStatusBadge(p.paymentStatus)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {p.paymentStatus === 'Pending' && (
                          <>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              title="Approve Payment"
                              onClick={() => openModal(p._id, 'payment', 'Approve')}
                              className="w-8 h-8 !p-0"
                            >
                              <FiCheck />
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              title="Reject Payment"
                              onClick={() => openModal(p._id, 'payment', 'Reject')}
                              className="w-8 h-8 !p-0"
                            >
                              <FiX />
                            </Button>
                          </>
                        )}
                        {p.paymentStatus === 'Refund_Pending' && (
                          <>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              title="Approve Refund"
                              onClick={() => openModal(p._id, 'refund', 'Approve')}
                              className="w-8 h-8 !p-0"
                            >
                              <FiCheck />
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              title="Reject Refund"
                              onClick={() => openModal(p._id, 'refund', 'Reject')}
                              className="w-8 h-8 !p-0"
                            >
                              <FiX />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Action Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalAction} ${modalMode === 'payment' ? 'Payment' : 'Refund Request'}`}
        footer={(
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              variant={modalAction === 'Approve' ? 'primary' : 'danger'} 
              onClick={handleConfirmAction}
            >
              Confirm {modalAction}
            </Button>
          </>
        )}
      >
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl flex items-start gap-3 ${modalAction === 'Approve' ? 'bg-green-50 text-green-700 dark:bg-green-900/10' : 'bg-red-50 text-red-700 dark:bg-red-900/10'}`}>
            <FiInfo className="mt-1 shrink-0" />
            <p className="text-sm">
              Are you sure you want to <strong>{modalAction.toLowerCase()}</strong> this {modalMode}? This action will notify the user and update the transaction status.
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Admin Notes (Optional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={`Enter any notes for the user regarding this ${modalAction.toLowerCase()}al...`}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] min-h-[100px] transition-all"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentListPage;
