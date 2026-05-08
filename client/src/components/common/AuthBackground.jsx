import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/images/auth/bg1.png',
  '/images/auth/bg2.png',
  '/images/auth/bg3.png',
  '/images/auth/bg4.png',
];

const captions = [
  'Terraced Rice Paddies',
  'Tea Plantations',
  'Vegetable Farming',
  'Spice Gardens',
];

/**
 * Photo slideshow background for Login & Signup pages.
 * Displays high-resolution agricultural images with smooth crossfade transitions.
 */
const AuthBackground = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="auth-slideshow">
      {/* Image layers */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          className="auth-slideshow__image"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Dark overlay for readability */}
      <div className="auth-slideshow__overlay" />

      {/* Bottom caption & dots */}
      <div className="auth-slideshow__footer">
        <motion.p
          key={`caption-${currentIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="auth-slideshow__caption"
        >
          {captions[currentIndex]}
        </motion.p>

        <div className="auth-slideshow__dots">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`auth-slideshow__dot ${idx === currentIndex ? 'auth-slideshow__dot--active' : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthBackground;
