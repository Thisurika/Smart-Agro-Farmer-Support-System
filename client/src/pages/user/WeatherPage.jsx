import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather, fetchSriLankaWeather, fetchMyFarmWeather, fetchWeatherAlerts, fetchFarmingTips } from '../../redux/slices/weatherSlice';
import Button from '../../components/common/Button';
import { FiSearch, FiMapPin, FiWind, FiDroplet, FiSun, FiCloudRain, FiCloud, FiCloudLightning, FiCloudSnow, FiAlertCircle, FiAlertTriangle, FiInfo, FiBookOpen } from 'react-icons/fi';
import { motion } from 'framer-motion';

const getWeatherIcon = (condition, size = 'text-4xl') => {
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

const severityColors = {
  low: 'bg-blue-50 border-blue-200 text-blue-700',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  high: 'bg-orange-50 border-orange-200 text-orange-700',
  critical: 'bg-red-50 border-red-200 text-red-700',
};

const severityBadge = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const categoryIcons = {
  general: '🌱',
  crop: '🌾',
  irrigation: '💧',
  harvest: '🌿',
  pest: '🐛',
};

const WeatherPage = () => {
  const dispatch = useDispatch();
  const { currentWeather, farmWeather, sriLankaWeather, alerts, tips, isLoading, isSriLankaLoading, error } = useSelector((state) => state.weather);
  const { userInfo } = useSelector((state) => state.auth);
  const [city, setCity] = useState('');

  useEffect(() => {
    dispatch(fetchSriLankaWeather());
    dispatch(fetchMyFarmWeather());
    dispatch(fetchWeatherAlerts());
    dispatch(fetchFarmingTips());
  }, [dispatch]);

  // When farm weather loads, fetch relevant tips
  useEffect(() => {
    if (farmWeather?.condition) {
      dispatch(fetchFarmingTips(farmWeather.condition));
    }
  }, [farmWeather?.condition, dispatch]);

  const searchWeatherHandler = (e) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    if (/^\d+$/.test(trimmedCity)) {
      // We rely on the backend error but can also show immediate feedback if we want.
      // The backend will catch it regardless. Let's just pass it through or block it.
      dispatch(fetchWeather({ city: trimmedCity })); // Dispatching so error shows up from backend
      return;
    }

    dispatch(fetchWeather({ city: trimmedCity }));
  };

  const quickCitySearch = (cityName) => {
    setCity(cityName);
    dispatch(fetchWeather({ city: cityName }));
  };

  const quickCities = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Nuwara Eliya', 'Trincomalee'];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold font-heading text-neutral-900 dark:text-white mb-3">🌦️ Sri Lanka Weather Station</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Real-time weather conditions across Sri Lanka to help you plan your farming activities.
        </p>
      </div>

      {/* Active Weather Alerts */}
      {alerts.length > 0 && (
        <div className="mb-8 space-y-3">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <FiAlertTriangle className="text-orange-500" /> Active Weather Alerts
          </h2>
          {alerts.map((alert) => (
            <motion.div
              key={alert._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-xl border flex items-start gap-3 ${severityColors[alert.severity]}`}
            >
              <FiAlertCircle className="mt-0.5 shrink-0 text-lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{alert.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${severityBadge[alert.severity]}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm opacity-80">{alert.message}</p>
                {alert.affectedDistricts?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {alert.affectedDistricts.map((d, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/50 border font-medium">{d}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* My Farm Weather Card */}
      {farmWeather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-10 shadow-2xl text-white relative overflow-hidden mb-10"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="flex items-center gap-2 text-emerald-200 font-medium mb-1 text-sm uppercase tracking-wide">
            <FiMapPin /> My Farm Weather
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-100 font-medium mb-2 text-lg">
                {farmWeather.city}{farmWeather.district ? `, ${farmWeather.district}` : ''}
              </div>
              <h2 className="text-7xl sm:text-8xl font-bold font-heading mb-2">
                {farmWeather.temperature}°<span className="text-4xl">C</span>
              </h2>
              <div className="flex items-center gap-3 text-2xl font-medium text-gray-200 mb-1">
                {getWeatherIcon(farmWeather.condition)} {farmWeather.condition}
              </div>
              <p className="text-gray-300 capitalize text-sm">{farmWeather.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <FiDroplet className="text-2xl text-blue-300 mb-2" />
                <div className="text-sm text-gray-300 font-medium mb-1">Humidity</div>
                <div className="text-2xl font-bold">{farmWeather.humidity}%</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <FiWind className="text-2xl text-gray-300 mb-2" />
                <div className="text-sm text-gray-300 font-medium mb-1">Wind Speed</div>
                <div className="text-2xl font-bold">{farmWeather.windSpeed} m/s</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!farmWeather && userInfo && (
        <div className="mb-8 p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
          <FiInfo className="text-emerald-500 mt-0.5 shrink-0 text-lg" />
          <div>
            <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              Set your farm location in <a href="/user/profile" className="underline font-bold">Profile Settings</a> to see personalized weather for your farm.
            </span>
          </div>
        </div>
      )}

      {/* Farming Tips */}
      {tips.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <FiBookOpen className="text-[var(--color-primary-500)]" /> Farming Tips
            {farmWeather?.condition && <span className="text-sm font-normal text-gray-500">based on {farmWeather.condition} weather</span>}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.slice(0, 6).map((tip, idx) => (
              <motion.div
                key={tip._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{categoryIcons[tip.category] || '🌱'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] font-bold uppercase">{tip.category}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium">{tip.weatherCondition}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip.tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={searchWeatherHandler} className="flex gap-3 mb-6 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search any Sri Lankan city (e.g. Colombo, Kandy)..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] shadow-sm text-lg dark:text-white"
          />
        </div>
        <Button type="submit" variant="primary" className="px-8 flex items-center gap-2 text-lg rounded-2xl" isLoading={isLoading}>
          <FiSearch /> Search
        </Button>
      </form>

      {/* Quick City Chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {quickCities.map((c) => (
          <button
            key={c}
            onClick={() => quickCitySearch(c)}
            className="px-4 py-2 text-sm font-medium bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-[var(--color-primary-50)] hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary-700)] dark:hover:bg-[var(--color-primary-900)] transition-all text-gray-600 dark:text-gray-300"
          >
            📍 {c}
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-start gap-3 max-w-2xl mx-auto">
          <FiAlertCircle className="text-red-500 mt-0.5 shrink-0 text-lg" />
          <span className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</span>
        </motion.div>
      )}

      {/* Selected City Detail Card */}
      {currentWeather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[var(--color-primary-800)] via-[var(--color-primary-900)] to-black rounded-3xl p-8 sm:p-12 shadow-2xl text-white relative overflow-hidden mb-12 max-w-4xl mx-auto"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-primary-500)]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 text-[var(--color-primary-200)] font-medium mb-3 text-lg">
                <FiMapPin /> {currentWeather.city}, Sri Lanka
              </div>
              <h2 className="text-7xl sm:text-8xl font-bold font-heading mb-2">
                {currentWeather.temperature}°<span className="text-4xl">C</span>
              </h2>
              <div className="flex items-center gap-3 text-2xl font-medium text-gray-200 mb-1">
                {getWeatherIcon(currentWeather.condition)} {currentWeather.condition}
              </div>
              <p className="text-gray-400 capitalize text-sm">{currentWeather.description}</p>
              {currentWeather.feelsLike && (
                <p className="text-gray-400 text-sm mt-1">Feels like {currentWeather.feelsLike}°C</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <FiDroplet className="text-2xl text-blue-300 mb-2" />
                <div className="text-sm text-gray-300 font-medium mb-1">Humidity</div>
                <div className="text-2xl font-bold">{currentWeather.humidity}%</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <FiWind className="text-2xl text-gray-300 mb-2" />
                <div className="text-sm text-gray-300 font-medium mb-1">Wind Speed</div>
                <div className="text-2xl font-bold">{currentWeather.windSpeed} m/s</div>
              </div>
              {currentWeather.visibility && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                  <FiSun className="text-2xl text-yellow-300 mb-2" />
                  <div className="text-sm text-gray-300 font-medium mb-1">Visibility</div>
                  <div className="text-2xl font-bold">{(currentWeather.visibility / 1000).toFixed(1)} km</div>
                </div>
              )}
              {currentWeather.clouds !== undefined && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                  <FiCloud className="text-2xl text-gray-300 mb-2" />
                  <div className="text-sm text-gray-300 font-medium mb-1">Cloud Cover</div>
                  <div className="text-2xl font-bold">{currentWeather.clouds}%</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* All Sri Lanka Cities Grid */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">🇱🇰 Weather Across Sri Lanka</h2>
        {isSriLankaLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary-600)]"></div>
          </div>
        ) : sriLankaWeather.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            Loading weather data for Sri Lankan cities...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sriLankaWeather.map((w, idx) => (
              <motion.div
                key={w.city}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => quickCitySearch(w.city)}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-[var(--color-primary-300)] dark:hover:border-gray-600 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{w.city}</h3>
                  {getWeatherIcon(w.condition, 'text-xl')}
                </div>
                <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
                  {w.temperature}°<span className="text-base text-gray-400">C</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-2">{w.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FiDroplet /> {w.humidity}%</span>
                  <span className="flex items-center gap-1"><FiWind /> {w.windSpeed}m/s</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
