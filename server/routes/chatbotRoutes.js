const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getFAQ, predictDisease } = require('../controllers/chatbotController');

// Multer config — store in memory buffer (we forward to Flask)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// POST /api/chatbot/message — Send a chat message (authenticated)
router.post('/message', protect, sendMessage);

// POST /api/chatbot/predict — Proxy disease detection to Flask (authenticated)
router.post('/predict', protect, upload.single('file'), predictDisease);

// GET /api/chatbot/faq — Get FAQ list (public)
router.get('/faq', getFAQ);

module.exports = router;
