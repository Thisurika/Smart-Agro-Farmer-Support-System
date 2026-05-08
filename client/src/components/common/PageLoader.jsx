import React from 'react';
import { motion } from 'framer-motion';
import { TbLeaf } from 'react-icons/tb';

/**
 * Premium loading spinner shown during lazy-loaded page transitions.
 */
const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center shadow-xl shadow-primary-600/20"
        >
          <TbLeaf className="text-3xl text-white" />
        </motion.div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-primary-500"
            />
          ))}
        </div>
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading</p>
      </motion.div>
    </div>
  );
};

export default PageLoader;
