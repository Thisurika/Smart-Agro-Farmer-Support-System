const Chemical = require('../models/Chemical');

// @desc    Get all chemicals
// @route   GET /api/chemicals
// @access  Public
const getChemicals = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    
    const chemicals = await Chemical.find({ ...keyword, ...category });
    res.json(chemicals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single chemical
// @route   GET /api/chemicals/:id
// @access  Public
const getChemicalById = async (req, res) => {
  try {
    const chemical = await Chemical.findById(req.params.id).populate('addedBy', 'firstName lastName');
    if (chemical) {
      res.json(chemical);
    } else {
      res.status(404).json({ message: 'Chemical not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a chemical
// @route   POST /api/chemicals
// @access  Private/Admin
const createChemical = async (req, res) => {
  try {
    const chemical = new Chemical({
      ...req.body,
      addedBy: req.user._id
    });

    const createdChemical = await chemical.save();
    res.status(201).json(createdChemical);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a chemical
// @route   PUT /api/chemicals/:id
// @access  Private/Admin
const updateChemical = async (req, res) => {
  try {
    const chemical = await Chemical.findById(req.params.id);

    if (chemical) {
      Object.assign(chemical, req.body);
      const updatedChemical = await chemical.save();
      res.json(updatedChemical);
    } else {
      res.status(404).json({ message: 'Chemical not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a chemical
// @route   DELETE /api/chemicals/:id
// @access  Private/Admin
const deleteChemical = async (req, res) => {
  try {
    const chemical = await Chemical.findById(req.params.id);

    if (chemical) {
      await Chemical.deleteOne({ _id: chemical._id });
      res.json({ message: 'Chemical removed' });
    } else {
      res.status(404).json({ message: 'Chemical not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getChemicals,
  getChemicalById,
  createChemical,
  updateChemical,
  deleteChemical,
};
