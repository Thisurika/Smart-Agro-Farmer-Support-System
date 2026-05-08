const express = require('express');
const router = express.Router();
const {
  getChemicals,
  getChemicalById,
  createChemical,
  updateChemical,
  deleteChemical,
} = require('../controllers/chemicalController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateChemical } = require('../middleware/validationMiddleware');

router.route('/')
  .get(getChemicals)
  .post(protect, admin, validateChemical, createChemical);

router.route('/:id')
  .get(getChemicalById)
  .put(protect, admin, validateChemical, updateChemical)
  .delete(protect, admin, deleteChemical);

module.exports = router;
