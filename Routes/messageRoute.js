const express = require('express');
const { addMessage, getAllMessages } = require('../Controllers/messageController');
const router = express.Router();

// Define routes for the message router
router.post('/', addMessage);
router.get('/:id', getAllMessages);

module.exports = router;