import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import Button from '../common/Button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const HeroSection = () => {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
      title: 'Smart Agriculture, Smarter Future',
      subtitle: 'Empowering farmers with intelligent crop management, weather insights, and financial tools.'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1592982537447-6f296c05d761?q=80&w=2070&auto=format&fit=crop',
      title: 'Precision Farming Solutions',
      subtitle: 'Monitor chemicals, harvest dates, and stock status effortlessly through our platform.'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2003&auto=format&fit=crop',
      title: 'AI-Driven Decisions',
      subtitle: 'Real-time weather tracking and community feedback right at your fingertips.'
    }
  ];

  return (
    <div className="relative h-[85vh] w-full -mt-20 overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1500}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            {/* Background Image with slow zoom/parallax effect */}
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            {/* Multi-layered Gradient Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-900/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent" />
            
            {/* Floating Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-1/4 w-64 h-64 bg-[var(--color-primary-500)]/10 rounded-full blur-3xl"
              />
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
              />
            </div>
            
            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6">
                      Smart Agro v2.0
                    </span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading text-white mb-6 leading-[1.1] drop-shadow-2xl">
                      {slide.title.split(' ').map((word, i) => (
                        <span key={i} className={i === 1 ? "text-gradient block md:inline" : ""}>
                          {word}{' '}
                        </span>
                      ))}
                    </h1>
                  </motion.div>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed font-light max-w-2xl"
                  >
                    {slide.subtitle}
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button variant="primary" size="lg" className="px-8 py-4 shadow-2xl shadow-green-900/40 group overflow-hidden relative">
                      <span className="relative z-10 flex items-center gap-2">
                        Get Started Free
                        <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                          →
                        </motion.span>
                      </span>
                    </Button>
                    <Button variant="outline" size="lg" className="px-8 py-4 bg-white/5 text-white border-white/20 hover:bg-white/10 backdrop-blur-md transition-all duration-300">
                      View Demo
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Decorative Wave/Shape at Bottom */}
      <div className="absolute bottom-0 left-0 w-full z-10 overflow-hidden line-height-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-12 lg:h-24 fill-neutral-50 dark:fill-neutral-900">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.22,189.5,103.22Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
