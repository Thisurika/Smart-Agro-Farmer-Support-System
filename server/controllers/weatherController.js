const Weather = require('../models/Weather');
const WeatherAlert = require('../models/WeatherAlert');
const FarmingTip = require('../models/FarmingTip');
const User = require('../models/User');
const Notification = require('../models/Notification');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const SRI_LANKA_CITIES = [
  { name: 'Colombo', lat: 6.9271, lon: 79.8612 },
  { name: 'Kandy', lat: 7.2906, lon: 80.6337 },
  { name: 'Galle', lat: 6.0535, lon: 80.2210 },
  { name: 'Jaffna', lat: 9.6615, lon: 80.0255 },
  { name: 'Anuradhapura', lat: 8.3114, lon: 80.4037 },
  { name: 'Trincomalee', lat: 8.5874, lon: 81.2152 },
  { name: 'Matara', lat: 5.9549, lon: 80.5550 },
  { name: 'Batticaloa', lat: 7.7310, lon: 81.6747 },
  { name: 'Kurunegala', lat: 7.4863, lon: 80.3623 },
  { name: 'Nuwara Eliya', lat: 6.9497, lon: 80.7891 },
  { name: 'Ratnapura', lat: 6.6828, lon: 80.3992 },
  { name: 'Badulla', lat: 6.9934, lon: 81.0550 },
  { name: 'Polonnaruwa', lat: 7.9403, lon: 81.0188 },
  { name: 'Negombo', lat: 7.2083, lon: 79.8358 },
  { name: 'Hambantota', lat: 6.1429, lon: 81.1212 },
];

const SRI_LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Mullaitivu', 'Vavuniya', 'Trincomalee', 'Batticaloa', 'Ampara',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

// ===================== EXISTING WEATHER ENDPOINTS =====================

// @desc    Get real-time weather for a Sri Lankan city
// @route   GET /api/weather
// @access  Private
const getWeather = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'City parameter is required' });
    }

    // 1. Check if input is a number
    if (/^\d+$/.test(city.trim())) {
      return res.status(400).json({ message: 'Invalid location. Please enter a valid city or district name.' });
    }

    // 2. Validate against Sri Lankan locations
    const normalizedCity = city.trim().toLowerCase();
    const allValidLocations = [
      ...SRI_LANKA_CITIES.map(c => c.name.toLowerCase()),
      ...SRI_LANKA_DISTRICTS.map(d => d.toLowerCase())
    ];

    const isValidLocation = allValidLocations.some(loc => 
      loc === normalizedCity || normalizedCity.includes(loc) || loc.includes(normalizedCity)
    );

    if (!isValidLocation && normalizedCity.length > 2) {
       // If not in our predefined list, we can still try API but if we suspect it's totally random, we reject.
       // For now, let's stick to the list for "Exact location in Sri Lanka" as requested.
       return res.status(400).json({ message: 'Location not recognized. Please choose a major Sri Lankan city or district.' });
    }

    let weatherData;
    let fallbackToSimulated = false;

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_api_key_here') {
      fallbackToSimulated = true;
    } else {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},LK&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const response = await fetch(url);
        const apiData = await response.json();

        if (apiData.cod === 200) {
          weatherData = {
            city: apiData.name,
            temperature: Math.round(apiData.main.temp),
            feelsLike: Math.round(apiData.main.feels_like),
            humidity: apiData.main.humidity,
            windSpeed: apiData.wind.speed,
            condition: apiData.weather[0].main,
            description: apiData.weather[0].description,
            icon: apiData.weather[0].icon,
            pressure: apiData.main.pressure,
            visibility: apiData.visibility,
            clouds: apiData.clouds.all,
            sunrise: apiData.sys.sunrise,
            sunset: apiData.sys.sunset,
          };
        } else {
          fallbackToSimulated = true;
        }
      } catch (fetchErr) {
        fallbackToSimulated = true;
      }
    }

    if (fallbackToSimulated) {
      weatherData = {
        city: city,
        temperature: Math.floor(Math.random() * 8) + 26,
        feelsLike: Math.floor(Math.random() * 8) + 27,
        humidity: Math.floor(Math.random() * 30) + 60,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        condition: ['Clear', 'Clouds', 'Rain', 'Thunderstorm'][Math.floor(Math.random() * 4)],
        description: 'Real-time weather (simulated)',
        icon: '02d',
      };
    }

    // Log to history
    const weatherRecord = new Weather({
      user: req.user._id,
      city: weatherData.city,
      temperature: weatherData.temperature,
      feelsLike: weatherData.feelsLike,
      humidity: weatherData.humidity,
      windSpeed: weatherData.windSpeed,
      condition: weatherData.condition,
      description: weatherData.description,
      icon: weatherData.icon,
    });
    await weatherRecord.save();

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
};

