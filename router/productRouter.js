const express = require('express');
const router = express.Router();
const Post = require('../models/post');

const logRequest = (req, res, next) => {
  console.log('Received a POST request');
  next();
};

router.post('/add', (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({ title, content });

  try{
    newPost.save();
    res.status(201).json({ message: 'Post created successfully' });
  } catch(error){
    res.status(500).json({ error: 'Failed to save post' });
  }
  
});

module.exports = router;