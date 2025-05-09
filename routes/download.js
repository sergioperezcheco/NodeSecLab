const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/download/level1');
const level2Controller = require('../controllers/download/level2');

// 文件下载 Level 1
router.get('/level1', level1Controller.renderPage);
router.get('/level1/download', level1Controller.downloadFile);

// 文件下载 Level 2
router.get('/level2', level2Controller.renderPage);
router.get('/level2/download', level2Controller.downloadFile);

module.exports = router; 