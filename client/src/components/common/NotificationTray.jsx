import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationRead } from '../../redux/slices/notificationSlice';
import { FiBell, FiCheck, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NotificationTray = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, isLoading } = useSelector((state) => state.notifications);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchNotifications());
      // Poll every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchNotifications());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [dispatch, userInfo]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleNotificationClick = (id, link) => {
    handleMarkRead(id);
    setIsOpen(false);
    if (link) {
      navigate(link);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'payment': return <FiInfo className="text-blue-500" />;
      case 'refund': return <FiAlertCircle className="text-orange-500" />;
      default: return <FiBell className="text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-[var(--color-primary-600)] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
      >
        <FiBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{unreadCount} Unread</span>
            </div>
            
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {isLoading && notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <FiBell className="text-3xl text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n._id} 
                    onClick={() => handleNotificationClick(n._id, n.link)}
                    className={`p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors relative group cursor-pointer ${!n.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-1">{getIcon(n.type)}</div>
                      <div className="flex-1">
                        <p className={`text-sm ${!n.isRead ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                          {n.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-gray-400 italic">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                          {n.link && (
                            <span className="text-[10px] font-bold text-[var(--color-primary-600)] uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to View →
                            </span>
                          )}
                        </div>
                      </div>
                      {!n.isRead && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkRead(n._id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-green-500 transition-all"
                          title="Mark as read"
                        >
                          <FiCheck />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-neutral-800/50 text-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationTray;
