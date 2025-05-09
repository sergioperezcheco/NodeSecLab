const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/middleware/level1');
const level2Controller = require('../controllers/middleware/level2');

// 中间件漏洞 Level 1 (Express原型污染)
router.get('/level1', level1Controller.renderPage);
router.post('/level1', level1Controller.processRequest);

// 中间件漏洞 Level 2 (Cookie解析漏洞)
router.get('/level2', level2Controller.renderPage);
router.post('/level2', level2Controller.processRequest);

module.exports = router; 