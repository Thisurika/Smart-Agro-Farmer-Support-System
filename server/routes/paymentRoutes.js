const express = require('express');
const router = express.Router();
const {
  createPayment,
  getMyPayments,
  getPayments,
  updatePaymentStatus,
  requestRefund,
  updateRefundStatus
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validatePayment } = require('../middleware/validationMiddleware');

router.route('/')
  .post(protect, validatePayment, createPayment)
  .get(protect, admin, getPayments);

router.route('/my-payments')
  .get(protect, getMyPayments);

router.route('/:id/status')
  .put(protect, admin, updatePaymentStatus);

router.route('/:id/refund-request')
  .put(protect, requestRefund);

router.route('/:id/refund-process')
  .put(protect, admin, updateRefundStatus);

module.exports = router;
