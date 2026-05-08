import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import ChatWidget from '../common/ChatWidget';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';

const MainLayout = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 100
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Navbar />
      <main className="flex-1 w-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full"
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default MainLayout;

