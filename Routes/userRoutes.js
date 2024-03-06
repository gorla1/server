const express = require('express');
const { registerUser, getAllUsers } = require('../Controllers/userController');
const router = express.Router();

// Define routes for the user router
router.get('/list', getAllUsers);

router.post('/register', registerUser);

router.get('/:id', (req, res) => {
  // Handle GET request for retrieving a specific user by ID
  res.send(`Get user with ID ${req.params.id}`);
});


router.put('/:id', (req, res) => {
  // Handle PUT request for updating a user by ID
  res.send(`Update user with ID ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
  // Handle DELETE request for deleting a user by ID
  res.send(`Delete user with ID ${req.params.id}`);
});

module.exports = router;