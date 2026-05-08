import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiZap, FiGlobe, FiSmile } from 'react-icons/fi';
import Button from '../../components/common/Button';

const CareersPage = () => {
    const perks = [
        {
            icon: <FiZap className="text-2xl text-yellow-500" />,
            title: "Fast Growth",
            desc: "Work in a fast-paced environment where your contributions directly impact thousands of farmers."
        },
        {
            icon: <FiGlobe className="text-2xl text-blue-500" />,
            title: "Remote Friendly",
            desc: "We believe in results, not just hours in a chair. Enjoy a flexible work-from-anywhere policy."
        },
        {
            icon: <FiSmile className="text-2xl text-green-500" />,
            title: "Great Culture",
            desc: "Join a team that values transparency, inclusion, and a shared passion for agriculture."
        },
        {
            icon: <FiBriefcase className="text-2xl text-purple-500" />,
            title: "Skill Building",
            desc: "Regular workshops, learning stipends, and opportunities to work with cutting-edge tech."
        }
    ];

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
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-500)] to-green-400">Revolution</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
                    >
                        Help us build the future of smart agriculture. We're looking for passionate individuals to join our mission.
                    </motion.p>
                </div>

                {/* Perks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {perks.map((perk, idx) => (
                        <div key={idx} className="glass-panel p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 card-hover">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center mb-6 shadow-sm border border-neutral-100 dark:border-neutral-700">
                                {perk.icon}
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{perk.title}</h3>
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{perk.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Open Positions (Placeholder) */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 border border-neutral-200 dark:border-neutral-800 shadow-sm text-center">
                    <div className="max-w-xl mx-auto">
                        <div className="w-20 h-20 bg-[var(--color-primary-100)] dark:bg-neutral-800 rounded-full flex items-center justify-center text-[var(--color-primary-600)] text-3xl mx-auto mb-6">
                            <FiBriefcase />
                        </div>
                        <h2 className="text-3xl font-bold font-heading text-neutral-900 dark:text-white mb-4">No Open Positions Currently</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed">
                            We don't have any specific openings at the moment, but we're always looking for talented people. Send us your resume and we'll keep you in mind for future roles!
                        </p>
                        <Button variant="primary" className="px-10 py-4 text-lg">Send Your CV</Button>
                        <p className="mt-6 text-sm text-neutral-500">
                            Email us at <a href="mailto:careers@smartagro.com" className="text-[var(--color-primary-600)] font-bold">careers@smartagro.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareersPage;
