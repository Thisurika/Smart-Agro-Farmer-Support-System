import React from 'react';
import { TbLeaf } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import Button from './Button';

const Footer = () => {
  return (
    <footer className="bg-neutral-50 dark:bg-neutral-950 pt-24 pb-12 border-t border-neutral-200 dark:border-neutral-800 shrink-0 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-700 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-8 group cursor-pointer inline-flex">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-600)] flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <TbLeaf className="text-2xl" />
              </div>
              <span className="text-2xl font-black font-heading text-neutral-900 dark:text-white tracking-tight">
                Smart Agro
              </span>
            </Link>
            <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed mb-8 font-light">
              Empowering farmers with intelligent crop management, weather insights, and financial tools for a smarter, more sustainable future.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-neutral-900 dark:text-white font-black mb-8 text-xs uppercase tracking-[0.2em]">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/user/dashboard" className="text-neutral-500 hover:text-[var(--color-primary-600)] transition-colors text-sm font-medium">Dashboard Overview</Link></li>
              <li><Link to="/user/crops" className="text-neutral-500 hover:text-[var(--color-primary-600)] transition-colors text-sm font-medium">Marketplace</Link></li>
              <li><Link to="/user/chemicals" className="text-neutral-500 hover:text-[var(--color-primary-600)] transition-colors text-sm font-medium">Inventory Management</Link></li>
              <li><Link to="/user/weather" className="text-neutral-500 hover:text-[var(--color-primary-600)] transition-colors text-sm font-medium">Live Forecasts</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-neutral-900 dark:text-white font-black mb-8 text-xs uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-neutral-500 hover:text-[var(--color-primary-600)] transition-colors text-sm font-medium">Our Vision</Link></li>
              <li><Link to="/contact" className="text-neutral-500 hover:text-[var(--color-primary-600)] transition-colors text-sm font-medium">Contact Support</Link></li>
              <li><Link to="/careers" className="text-neutral-500 hover:text-[var(--color-primary-600)] transition-colors text-sm font-medium">Join Our Team</Link></li>
              <li><Link to="/legal" className="text-neutral-500 hover:text-[var(--color-primary-600)] transition-colors text-sm font-medium">Privacy & Legal</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-neutral-900 dark:text-white font-black mb-8 text-xs uppercase tracking-[0.2em]">Eco-System</h4>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 font-light leading-relaxed">Join 5,000+ farmers receiving our monthly agricultural insights.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-[var(--color-primary-500)] focus:outline-none border border-neutral-200 dark:border-neutral-800 px-5 py-3 w-full transition-all"
              />
              <Button variant="primary" size="md" className="w-full">
                Join Community
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest text-center md:text-left">
            &copy; {new Date().getFullYear()} Smart Agro System. Developed for Excellence.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-neutral-400 hover:text-[var(--color-primary-600)] transition-colors text-xs font-bold uppercase tracking-widest">Twitter</a>
            <a href="#" className="text-neutral-400 hover:text-[var(--color-primary-600)] transition-colors text-xs font-bold uppercase tracking-widest">LinkedIn</a>
            <a href="#" className="text-neutral-400 hover:text-[var(--color-primary-600)] transition-colors text-xs font-bold uppercase tracking-widest">Github</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
