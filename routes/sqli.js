const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/sqli/level1');
const level2Controller = require('../controllers/sqli/level2');

// SQL注入 Level 1
router.get('/level1', level1Controller.renderPage);
router.post('/level1', level1Controller.processQuery);

// SQL注入 Level 2
router.get('/level2', level2Controller.renderPage);
router.post('/level2', level2Controller.processQuery);

module.exports = router; 