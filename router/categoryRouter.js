const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

const logRequest = (req, res, next) => {
  console.log('Received a Category request');
  next();
};

router.post('/add', logRequest, (req, res) => {
  const { name } = req.body;
  const newCategory = new Category({ name });

  try{
    newCategory.save();
    res.status(201).json({ message: 'Category created successfully' });
  } catch(error){
    res.status(500).json({ error: 'Failed to save category' });
  }
  
});

module.exports = router;