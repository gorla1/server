const express = require('express');
const { loginUser, getTokenUsingRefreshToken } = require('../Controllers/userController');
const router = express.Router();

// Define routes for the login router
router.post('/', loginUser);

router.post('/refresh', getTokenUsingRefreshToken);


module.exports = router;