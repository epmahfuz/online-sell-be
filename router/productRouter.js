const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const logRequest = (req, res, next) => {
  console.log('Received a Product request');
  next();
};

router.post('/add', logRequest, (req, res) => {
  const { name, description, price, quantity, categoryId} = req.body;
  const newProduct = new Product({ name, description, price, quantity, categoryId });

  try{
    newProduct.save();
    res.status(201).json({ message: 'Product created successfully' });
  } catch(error){
    res.status(500).json({ error: 'Failed to save product' });
  }

});

router.get('/getAll', logRequest, (req, res) => {
  Product.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
})

router.get('/getByCategoryId/:categoryId', logRequest, (req, res) => {
  Product.find(
    {categoryId : req.params.categoryId}
  ).then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
})

module.exports = router;