import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiHeart, FiTrendingUp } from 'react-icons/fi';

const AboutPage = () => {
    const values = [
        {
            icon: <FiTarget className="text-3xl text-[var(--color-primary-500)]" />,
            title: "Our Mission",
            desc: "To empower farmers worldwide with cutting-edge technology and data-driven insights for a sustainable and prosperous future in agriculture."
        },
        {
            icon: <FiEye className="text-3xl text-[var(--color-secondary-500)]" />,
            title: "Our Vision",
            desc: "To be the leading global platform for intelligent agriculture, bridging the gap between traditional farming and modern innovation."
        },
        {
            icon: <FiHeart className="text-3xl text-red-500" />,
            title: "Our Values",
            desc: "Integrity, innovation, and farmer-centricity are at the heart of everything we do. We believe in building solutions that truly matter."
        },
        {
            icon: <FiTrendingUp className="text-3xl text-blue-500" />,
            title: "Our Impact",
            desc: "Helping thousands of farmers optimize their yields, reduce costs, and secure better financial futures with Smart Agro's tools."
        }
    ];

    return (
        <div className="pt-24 pb-16 min-h-screen bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold font-heading text-neutral-900 dark:text-white mb-6"
                    >
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-500)] to-green-400">Smart Agro</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto"
                    >
                        We are a team of dedicated agricultural and technology enthusiasts on a mission to revolutionize how farming is done in the 21st century.
                    </motion.p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {values.map((value, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="premium-card p-10 text-center group border-none bg-white dark:bg-neutral-900"
                        >
                            <div className="w-20 h-20 mx-auto rounded-3xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white mb-4 group-hover:text-[var(--color-primary-600)] transition-colors">{value.title}</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-light">{value.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Story Section */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-neutral-900 rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-primary-950/20 mb-12"
                >
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[var(--color-primary-600)] rounded-full blur-[150px] opacity-10 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500 rounded-full blur-[100px] opacity-5 -translate-x-1/4 translate-y-1/4"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-[1.5]">
                            <motion.span 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-8"
                            >
                                Our Journey
                            </motion.span>
                            <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-white mb-8 leading-tight">Crafting the future of <span className="text-gradient">smart farming</span>.</h2>
                            <p className="text-neutral-400 text-lg mb-6 leading-relaxed font-light">
                                Smart Agro started as a small project intended to help local farmers better manage their crop cycles and predict harvest times. We quickly realized that the challenges farmers face are universal: lack of information, unpredictable weather, and difficult financial management.
                            </p>
                            <p className="text-neutral-400 text-lg leading-relaxed font-light">
                                Today, Smart Agro has evolved into a comprehensive platform that combines real-time weather tracking, a robust crop marketplace, and advanced financial overhead management. We continue to grow and adapt, always keeping our users' needs at the forefront.
                            </p>
                        </div>
                        <div className="flex-1 w-full flex justify-center">
                            <motion.div 
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-full max-w-[300px] aspect-square bg-gradient-to-br from-[var(--color-primary-500)] to-emerald-700 rounded-[2.5rem] flex items-center justify-center text-white text-7xl font-black shadow-2xl shadow-primary-500/30 rotate-3"
                            >
                                SA
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
