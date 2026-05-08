import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiMessageSquare, FiTrendingUp, FiSettings } from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const quickActions = [
    { title: 'Browse Market', icon: <TbLeaf />, desc: 'Explore and purchase premium crops.', link: '/user/crops', color: 'bg-green-100 text-green-600' },
    { title: 'Community Feedback', icon: <FiMessageSquare />, desc: 'Voice your opinions to the community.', link: '/feedback', color: 'bg-blue-100 text-blue-600' },
    { title: 'My Orders', icon: <FiShoppingBag />, desc: 'Track your recent purchases.', link: '/user/payments', color: 'bg-purple-100 text-purple-600' },
    { title: 'Profile Settings', icon: <FiSettings />, desc: 'Manage your personal farm details.', link: '/user/profile', color: 'bg-orange-100 text-orange-600' }
  ];

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-[2rem] p-10 sm:p-14 mb-12 text-white overflow-hidden shadow-2xl shadow-primary-900/20 bg-neutral-900"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-[var(--color-primary-600)] rounded-full blur-[100px] opacity-20"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], rotate: [0, -45, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] bg-emerald-500 rounded-full blur-[120px] opacity-10"
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6"
            >
              Account Verified
            </motion.span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading mb-4 leading-tight">
              Welcome back, <span className="text-gradient">{userInfo?.firstName || 'User'}</span>! 👋
            </h1>
            <p className="text-neutral-400 text-lg sm:text-xl font-light leading-relaxed">
              Your agricultural command center is ready. Monitor your yields, manage inventory, and explore new farming opportunities.
            </p>
          </div>
          <motion.div 
            initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 12, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            className="hidden lg:flex w-32 h-32 bg-white/5 backdrop-blur-2xl rounded-3xl items-center justify-center border border-white/10 shadow-2xl"
          >
            <TbLeaf className="text-6xl text-[var(--color-primary-400)]" />
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { label: 'Active Orders', value: '0', icon: <FiShoppingBag />, color: 'text-primary-600 bg-primary-50' },
          { label: 'Saved Crops', value: '4', icon: <TbLeaf />, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Feedback Given', value: '1', icon: <FiMessageSquare />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Farm Rating', value: 'New', icon: <FiTrendingUp />, color: 'text-purple-600 bg-purple-50' }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (idx * 0.1) }}
            className="premium-card p-6 flex items-center gap-5 border-none bg-white dark:bg-neutral-900"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${stat.color} dark:bg-neutral-800 dark:text-gray-400`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white leading-none">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white font-heading">Quick Actions</h2>
          <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-800 mx-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {quickActions.map((action, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + (idx * 0.1) }}
            >
              <Link 
                to={action.link}
                className="premium-card p-8 flex items-start gap-6 group border-none bg-white dark:bg-neutral-900"
              >
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${action.color}`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-[var(--color-primary-600)] transition-colors">
                      {action.title}
                    </h3>
                    <span className="text-neutral-300 group-hover:text-[var(--color-primary-500)] group-hover:translate-x-1 transition-all">→</span>
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                    {action.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;
