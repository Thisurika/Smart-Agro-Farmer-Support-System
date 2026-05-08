const express = require('express');
const router = express.Router();
const {
  getWeather,
  getSriLankaWeather,
  getWeatherHistory,
  deleteWeatherHistory,
  getMyFarmWeather,
  createWeatherAlert,
  getWeatherAlerts,
  updateWeatherAlert,
  deleteWeatherAlert,
  createFarmingTip,
  getFarmingTips,
  updateFarmingTip,
  deleteFarmingTip,
  getDistricts,
} = require('../controllers/weatherController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateWeatherAlert, validateFarmingTip } = require('../middleware/validationMiddleware');

// Existing weather routes
router.get('/', protect, getWeather);
router.get('/sri-lanka', protect, getSriLankaWeather);
router.get('/history', protect, admin, getWeatherHistory);
router.delete('/history', protect, admin, deleteWeatherHistory);

// Farm weather
router.get('/my-farm', protect, getMyFarmWeather);

// Districts list
router.get('/districts', protect, getDistricts);

// Weather Alerts CRUD
router.route('/alerts')
  .get(protect, getWeatherAlerts)
  .post(protect, admin, validateWeatherAlert, createWeatherAlert);

router.route('/alerts/:id')
  .put(protect, admin, validateWeatherAlert, updateWeatherAlert)
  .delete(protect, admin, deleteWeatherAlert);

// Farming Tips CRUD
router.route('/tips')
  .get(protect, getFarmingTips)
  .post(protect, admin, validateFarmingTip, createFarmingTip);

router.route('/tips/:id')
  .put(protect, admin, validateFarmingTip, updateFarmingTip)
  .delete(protect, admin, deleteFarmingTip);

module.exports = router;
