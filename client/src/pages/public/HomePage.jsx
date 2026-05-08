import React from 'react';
import HeroSection from '../../components/home/HeroSection';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCloudRain, FiShield, FiUsers } from 'react-icons/fi';

const HomePage = () => {
  const features = [
    {
      icon: <FiTrendingUp className="text-4xl text-[var(--color-primary-500)]" />,
      title: "Smart Crop Management",
      desc: "Manage your inventory efficiently with autonomous out-of-stock tracking."
    },
    {
      icon: <FiCloudRain className="text-4xl text-[var(--color-accent-500)]" />,
      title: "Live Weather Tracking",
      desc: "Get hyper-local, real-time forecast updates for multiple saved locations."
    },
    {
      icon: <FiShield className="text-4xl text-[var(--color-secondary-500)]" />,
      title: "Secure Transactions",
      desc: "Fully integrated payment and transparent automated refund channels."
    },
    {
      icon: <FiUsers className="text-4xl text-purple-500" />,
      title: "Community Driven",
      desc: "Anonymous reviews, transparent ratings, and responsive direct ticket support."
    }
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Feature Section */}
      <section className="py-24 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-sm font-bold text-[var(--color-primary-600)] tracking-widest uppercase mb-2">Our Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold font-heading text-neutral-900 dark:text-white">
              Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-500)] to-green-300">succeed</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10, scale: 1.02 }}
                className="premium-card p-8 text-center group"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="w-20 h-20 mx-auto rounded-2xl bg-white dark:bg-neutral-800 flex items-center justify-center mb-8 shadow-xl group-hover:shadow-primary-500/20 group-hover:rotate-6 transition-all duration-300 border border-neutral-100 dark:border-neutral-700">
                  <div className="transform group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-4 font-heading text-neutral-900 dark:text-white group-hover:text-[var(--color-primary-600)] transition-colors">{feature.title}</h4>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
                <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold text-[var(--color-primary-600)] cursor-pointer hover:underline">Learn more ↗</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="py-24 relative overflow-hidden bg-neutral-950">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--color-primary-500)] rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10" data-aos="zoom-in">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-extrabold font-heading text-white mb-8 leading-tight">
              Ready to <span className="text-gradient">revolutionize</span> your farm?
            </h2>
            <p className="text-xl text-neutral-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Join the future of agricultural management. Smart Agro System provides the tools you need to maximize yield and minimize waste.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="/signup" 
                className="group relative inline-flex items-center gap-2 px-10 py-5 bg-[var(--color-primary-600)] text-white font-bold rounded-2xl shadow-2xl shadow-primary-900/40 hover:bg-[var(--color-primary-700)] hover:scale-105 transition-all outline-none"
              >
                Get Started Now
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <a href="/contact" className="px-10 py-5 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 backdrop-blur-md transition-all">
                Schedule Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
