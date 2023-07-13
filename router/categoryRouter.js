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

router.get('/getAll', logRequest, (req, res) => {
  Category.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
})

router.get('/get/:categoryId', logRequest, (req, res) => {
  Category.find(
    {_id : req.params.categoryId}
  ).then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
})

module.exports = router;