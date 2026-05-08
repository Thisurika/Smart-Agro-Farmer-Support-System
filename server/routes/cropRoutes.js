const express = require('express');
const router = express.Router();
const { getCrops, getCropById, createCrop, updateCrop, deleteCrop } = require('../controllers/cropController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateCrop } = require('../middleware/validationMiddleware');

router.route('/')
  .get(getCrops)
  .post(protect, admin, validateCrop, createCrop);

router.route('/:id')
  .get(getCropById)
  .put(protect, admin, validateCrop, updateCrop)
  .delete(protect, admin, deleteCrop);

module.exports = router;
