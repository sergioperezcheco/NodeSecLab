const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/xml/level1');
const level2Controller = require('../controllers/xml/level2');

// XML注入 Level 1
router.get('/level1', level1Controller.renderPage);
router.post('/level1', level1Controller.processXml);

// XML注入 Level 2
router.get('/level2', level2Controller.renderPage);
router.post('/level2', level2Controller.processXml);

module.exports = router; 