const express = require('express');
const router = express.Router();

// Custom middleware function
const logRequest = (req, res, next) => {
  console.log('Received a POST request');
  next();
};

// POST /api/posts
router.post('/', logRequest, (req, res) => {
  // Retrieve data from the request body
  const { title, content } = req.body;

  // Do something with the data (e.g., save it to a database)
  // ...

  // Send a response back to the client
  res.status(201).json({ message: 'Post created successfully' });
});

module.exports = router;