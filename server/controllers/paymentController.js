const Payment = require('../models/Payment');
const Crop = require('../models/Crop');
const Chemical = require('../models/Chemical');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { notifyAdmins, createNotification } = require('../utils/notificationUtils');

// @desc    Create new payment/order
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, paymentMethod, billingAddress } = req.body;

    if (!items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'No items in cart' });
    }

    // 1. Verify existence and stock for each item
    const orderItems = [];
    let calculatedTotal = 0;

    for (const itemData of items) {
      let dbItem;
      if (itemData.itemType === 'Crop') {
        dbItem = await Crop.findById(itemData.item).session(session);
      } else if (itemData.itemType === 'Chemical') {
        dbItem = await Chemical.findById(itemData.item).session(session);
      }

      if (!dbItem) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Item ${itemData.name} not found in database` });
      }

      if (dbItem.quantity < itemData.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: `Insufficient stock for ${dbItem.name}. Available: ${dbItem.quantity}, Requested: ${itemData.quantity}` 
        });
      }

      // Re-calculate price on server to prevent client-side tampering
      const totalPrice = dbItem.price * itemData.quantity;
      calculatedTotal += totalPrice;

      orderItems.push({
        itemType: itemData.itemType,
        item: dbItem._id,
        name: dbItem.name,
        quantity: itemData.quantity,
        unitPrice: dbItem.price,
        totalPrice: totalPrice
      });
    }

    // 2. Deduct stock within the transaction
    for (const itemData of items) {
      if (itemData.itemType === 'Crop') {
        await Crop.findByIdAndUpdate(itemData.item, { $inc: { quantity: -itemData.quantity } }, { session });
      } else if (itemData.itemType === 'Chemical') {
        await Chemical.findByIdAndUpdate(itemData.item, { $inc: { quantity: -itemData.quantity } }, { session });
      }
    }

    // 3. Create the payment record with cryptographically secure transaction ID
    const transactionId = `TXN-${crypto.randomUUID().replace(/-/g, '').substring(0, 12).toUpperCase()}`;
    
    const payment = new Payment({
      user: req.user._id,
      items: orderItems,
      totalAmount: calculatedTotal,
      paymentMethod,
      billingAddress,
      paymentStatus: 'Pending',
      transactionId,
    });

    const createdPayment = await payment.save({ session });

    // 4. Commit the transaction — all or nothing
    await session.commitTransaction();
    session.endSession();

    // Notify admins (outside transaction — non-critical)
    await notifyAdmins({
      message: `New payment request from ${req.user.firstName} ${req.user.lastName} ($${calculatedTotal.toFixed(2)})`,
      type: 'payment',
      link: '/admin/payments'
    });

    res.status(201).json(createdPayment);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update payment status (Admin)
// @route   PUT /api/payments/:id/status
// @access  Private/Admin
const updatePaymentStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // If rejecting a pending payment, return stock
    if (status === 'Rejected' && payment.paymentStatus === 'Pending') {
      for (const item of payment.items) {
        if (item.itemType === 'Crop') {
          await Crop.findByIdAndUpdate(item.item, { $inc: { quantity: item.quantity } });
        } else if (item.itemType === 'Chemical') {
          await Chemical.findByIdAndUpdate(item.item, { $inc: { quantity: item.quantity } });
        }
      }
    }

    payment.paymentStatus = status;
    payment.adminNotes = adminNotes || payment.adminNotes;
    await payment.save();

    // Notify user of status update
    await createNotification({
      user: payment.user,
      message: `Your payment ${payment.transactionId} has been ${status.toLowerCase()}`,
      type: 'payment',
      link: '/user/payments'
    });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Request refund (User)
// @route   PUT /api/payments/:id/refund-request
// @access  Private
const requestRefund = async (req, res) => {
  try {
    const { refundReason } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (payment.paymentStatus !== 'Completed') {
      return res.status(400).json({ message: 'Only completed payments can be refunded' });
    }

    payment.paymentStatus = 'Refund_Pending';
    payment.refundReason = refundReason;
    await payment.save();

    // Notify admins of refund request
    await notifyAdmins({
      message: `New refund request for payment ${payment.transactionId} from ${req.user.firstName}`,
      type: 'refund',
      link: '/admin/payments'
    });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Process refund (Admin)
// @route   PUT /api/payments/:id/refund-process
// @access  Private/Admin
const updateRefundStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.paymentStatus !== 'Refund_Pending') {
      return res.status(400).json({ message: 'No pending refund request' });
    }

    payment.paymentStatus = status; // Refunded or Refund_Rejected
    payment.adminNotes = adminNotes || payment.adminNotes;
    await payment.save();

    // If refund accepted, optionally return stock? 
    // Usually crops aren't returned physically easily, but for chemicals it might be.
    // For now, let's keep it simple and not return stock automatically on refund 
    // unless the admin manually adjusts inventory.

    // Notify user
    await createNotification({
      user: payment.user,
      message: `Your refund request for ${payment.transactionId} has been ${status === 'Refunded' ? 'accepted' : 'rejected'}`,
      type: 'refund',
      link: '/user/payments'
    });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user's payments
// @route   GET /api/payments/my-payments
// @access  Private
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).populate('user', 'firstName lastName email').sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createPayment,
  updatePaymentStatus,
  requestRefund,
  updateRefundStatus,
  getMyPayments,
  getPayments
};
