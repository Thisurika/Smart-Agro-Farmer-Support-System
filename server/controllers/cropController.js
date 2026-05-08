const Crop = require('../models/Crop');

// @desc    Fetch all crops (with optional filtering)
// @route   GET /api/crops
// @access  Public/User
const getCrops = async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const crops = await Crop.find(query).sort('-createdAt');
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single crop
// @route   GET /api/crops/:id
// @access  Public/User
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (crop) {
      res.json(crop);
    } else {
      res.status(404).json({ message: 'Crop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a crop
// @route   POST /api/crops
// @access  Private/Admin
const createCrop = async (req, res) => {
  try {
    if (req.body.category) {
      const words = req.body.category.toLowerCase().split(' ');
      req.body.category = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    const crop = new Crop({ ...req.body });
    const createdCrop = await crop.save();
    res.status(201).json(createdCrop);
  } catch (error) {
    res.status(400).json({ message: 'Invalid crop data', error: error.message });
  }
};

// @desc    Update a crop
// @route   PUT /api/crops/:id
// @access  Private/Admin
const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (crop) {
      Object.assign(crop, req.body);
      const updatedCrop = await crop.save();
      res.json(updatedCrop);
    } else {
      res.status(404).json({ message: 'Crop not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete a crop
// @route   DELETE /api/crops/:id
// @access  Private/Admin
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (crop) {
      await Crop.deleteOne({ _id: crop._id });
      res.json({ message: 'Crop removed' });
    } else {
      res.status(404).json({ message: 'Crop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
};
