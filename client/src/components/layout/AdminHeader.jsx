import React, { useState } from 'react';
import { FiMenu, FiBell, FiSearch, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import NotificationTray from '../common/NotificationTray';

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex w-full bg-white drop-shadow-1">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm lg:hidden"
          >
            <FiMenu className="text-xl" />
          </button>
        </div>

        <div className="hidden sm:block">
          <form action="#" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <FiSearch className="text-gray-500 hover:text-primary" />
              </button>
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none xl:w-125"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7 ml-auto">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Theme toggle removed */}
            <li>
              <NotificationTray />
            </li>
          </ul>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-4"
            >
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black">
                  {userInfo?.firstName} {userInfo?.lastName}
                </span>
                <span className="block text-xs text-gray-500">Administrator</span>
              </span>

              <span className="h-10 w-10 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center text-[var(--color-primary-700)] font-bold">
                {userInfo?.firstName?.charAt(0)}
              </span>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default"
              >
                <div className="flex flex-col border-b border-stroke">
                  <Link
                    to="/user/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3.5 px-6 py-4.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base text-black"
                  >
                    Admin Profile
                  </Link>
                </div>
                <button
                  className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base text-red-500"
                  onClick={handleLogout}
                >
                  <FiLogOut />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