// @desc    Get weather for all major Sri Lankan cities
// @route   GET /api/weather/sri-lanka
// @access  Private
const getSriLankaWeather = async (req, res) => {
  try {
    const results = [];

    for (const loc of SRI_LANKA_CITIES) {
      let cityData = null;

      if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'your_api_key_here') {
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
          const response = await fetch(url);
          const apiData = await response.json();

          if (apiData.cod === 200) {
            cityData = {
              city: loc.name,
              temperature: Math.round(apiData.main.temp),
              feelsLike: Math.round(apiData.main.feels_like),
              humidity: apiData.main.humidity,
              windSpeed: apiData.wind.speed,
              condition: apiData.weather[0].main,
              description: apiData.weather[0].description,
              icon: apiData.weather[0].icon,
            };
          }
        } catch (err) {
          // Fall through to simulated data
        }
      }

      if (!cityData) {
        cityData = {
          city: loc.name,
          temperature: Math.floor(Math.random() * 8) + 26,
          feelsLike: Math.floor(Math.random() * 8) + 27,
          humidity: Math.floor(Math.random() * 20) + 70,
          windSpeed: Math.floor(Math.random() * 10) + 2,
          condition: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
          description: 'simulated',
          icon: '01d',
        };
      }

      results.push(cityData);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Sri Lanka weather', error: error.message });
  }
};

// @desc    Get weather query history
// @route   GET /api/weather/history
// @access  Private/Admin
const getWeatherHistory = async (req, res) => {
  try {
    const history = await Weather.find({}).populate('user', 'firstName lastName email').sort('-createdAt').limit(100);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete old weather history records
// @route   DELETE /api/weather/history
// @access  Private/Admin
const deleteWeatherHistory = async (req, res) => {
  try {
    await Weather.deleteMany({});
    res.json({ message: 'Weather history cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get weather for logged-in user's farm location
// @route   GET /api/weather/my-farm
// @access  Private
const getMyFarmWeather = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.farmLocation || !user.farmLocation.city) {
      return res.status(400).json({ message: 'No farm location set. Please update your profile with a farm location.' });
    }

    const city = user.farmLocation.city;
    let weatherData;
    let fallbackToSimulated = false;

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_api_key_here') {
      fallbackToSimulated = true;
    } else {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},LK&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const response = await fetch(url);
        const apiData = await response.json();

        if (apiData.cod === 200) {
          weatherData = {
            city: apiData.name,
            district: user.farmLocation.district,
            temperature: Math.round(apiData.main.temp),
            feelsLike: Math.round(apiData.main.feels_like),
            humidity: apiData.main.humidity,
            windSpeed: apiData.wind.speed,
            condition: apiData.weather[0].main,
            description: apiData.weather[0].description,
            icon: apiData.weather[0].icon,
            pressure: apiData.main.pressure,
            visibility: apiData.visibility,
            clouds: apiData.clouds.all,
          };
        } else {
          fallbackToSimulated = true;
        }
      } catch (fetchErr) {
        fallbackToSimulated = true;
      }
    }

    if (fallbackToSimulated) {
      weatherData = {
        city: city,
        district: user.farmLocation.district,
        temperature: Math.floor(Math.random() * 8) + 26,
        feelsLike: Math.floor(Math.random() * 8) + 27,
        humidity: Math.floor(Math.random() * 30) + 60,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        condition: ['Clear', 'Clouds', 'Rain', 'Thunderstorm'][Math.floor(Math.random() * 4)],
        description: 'Farm weather (simulated)',
        icon: '02d',
      };
    }

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farm weather', error: error.message });
  }
};

// ===================== WEATHER ALERTS CRUD =====================

