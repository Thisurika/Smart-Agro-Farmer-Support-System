import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWeather, fetchWeatherHistory, fetchSriLankaWeather, deleteWeatherHistory,
  fetchWeatherAlerts, createWeatherAlert, updateWeatherAlert, deleteWeatherAlert,
  fetchFarmingTips, createFarmingTip, updateFarmingTip, deleteFarmingTip,
  fetchDistricts,
} from '../../redux/slices/weatherSlice';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import {
  FiCloudLightning, FiDroplet, FiWind, FiSun, FiCloud, FiCloudRain, FiCloudSnow,
  FiSearch, FiMapPin, FiAlertCircle, FiAlertTriangle, FiPlus, FiTrash2, FiEdit2,
  FiBookOpen, FiX, FiCheck
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const getWeatherIcon = (condition, size = 'text-xl') => {
  switch (condition?.toLowerCase()) {
    case 'clear': return <FiSun className={`${size} text-yellow-400`} />;
    case 'clouds': return <FiCloud className={`${size} text-gray-400`} />;
    case 'rain':
    case 'drizzle': return <FiCloudRain className={`${size} text-blue-400`} />;
    case 'thunderstorm': return <FiCloudLightning className={`${size} text-purple-400`} />;
    case 'snow': return <FiCloudSnow className={`${size} text-cyan-300`} />;
    default: return <FiSun className={`${size} text-yellow-400`} />;
  }
};

const severityBadge = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const WEATHER_CONDITIONS = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist', 'Haze', 'All'];
const TIP_CATEGORIES = ['general', 'crop', 'irrigation', 'harvest', 'pest'];

const WeatherRecordsPage = () => {
  const dispatch = useDispatch();
  const {
    currentWeather, history, sriLankaWeather, alerts, tips, districts,
    isLoading, isSriLankaLoading, error
  } = useSelector((state) => state.weather);

  const [activeTab, setActiveTab] = useState('weather');
  const [city, setCity] = useState('');

  // Alert form state
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [alertForm, setAlertForm] = useState({ title: '', message: '', severity: 'medium', affectedDistricts: [] });

  // Tip form state
  const [showTipForm, setShowTipForm] = useState(false);
  const [editingTip, setEditingTip] = useState(null);
  const [tipForm, setTipForm] = useState({ weatherCondition: 'All', tip: '', category: 'general' });

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Clear history modal
  const [showClearHistory, setShowClearHistory] = useState(false);

  useEffect(() => {
    dispatch(fetchWeatherHistory());
    dispatch(fetchSriLankaWeather());
    dispatch(fetchWeatherAlerts());
    dispatch(fetchFarmingTips());
    dispatch(fetchDistricts());
  }, [dispatch]);

  const searchWeatherHandler = (e) => {
    e.preventDefault();
    if (city.trim()) dispatch(fetchWeather({ city }));
  };

  const quickCitySearch = (cityName) => {
    setCity(cityName);
    dispatch(fetchWeather({ city: cityName }));
  };

  // ---- Alert Handlers ----
  const openAlertForm = (alert = null) => {
    if (alert) {
      setEditingAlert(alert);
      setAlertForm({ title: alert.title, message: alert.message, severity: alert.severity, affectedDistricts: alert.affectedDistricts || [] });
    } else {
      setEditingAlert(null);
      setAlertForm({ title: '', message: '', severity: 'medium', affectedDistricts: [] });
    }
    setShowAlertForm(true);
  };

  const submitAlert = async (e) => {
    e.preventDefault();
    if (editingAlert) {
      const res = await dispatch(updateWeatherAlert({ id: editingAlert._id, ...alertForm }));
      if (updateWeatherAlert.fulfilled.match(res)) toast.success('Alert updated');
      else toast.error(res.payload || 'Failed');
    } else {
      const res = await dispatch(createWeatherAlert(alertForm));
      if (createWeatherAlert.fulfilled.match(res)) toast.success('Alert created & farmers notified');
      else toast.error(res.payload || 'Failed');
    }
    setShowAlertForm(false);
    setEditingAlert(null);
  };

  const toggleAlertActive = async (alert) => {
    const res = await dispatch(updateWeatherAlert({ id: alert._id, isActive: !alert.isActive }));
    if (updateWeatherAlert.fulfilled.match(res)) toast.success(`Alert ${alert.isActive ? 'deactivated' : 'activated'}`);
  };

  const handleDeleteAlert = async () => {
    setIsDeleting(true);
    const res = await dispatch(deleteWeatherAlert(deleteTarget));
    if (deleteWeatherAlert.fulfilled.match(res)) toast.success('Alert deleted');
    else toast.error('Failed to delete');
    setIsDeleting(false);
    setDeleteTarget(null);
    setDeleteType('');
  };

  // ---- Tip Handlers ----
  const openTipForm = (tip = null) => {
    if (tip) {
      setEditingTip(tip);
      setTipForm({ weatherCondition: tip.weatherCondition, tip: tip.tip, category: tip.category });
    } else {
      setEditingTip(null);
      setTipForm({ weatherCondition: 'All', tip: '', category: 'general' });
    }
    setShowTipForm(true);
  };

  const submitTip = async (e) => {
    e.preventDefault();
    if (editingTip) {
      const res = await dispatch(updateFarmingTip({ id: editingTip._id, ...tipForm }));
      if (updateFarmingTip.fulfilled.match(res)) toast.success('Tip updated');
      else toast.error(res.payload || 'Failed');
    } else {
      const res = await dispatch(createFarmingTip(tipForm));
      if (createFarmingTip.fulfilled.match(res)) toast.success('Tip created');
      else toast.error(res.payload || 'Failed');
    }
    setShowTipForm(false);
    setEditingTip(null);
  };

  const handleDeleteTip = async () => {
    setIsDeleting(true);
    const res = await dispatch(deleteFarmingTip(deleteTarget));
    if (deleteFarmingTip.fulfilled.match(res)) toast.success('Tip deleted');
    else toast.error('Failed to delete');
    setIsDeleting(false);
    setDeleteTarget(null);
    setDeleteType('');
  };

  const handleClearHistory = async () => {
    const res = await dispatch(deleteWeatherHistory());
    if (deleteWeatherHistory.fulfilled.match(res)) toast.success('History cleared');
    else toast.error('Failed to clear history');
    setShowClearHistory(false);
  };

  const toggleDistrict = (district) => {
    setAlertForm(prev => ({
      ...prev,
      affectedDistricts: prev.affectedDistricts.includes(district)
        ? prev.affectedDistricts.filter(d => d !== district)
        : [...prev.affectedDistricts, district]
    }));
  };

  const tabs = [
    { id: 'weather', label: 'Live Weather', icon: <FiCloudLightning /> },
    { id: 'alerts', label: 'Weather Alerts', icon: <FiAlertTriangle /> },
    { id: 'tips', label: 'Farming Tips', icon: <FiBookOpen /> },
    { id: 'history', label: 'Search History', icon: <FiSearch /> },
  ];

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
            <FiCloudLightning className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">Weather Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage weather monitoring, alerts, and farming tips.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 dark:bg-neutral-800 p-1.5 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-neutral-900 text-[var(--color-primary-600)] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <FiAlertCircle className="text-red-500 mt-0.5 shrink-0 text-lg" />
          <span className="text-sm text-red-700 font-medium">{error}</span>
        </motion.div>
      )}

      {/* ====== LIVE WEATHER TAB ====== */}
      {activeTab === 'weather' && (
        <>
          <form onSubmit={searchWeatherHandler} className="flex gap-2 mb-8 max-w-lg">
            <div className="relative flex-1">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search any city..." value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] shadow-sm dark:text-white text-sm" />
            </div>
            <Button type="submit" variant="primary" className="px-4 py-2.5 flex items-center gap-2 rounded-xl text-sm" isLoading={isLoading}>
              <FiSearch /> Search
            </Button>
          </form>

          {currentWeather && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-10 text-white relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Current Forecast</span>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-bold font-heading">{currentWeather.city}</h2>
                    <div className="bg-[var(--color-primary-500)]/20 text-[var(--color-primary-400)] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Live</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                  <div className="text-4xl font-bold">{currentWeather.temperature}°C</div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-sm font-medium">{getWeatherIcon(currentWeather.condition, 'text-lg')} {currentWeather.condition}</div>
                    <span className="text-gray-400 text-xs capitalize">{currentWeather.description}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-l border-white/10 pl-6 lg:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><FiDroplet /></div>
                    <div><div className="text-[10px] text-gray-400 uppercase">Humidity</div><div className="text-sm font-bold">{currentWeather.humidity}%</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-500/10 text-gray-400 rounded-lg"><FiWind /></div>
                    <div><div className="text-[10px] text-gray-400 uppercase">Wind</div><div className="text-sm font-bold">{currentWeather.windSpeed} m/s</div></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">🇱🇰 Live Weather - Sri Lanka</h2>
          {isSriLankaLoading ? (
            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-600)]"></div></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sriLankaWeather.map((w, idx) => (
                <motion.div key={w.city} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.03 }}
                  onClick={() => quickCitySearch(w.city)}
                  className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:border-[var(--color-primary-300)] transition-all cursor-pointer shadow-sm hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{w.city}</h3>
                    {getWeatherIcon(w.condition)}
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">{w.temperature}°C</div>
                  <p className="text-xs text-gray-500 capitalize">{w.description}</p>
                  <div className="flex gap-2 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-0.5"><FiDroplet className="text-blue-400" /> {w.humidity}%</span>
                    <span className="flex items-center gap-0.5"><FiWind /> {w.windSpeed}m/s</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ====== ALERTS TAB ====== */}
      {activeTab === 'alerts' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">Weather Alerts ({alerts.length})</h2>
            <Button variant="primary" className="flex items-center gap-2 text-sm" onClick={() => openAlertForm()}>
              <FiPlus /> Create Alert
            </Button>
          </div>

          {/* Alert Form Modal */}
          {showAlertForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{editingAlert ? 'Edit Alert' : 'Create New Alert'}</h3>
                <button onClick={() => setShowAlertForm(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
              </div>
              <form onSubmit={submitAlert} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                  <input type="text" required value={alertForm.title} onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                  <textarea required rows="3" value={alertForm.message} onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Severity</label>
                  <select value={alertForm.severity} onChange={(e) => setAlertForm({ ...alertForm, severity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Affected Districts</label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-xl border">
                    {districts.map((d) => (
                      <button key={d} type="button" onClick={() => toggleDistrict(d)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                          alertForm.affectedDistricts.includes(d)
                            ? 'bg-[var(--color-primary-500)] text-white border-[var(--color-primary-500)]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--color-primary-300)]'
                        }`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="primary" className="flex-1 py-2.5">{editingAlert ? 'Update Alert' : 'Create Alert'}</Button>
                  <Button type="button" variant="outline" className="py-2.5" onClick={() => setShowAlertForm(false)}>Cancel</Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Alerts Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Severity</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Districts</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {alerts.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">No weather alerts created yet.</td></tr>
                  ) : alerts.map((alert) => (
                    <tr key={alert._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{alert.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{alert.message}</div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${severityBadge[alert.severity]}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(alert.affectedDistricts || []).slice(0, 3).map((d, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{d}</span>
                          ))}
                          {(alert.affectedDistricts?.length || 0) > 3 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">+{alert.affectedDistricts.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button onClick={() => toggleAlertActive(alert)}
                          className={`text-xs px-3 py-1 rounded-full font-bold ${alert.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {alert.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{new Date(alert.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openAlertForm(alert)} className="text-gray-400 hover:text-blue-500 transition-colors"><FiEdit2 size={16} /></button>
                          <button onClick={() => { setDeleteTarget(alert._id); setDeleteType('alert'); }} className="text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ====== TIPS TAB ====== */}
      {activeTab === 'tips' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">Farming Tips ({tips.length})</h2>
            <Button variant="primary" className="flex items-center gap-2 text-sm" onClick={() => openTipForm()}>
              <FiPlus /> Add Tip
            </Button>
          </div>

          {showTipForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{editingTip ? 'Edit Tip' : 'Add New Farming Tip'}</h3>
                <button onClick={() => setShowTipForm(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
              </div>
              <form onSubmit={submitTip} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Weather Condition</label>
                    <select value={tipForm.weatherCondition} onChange={(e) => setTipForm({ ...tipForm, weatherCondition: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]">
                      {WEATHER_CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select value={tipForm.category} onChange={(e) => setTipForm({ ...tipForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]">
                      {TIP_CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tip</label>
                  <textarea required rows="3" value={tipForm.tip} onChange={(e) => setTipForm({ ...tipForm, tip: e.target.value })}
                    placeholder="Enter farming advice..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="primary" className="flex-1 py-2.5">{editingTip ? 'Update Tip' : 'Add Tip'}</Button>
                  <Button type="button" variant="outline" className="py-2.5" onClick={() => setShowTipForm(false)}>Cancel</Button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-sm font-semibold text-gray-600">Condition</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 w-1/2">Tip</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tips.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No farming tips added yet.</td></tr>
                  ) : tips.map((tip) => (
                    <tr key={tip._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">{tip.weatherCondition}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium capitalize">{tip.category}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{tip.tip}</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(tip.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openTipForm(tip)} className="text-gray-400 hover:text-blue-500 transition-colors"><FiEdit2 size={16} /></button>
                          <button onClick={() => { setDeleteTarget(tip._id); setDeleteType('tip'); }} className="text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ====== HISTORY TAB ====== */}
      {activeTab === 'history' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">Farmer Search History ({history.length})</h2>
            {history.length > 0 && (
              <Button variant="outline" className="flex items-center gap-2 text-sm text-red-500 border-red-200 hover:bg-red-50" onClick={() => setShowClearHistory(true)}>
                <FiTrash2 /> Clear All
              </Button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-sm font-semibold text-gray-600">Farmer</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Searched City</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Temperature</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Condition</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Humidity</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">No weather searches recorded yet.</td></tr>
                  ) : history.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{record.user?.firstName} {record.user?.lastName}</div>
                        <div className="text-xs text-gray-500">{record.user?.email}</div>
                      </td>
                      <td className="p-4 font-medium text-gray-900">{record.city}</td>
                      <td className="p-4 font-bold text-orange-500">{record.temperature}°C</td>
                      <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                        {getWeatherIcon(record.condition, 'text-base')} {record.condition}
                      </td>
                      <td className="p-4 text-sm text-gray-600">{record.humidity}%</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(record.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget && !!deleteType}
        onClose={() => { setDeleteTarget(null); setDeleteType(''); }}
        onConfirm={deleteType === 'alert' ? handleDeleteAlert : handleDeleteTip}
        title={`Delete ${deleteType === 'alert' ? 'Weather Alert' : 'Farming Tip'}`}
        message={`This ${deleteType} will be permanently removed. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Clear History Modal */}
      <ConfirmModal
        isOpen={showClearHistory}
        onClose={() => setShowClearHistory(false)}
        onConfirm={handleClearHistory}
        title="Clear Search History"
        message="All farmer weather search records will be permanently deleted. This cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default WeatherRecordsPage;
