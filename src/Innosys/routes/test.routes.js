const express = require('express');
const router = express.Router();
const Test = require('../models/Test.model');

// POST - Crear documento de prueba
router.post('/test', async (req, res) => {
  try {
    const { name, email, createdBy } = req.body;
    
    const testDoc = await Test.create({
      name,
      email,
      createdBy
    });
    
    res.status(201).json({
      success: true,
      message: 'Test document created successfully',
      data: testDoc
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating test document',
      error: error.message
    });
  }
});

// GET - Obtener todos los documentos de prueba
router.get('/test', async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching test documents',
      error: error.message
    });
  }
});

module.exports = router;