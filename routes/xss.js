const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/xss/level1');
const level2Controller = require('../controllers/xss/level2');

// XSS Level 1
router.get('/level1', level1Controller.renderPage);
router.post('/level1', level1Controller.processInput);

// XSS Level 2
router.get('/level2', level2Controller.renderPage);
router.post('/level2', level2Controller.processInput);
router.get('/level2/messages', level2Controller.getMessages);

module.exports = router; 