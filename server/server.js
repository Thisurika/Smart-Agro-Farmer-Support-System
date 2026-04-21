require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();

// ─── Security Middleware ───────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── General Rate Limiting ────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api', generalLimiter);

// ─── Auth-Specific Rate Limiting (stricter) ───────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // Only 15 login/signup attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again after 15 minutes.' },
});

// ─── Body Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ──────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/feedbacks', require('./routes/feedbackRoutes'));
app.use('/api/chemicals', require('./routes/chemicalRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));

// ─── Health Check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    name: 'Smart Agro System API',
    version: '2.0.0',
    environment: process.env.NODE_ENV,
  });
});

// ─── Error Handling ───────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🌱 Smart Agro API running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});