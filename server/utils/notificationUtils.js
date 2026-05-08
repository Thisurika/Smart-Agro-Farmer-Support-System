const Notification = require('../models/Notification');
const User = require('../models/User');

const createNotification = async ({ user, message, type, link }) => {
  try {
    const notification = new Notification({
      user,
      message,
      type,
      link
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Notification Error:', error);
  }
};

const notifyAdmins = async ({ message, type, link }) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      user: admin._id,
      message,
      type,
      link
    }));
    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Admin Notification Error:', error);
  }
};

module.exports = {
  createNotification,
  notifyAdmins
};