// @desc    Create a weather alert
// @route   POST /api/weather/alerts
// @access  Private/Admin
const createWeatherAlert = async (req, res) => {
  try {
    const { title, message, severity, affectedDistricts } = req.body;

    const alert = new WeatherAlert({
      title,
      message,
      severity,
      affectedDistricts,
      createdBy: req.user._id
    });

    const createdAlert = await alert.save();

    // Notify farmers in affected districts
    if (affectedDistricts && affectedDistricts.length > 0) {
      const affectedUsers = await User.find({
        role: 'user',
        'farmLocation.district': { $in: affectedDistricts }
      });

      const notifications = affectedUsers.map(u => ({
        user: u._id,
        message: `⚠️ Weather Alert: ${title}`,
        type: 'weather',
        link: '/user/weather'
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(201).json(createdAlert);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create alert', error: error.message });
  }
};

// @desc    Get all weather alerts (active only for users, all for admins)
// @route   GET /api/weather/alerts
// @access  Private
const getWeatherAlerts = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const filter = isAdmin ? {} : { isActive: true };
    const alerts = await WeatherAlert.find(filter).populate('createdBy', 'firstName lastName').sort('-createdAt');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a weather alert
// @route   PUT /api/weather/alerts/:id
// @access  Private/Admin
const updateWeatherAlert = async (req, res) => {
  try {
    const alert = await WeatherAlert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.title = req.body.title || alert.title;
    alert.message = req.body.message || alert.message;
    alert.severity = req.body.severity || alert.severity;
    alert.affectedDistricts = req.body.affectedDistricts || alert.affectedDistricts;
    if (req.body.isActive !== undefined) {
      alert.isActive = req.body.isActive;
    }

    const updatedAlert = await alert.save();
    res.json(updatedAlert);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update alert', error: error.message });
  }
};

// @desc    Delete a weather alert
// @route   DELETE /api/weather/alerts/:id
// @access  Private/Admin
const deleteWeatherAlert = async (req, res) => {
  try {
    const alert = await WeatherAlert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    await alert.deleteOne();
    res.json({ message: 'Alert removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ===================== FARMING TIPS CRUD =====================

// @desc    Create a farming tip
// @route   POST /api/weather/tips
// @access  Private/Admin
const createFarmingTip = async (req, res) => {
  try {
    const { weatherCondition, tip, category } = req.body;

    const farmingTip = new FarmingTip({
      weatherCondition,
      tip,
      category,
      createdBy: req.user._id
    });

    const createdTip = await farmingTip.save();
    res.status(201).json(createdTip);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create tip', error: error.message });
  }
};

// @desc    Get farming tips (optionally filtered by weather condition)
// @route   GET /api/weather/tips
// @access  Private
const getFarmingTips = async (req, res) => {
  try {
    const { condition } = req.query;
    let filter = {};
    if (condition) {
      filter = { $or: [{ weatherCondition: condition }, { weatherCondition: 'All' }] };
    }
    const tips = await FarmingTip.find(filter).populate('createdBy', 'firstName lastName').sort('-createdAt');
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a farming tip
// @route   PUT /api/weather/tips/:id
// @access  Private/Admin
const updateFarmingTip = async (req, res) => {
  try {
    const tip = await FarmingTip.findById(req.params.id);
    if (!tip) {
      return res.status(404).json({ message: 'Tip not found' });
    }

    tip.weatherCondition = req.body.weatherCondition || tip.weatherCondition;
    tip.tip = req.body.tip || tip.tip;
    tip.category = req.body.category || tip.category;

    const updatedTip = await tip.save();
    res.json(updatedTip);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update tip', error: error.message });
  }
};

// @desc    Delete a farming tip
// @route   DELETE /api/weather/tips/:id
// @access  Private/Admin
const deleteFarmingTip = async (req, res) => {
  try {
    const tip = await FarmingTip.findById(req.params.id);
    if (!tip) {
      return res.status(404).json({ message: 'Tip not found' });
    }
    await tip.deleteOne();
    res.json({ message: 'Tip removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get Sri Lanka districts list
// @route   GET /api/weather/districts
// @access  Private
const getDistricts = async (req, res) => {
  res.json(SRI_LANKA_DISTRICTS);
};

module.exports = {
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
};
