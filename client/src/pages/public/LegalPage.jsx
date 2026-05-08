import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiShield, FiLock } from 'react-icons/fi';

const LegalPage = () => {
    return (
        <div className="pt-24 pb-16 min-h-screen bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold font-heading text-neutral-900 dark:text-white mb-6"
                    >
                        Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-500)] to-green-400">Policies</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
                    >
                        Transparency and trust are our priorities. Review our terms and privacy policies below.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Privacy Policy */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <FiShield className="text-3xl text-[var(--color-primary-500)]" />
                            <h2 className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">Privacy Policy</h2>
                        </div>
                        <div className="space-y-4 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                            <p>Your privacy is important to us. It is Smart Agro's policy to respect your privacy regarding any information we may collect from you across our website.</p>
                            <h3 className="font-bold text-neutral-900 dark:text-white mt-4 uppercase tracking-wider text-xs">1. Data Collection</h3>
                            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
                            <h3 className="font-bold text-neutral-900 dark:text-white mt-4 uppercase tracking-wider text-xs">2. Use of Information</h3>
                            <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means.</p>
                        </div>
                    </motion.div>

                    {/* Terms of Service */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <FiFileText className="text-3xl text-blue-500" />
                            <h2 className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">Terms of Service</h2>
                        </div>
                        <div className="space-y-4 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                            <p>By accessing the website at Smart Agro, you are agreeing to be bound by these terms of service, all applicable laws and regulations.</p>
                            <h3 className="font-bold text-neutral-900 dark:text-white mt-4 uppercase tracking-wider text-xs">1. Use License</h3>
                            <p>Permission is granted to temporarily download one copy of the materials (information or software) on Smart Agro's website for personal, non-commercial transitory viewing only.</p>
                            <h3 className="font-bold text-neutral-900 dark:text-white mt-4 uppercase tracking-wider text-xs">2. Disclaimer</h3>
                            <p>The materials on Smart Agro's website are provided on an 'as is' basis. Smart Agro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.</p>
                        </div>
                    </motion.div>
                </div>

                {/* Security Section */}
                <div className="mt-12 bg-[var(--color-primary-900)] rounded-3xl p-8 text-center text-white relative overflow-hidden">
                    <FiLock className="absolute -bottom-4 -left-4 text-9xl opacity-10" />
                    <h2 className="text-2xl font-bold mb-4 relative z-10">Your Security is Our Priority</h2>
                    <p className="max-w-2xl mx-auto text-green-100 relative z-10">
                        We use industry-standard encryption and security protocols to ensure your data and transactions remain safe and private at all times.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
