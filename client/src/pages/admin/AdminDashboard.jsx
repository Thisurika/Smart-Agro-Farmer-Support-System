import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCrops } from '../../redux/slices/cropSlice';
import { fetchFeedbacks } from '../../redux/slices/feedbackSlice';
import { fetchAllPayments } from '../../redux/slices/paymentSlice';
import { fetchAllUsers } from '../../redux/slices/userSlice';
import { FiUsers, FiBox, FiMessageSquare, FiDollarSign, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { crops } = useSelector((state) => state.crops);
  const { feedbacks } = useSelector((state) => state.feedbacks);
  const { payments } = useSelector((state) => state.payments);
  const { users } = useSelector((state) => state.users);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCrops());
    dispatch(fetchFeedbacks());
    dispatch(fetchAllPayments());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // ─── Compute Real Stats ───────────────────────────────────
  const totalValue = crops?.reduce((acc, curr) => acc + (Number(curr.price || 0) * Number(curr.quantity || 0)), 0) || 0;
  const totalRevenue = payments?.filter(p => p.paymentStatus === 'Completed')?.reduce((acc, p) => acc + (p.totalAmount || 0), 0) || 0;
  const pendingPayments = payments?.filter(p => p.paymentStatus === 'Pending')?.length || 0;
  const totalUsers = users?.length || 0;

  // Build revenue chart from real payment data (group by month)
  const revenueByMonth = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  payments?.filter(p => p.paymentStatus === 'Completed').forEach(p => {
    const date = new Date(p.createdAt);
    const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    revenueByMonth[key] = (revenueByMonth[key] || 0) + (p.totalAmount || 0);
  });

  const revenueData = Object.entries(revenueByMonth)
    .slice(-6)
    .map(([name, value]) => ({ name: name.split(' ')[0], value: Math.round(value) }));

  // If no real data, show placeholder
  const chartData = revenueData.length > 0 ? revenueData : [
    { name: 'No Data', value: 0 },
  ];

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white mb-2">
            System Dashboard
          </h1>
          <p className="text-gray-500">Welcome, Administrator {userInfo?.firstName}. Here is your system overview.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          {pendingPayments > 0 && (
            <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-bold border border-amber-200 flex items-center gap-2 animate-pulse">
              <FiAlertCircle /> {pendingPayments} Pending Approval{pendingPayments > 1 ? 's' : ''}
            </div>
          )}
          <div className="px-4 py-2 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] rounded-full text-sm font-bold border border-[var(--color-primary-200)]">
            System Live & Operational
          </div>
        </div>
      </div>

      {/* Core Metrics — REAL DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: 'primary', sub: `${payments?.filter(p => p.paymentStatus === 'Completed')?.length || 0} completed orders` },
          { label: 'Active Products', value: crops.length, icon: <FiBox />, color: 'accent', sub: `$${totalValue.toLocaleString()} inventory value` },
          { label: 'Total Feedbacks', value: feedbacks.length, icon: <FiMessageSquare />, color: 'secondary', sub: 'Community reviews' },
          { label: 'Registered Users', value: totalUsers, icon: <FiUsers />, color: 'purple', sub: `${users?.filter(u => u.isActive)?.length || 0} active accounts` }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="premium-card p-6 border-none bg-white dark:bg-neutral-900 group"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl transition-transform group-hover:scale-110 group-hover:-rotate-3
              ${stat.color === 'primary' ? 'bg-primary-50 text-primary-600 shadow-primary-500/10' : 
                stat.color === 'accent' ? 'bg-blue-50 text-blue-600 shadow-blue-500/10' : 
                stat.color === 'secondary' ? 'bg-orange-50 text-orange-600 shadow-orange-500/10' : 
                'bg-purple-50 text-purple-600 shadow-purple-500/10'}`}
            >
              {stat.icon}
            </div>
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-neutral-900 dark:text-white leading-none">{stat.value}</h3>
            
            {/* Real sub-metric */}
            <div className="mt-4 text-[11px] font-bold text-neutral-400">
              {stat.sub}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Chart */}
        <div className="lg:col-span-2 premium-card p-8 border-none bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white font-heading">Revenue Analytics</h2>
            <span className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg text-xs font-bold px-3 py-1 text-neutral-500">
              {revenueData.length > 0 ? 'Live Data' : 'No Orders Yet'}
            </span>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '12px' }}
                  itemStyle={{ fontWeight: 800, fontSize: '14px' }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="var(--color-primary-500)" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="bg-neutral-950 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col shadow-2xl shadow-primary-950/20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-primary-500)] rounded-full blur-[100px] opacity-20 translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500 rounded-full blur-[80px] opacity-10 -translate-x-10 translate-y-10"></div>
          
          <h2 className="text-xl font-black mb-8 relative z-10 font-heading tracking-tight">Admin Portals</h2>
          
          <div className="flex-1 flex flex-col gap-4 relative z-10">
            <Link to="/admin/crops" className="bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/5 transition-all flex items-center justify-between group hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                  <TbLeaf />
                </div>
                <div>
                  <span className="block font-bold">Inventory</span>
                  <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">{crops.length} Records</span>
                </div>
              </div>
              <span className="text-neutral-600 group-hover:text-white transition-colors">→</span>
            </Link>
            
            <Link to="/admin/payments" className="bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/5 transition-all flex items-center justify-between group hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                  <FiDollarSign />
                </div>
                <div>
                  <span className="block font-bold">Payments</span>
                  <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">
                    {pendingPayments > 0 ? `${pendingPayments} Pending` : 'All Clear'}
                  </span>
                </div>
              </div>
              <span className="text-neutral-600 group-hover:text-white transition-colors">→</span>
            </Link>

            <Link to="/admin/feedback" className="bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/5 transition-all flex items-center justify-between group hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <FiMessageSquare />
                </div>
                <div>
                  <span className="block font-bold">Feedback</span>
                  <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">{feedbacks.length} Reviews</span>
                </div>
              </div>
              <span className="text-neutral-600 group-hover:text-white transition-colors">→</span>
            </Link>

            <Link to="/admin/users" className="bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/5 transition-all flex items-center justify-between group hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <FiUsers />
                </div>
                <div>
                  <span className="block font-bold">User Management</span>
                  <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">{totalUsers} Registered</span>
                </div>
              </div>
              <span className="text-neutral-600 group-hover:text-white transition-colors">→</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
