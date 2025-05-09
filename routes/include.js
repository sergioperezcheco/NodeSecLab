const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/include/level1');
const level2Controller = require('../controllers/include/level2');

// 文件包含 Level 1
router.get('/level1', level1Controller.renderPage);
router.get('/level1/file', level1Controller.includeFile);

// 文件包含 Level 2
router.get('/level2', level2Controller.renderPage);
router.get('/level2/file', level2Controller.includeFile);

module.exports = router; 