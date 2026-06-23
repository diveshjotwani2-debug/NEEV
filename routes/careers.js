const express = require('express');
const excelDb = require('../utils/excelDb');

const router = express.Router();

// Get all careers
router.get('/', (req, res) => {
  try {
    const careers = excelDb.getCareers();
    res.status(200).json(careers);
  } catch (err) {
    console.error('Fetch careers error:', err);
    res.status(500).json({ error: 'Failed to retrieve career list from database.' });
  }
});

// Get all specializations (optional query: careerId)
router.get('/specializations', (req, res) => {
  try {
    const { careerId } = req.query;
    const specializations = excelDb.getSpecializations(careerId);
    res.status(200).json(specializations);
  } catch (err) {
    console.error('Fetch specializations error:', err);
    res.status(500).json({ error: 'Failed to retrieve specialization list.' });
  }
});

// Get specific specialization details
router.get('/specializations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const details = excelDb.getSpecializationDetail(id);
    if (!details) {
      return res.status(404).json({ error: `Specialization details for '${id}' not found.` });
    }
    res.status(200).json(details);
  } catch (err) {
    console.error('Fetch specialization details error:', err);
    res.status(500).json({ error: 'Failed to retrieve specialization details.' });
  }
});

module.exports = router;
