import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiShield, FiSave, FiCloudRain } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { fetchDistricts } from '../../redux/slices/weatherSlice';
import { profileSchema } from '../../utils/schemas';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    farmDistrict: '',
    farmCity: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const { districts } = useSelector((state) => state.weather);

  useEffect(() => {
    dispatch(fetchDistricts());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        password: '',
        confirmPassword: '',
        farmDistrict: userInfo.farmLocation?.district || '',
        farmCity: userInfo.farmLocation?.city || '',
      });
    }
  }, [userInfo]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    
    try {
      await profileSchema.validate(formData, { abortEarly: false });
      
      if (formData.password && formData.password !== formData.confirmPassword) {
        setFormErrors({ confirmPassword: 'Passwords do not match' });
        return;
      }

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      if (formData.farmDistrict || formData.farmCity) {
        updateData.farmLocation = {
          district: formData.farmDistrict,
          city: formData.farmCity,
        };
      }

      if (formData.password) {
        updateData.password = formData.password;
      }

      const result = await dispatch(updateProfile(updateData));
      if (updateProfile.fulfilled.match(result)) {
        toast.success('Profile updated successfully');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        toast.error(result.payload || 'Failed to update profile');
      }
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach(item => {
          errors[item.path] = item.message;
        });
        setFormErrors(errors);
      }
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white flex items-center gap-3">
          <FiUser className="text-[var(--color-primary-500)]" /> Profile Settings
        </h1>
        <p className="text-gray-500 mt-2">Manage your personal information and security settings.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg">
              {userInfo?.firstName?.[0]}{userInfo?.lastName?.[0]}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {userInfo?.firstName} {userInfo?.lastName}
            </h2>
            <p className="text-sm text-gray-500 mb-6">{userInfo?.email}</p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20 text-[var(--color-primary-600)] rounded-full text-sm font-bold border border-[var(--color-primary-100)] dark:border-[var(--color-primary-800)]/30 uppercase tracking-wider">
              <FiShield /> {userInfo?.role}
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <form onSubmit={onSubmit} className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={onChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-100 dark:border-gray-700'} outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-all`}
                  />
                </div>
                {formErrors.firstName && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={onChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-100 dark:border-gray-700'} outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-all`}
                  />
                </div>
                {formErrors.lastName && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border ${formErrors.phone ? 'border-red-500' : 'border-gray-100 dark:border-gray-700'} outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-all`}
                  />
                </div>
                {formErrors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={onChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiCloudRain className="text-blue-500" /> Farm Location
              </h3>
              <p className="text-sm text-gray-500 mb-4">Set your farm location to get personalized weather updates on the Weather page.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">District</label>
                  <select
                    name="farmDistrict"
                    value={formData.farmDistrict}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-all"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">City / Town</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="farmCity"
                      value={formData.farmCity}
                      onChange={onChange}
                      placeholder="e.g. Kandy, Colombo"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Security Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Password (Optional)</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={onChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={onChange}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-100 dark:border-gray-700'} outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-all`}
                    />
                  </div>
                  {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{formErrors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-4 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : <><FiSave /> Save Changes</>}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
