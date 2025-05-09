const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/command/level1');
const level2Controller = require('../controllers/command/level2');

// 命令执行 Level 1
router.get('/level1', level1Controller.renderPage);
router.post('/level1', level1Controller.processCommand);

// 命令执行 Level 2
router.get('/level2', level2Controller.renderPage);
router.post('/level2', level2Controller.processCommand);

module.exports = router; 