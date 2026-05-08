import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { TbLeaf, TbMicroscope } from 'react-icons/tb';
import NotificationTray from './NotificationTray';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavLinks = () => {
    const prefix = userInfo?.role === 'admin' ? '/admin' : '/user';
    return [
      { name: 'Home', path: '/' },
      { name: 'Crops', path: userInfo ? `${prefix}/crops` : '/login' },
      { name: 'Chemicals', path: userInfo ? `${prefix}/chemicals` : '/login' },
      { name: 'Weather', path: userInfo ? `${prefix}/weather` : '/login' },
      { name: 'Plant Doctor', path: userInfo ? '/user/plant-doctor' : '/login' },
      { name: 'Feedback', path: '/feedback' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-white/20 dark:border-neutral-800 shadow-xl' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <TbLeaf className={`text-3xl ${isScrolled ? 'text-[var(--color-primary-500)]' : 'text-white'} group-hover:rotate-12 transition-all duration-300`} />
            <span className={`text-2xl font-bold font-heading tracking-tight transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              Smart Agro
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-[var(--color-primary-400)] relative group ${
                  location.pathname === link.path 
                    ? 'text-[var(--color-primary-500)]' 
                    : isScrolled ? 'text-gray-600' : 'text-white/80'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--color-primary-500)] origin-left transform transition-transform duration-300 ${
                  location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {userInfo ? (
              <>
              <NotificationTray />
                {/* Theme toggle removed */}
                <div className="relative">
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center text-[var(--color-primary-700)]">
                      <FiUser />
                    </div>
                    <span className="text-sm font-medium text-gray-700 select-none">{userInfo.firstName}</span>
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                      <Link 
                        to={userInfo.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} 
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/user/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Profile Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="px-5 py-2 text-sm font-medium text-white bg-[var(--color-primary-600)] rounded-lg hover:bg-[var(--color-primary-700)] hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel absolute top-full left-0 w-full border-t border-gray-100 animate-[slide-in-left_0.3s_ease-out]">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-600)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {userInfo && (
              <Link
                to="/user/profile"
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-600)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile Settings
              </Link>
            )}
            {!userInfo && (
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-[var(--color-primary-600)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
            {/* Theme toggle removed for light mode only design */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

