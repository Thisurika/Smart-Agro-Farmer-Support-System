import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiMessageSquare, FiSend } from 'react-icons/fi';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields.');
            return;
        }
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Your message has been sent. We will get back to you soon!');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    };

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
                        Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-500)] to-green-400">Touch</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
                    >
                        Have questions or suggestions? We'd love to hear from you. Reach out to our team today!
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        {[
                            { title: 'Email Us', info1: 'support@smartagro.com', info2: 'info@smartagro.com', icon: <FiMail />, color: 'primary' },
                            { title: 'Call Us', info1: '+94 11 234 5678', info2: 'Mon-Fri: 9am - 5pm', icon: <FiPhone />, color: 'blue' },
                            { title: 'Location', info1: '123 Green Valley, Colombo 07,', info2: 'Sri Lanka.', icon: <FiMapPin />, color: 'orange' }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="premium-card p-8 border-none bg-white dark:bg-neutral-900 group"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                                    ${item.color === 'primary' ? 'bg-primary-50 text-table-600' : 
                                      item.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                                      'bg-orange-50 text-orange-600'}`}
                                >
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-neutral-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-neutral-500 dark:text-neutral-400 font-light">{item.info1}</p>
                                    <p className="text-neutral-500 dark:text-neutral-400 font-light">{item.info2}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-10 md:p-14 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-neutral-100 dark:border-neutral-800 relative transition-all"
                        >
                            <h2 className="text-3xl font-black font-heading text-neutral-900 dark:text-white mb-10 tracking-tight">Send us a Message</h2>
                            <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border-none focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none transition-all dark:text-white font-medium" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border-none focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none transition-all dark:text-white font-medium" placeholder="john@example.com" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Subject</label>
                                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border-none focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none transition-all dark:text-white font-medium" placeholder="Technical Support" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Message</label>
                                    <textarea name="message" rows="5" value={formData.message} onChange={handleChange} className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border-none focus:ring-2 focus:ring-[var(--color-primary-500)] outline-none transition-all dark:text-white font-medium resize-none shadow-inner" placeholder="Tell us more about your inquiry..."></textarea>
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <Button type="submit" variant="primary" size="lg" className="w-full py-5 text-lg shadow-2xl shadow-primary-500/30 group" isLoading={isSubmitting}>
                                        Send Message <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </Button>
                                </div>
                            </form>
                            
                            <div className="mt-12 pt-10 border-t border-neutral-50 dark:border-neutral-800 text-center">
                                <p className="text-neutral-400 text-sm font-medium">
                                    Prefer immediate feedback? 
                                    <a href="/feedback" className="ml-2 text-[var(--color-primary-600)] font-black hover:underline cursor-pointer">Explore Community Feedback</a>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
