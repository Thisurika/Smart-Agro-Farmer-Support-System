import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FiHome, FiUsers, FiBox, FiMessageSquare, FiDollarSign, FiCloudDrizzle, FiDroplet
} from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { payments } = useSelector((state) => state.payments);
  const { feedbacks } = useSelector((state) => state.feedbacks);

  // Calculate badge counts
  const pendingPayments = payments?.filter(p => p.paymentStatus === 'Pending' || p.paymentStatus === 'Refund_Pending')?.length || 0;
  const totalFeedbacks = feedbacks?.length || 0;

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Users', path: '/admin/users', icon: <FiUsers /> },
    { name: 'Crops', path: '/admin/crops', icon: <TbLeaf /> },
    { name: 'Chemicals', path: '/admin/chemicals', icon: <FiDroplet /> },
    { name: 'Feedback', path: '/admin/feedback', icon: <FiMessageSquare />, badge: totalFeedbacks },
    { name: 'Payments', path: '/admin/payments', icon: <FiDollarSign />, badge: pendingPayments },
    { name: 'Weather', path: '/admin/weather', icon: <FiCloudDrizzle /> },
  ];

  return (
    <aside
      className={`absolute left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-y-hidden bg-neutral-900 border-none duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } shadow-2xl`}
    >
      <div className="flex items-center justify-between gap-2 px-8 py-8 lg:py-10">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <TbLeaf className="text-2xl" />
          </div>
          <span className="text-2xl font-black font-heading tracking-tight text-white uppercase">
            Admin
          </span>
        </NavLink>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-white hover:text-primary-500 transition-colors"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
            <path d="M19 8H3.414l3.293-3.293a1 1 0 10-1.414-1.414l-5 5a1 1 0 000 1.414l5 5a1 1 0 001.414-1.414L3.414 10H19a1 1 0 100-2z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto no-scrollbar">
        <div>
          <h3 className="px-4 mb-4 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
            Main Menu
          </h3>
          <ul className="space-y-1">
            {menuItems.map((menu, index) => (
              <li key={index}>
                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    `group flex items-center justify-between gap-3.5 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`
                  }
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                      {menu.icon}
                    </span>
                    {menu.name}
                  </div>
                  {menu.badge > 0 && (
                    <span className="min-w-[22px] h-[22px] flex items-center justify-center text-[10px] font-black bg-red-500 text-white rounded-full px-1.5 shadow-lg shadow-red-500/30 animate-pulse">
                      {menu.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-6 border-t border-neutral-800">
        <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest text-center">
          &copy; Smart Agro v2.0
        </p>
      </div>
    </aside>
  );
};

export default AdminSidebar;

